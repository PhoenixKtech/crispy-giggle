import { useEffect, useState } from 'react'
import { ExternalLink, Link2, Loader2, RefreshCw, Unlink } from 'lucide-react'
import { useLocalStorage } from '../lib/storage'
import {
  fetchProjects,
  fetchProjectTasks,
  fetchWorkspaces,
  type AsanaProject,
  type AsanaSettings,
  type AsanaTask,
  type AsanaWorkspace,
} from '../lib/asana'
import { Card, CardHeader } from './ui/Card'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { Input, Select, FormRow } from './ui/Field'
import { Badge } from './ui/Badge'
import { EmptyState } from './ui/EmptyState'
import { formatDateShort } from '../lib/format'

export function AsanaPanel() {
  const [settings, setSettings] = useLocalStorage<AsanaSettings | null>('asanaSettings', null)
  const [tasks, setTasks] = useLocalStorage<AsanaTask[]>('asanaTasksCache', [])
  const [lastSynced, setLastSynced] = useLocalStorage<string>('asanaLastSynced', '')
  const [connectOpen, setConnectOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState('')

  async function sync(current: AsanaSettings) {
    setSyncing(true)
    setSyncError('')
    try {
      const fresh = await fetchProjectTasks(current.token, current.projectGid)
      setTasks(fresh)
      setLastSynced(new Date().toISOString())
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : 'Sync failed.')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    if (settings && !lastSynced) sync(settings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  function disconnect() {
    setSettings(null)
    setTasks([])
    setLastSynced('')
    setSyncError('')
  }

  if (!settings) {
    return (
      <>
        <Card>
          <EmptyState
            icon={<Link2 size={22} />}
            title="Connect Asana"
            message="Pull a project's tasks into this dashboard as a live, read-only view — synced directly from your browser."
            action={
              <Button variant="primary" size="sm" onClick={() => setConnectOpen(true)}>
                Connect Asana
              </Button>
            }
          />
        </Card>
        <AsanaConnectModal
          open={connectOpen}
          onClose={() => setConnectOpen(false)}
          onConnected={(s) => {
            setSettings(s)
            setConnectOpen(false)
            sync(s)
          }}
        />
      </>
    )
  }

  return (
    <Card>
      <CardHeader
        title={`Asana — ${settings.projectName}`}
        subtitle={
          syncing
            ? 'Syncing…'
            : lastSynced
              ? `Last synced ${new Date(lastSynced).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
              : 'Not synced yet'
        }
        action={
          <div className="flex items-center gap-2">
            <Badge tone="emerald">Read-only</Badge>
            <Button variant="ghost" size="sm" icon={<RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />} onClick={() => sync(settings)} disabled={syncing}>
              Sync
            </Button>
            <Button variant="ghost" size="sm" icon={<Unlink size={13} />} onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        }
      />

      {syncError && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-600">
          {syncError}
        </div>
      )}

      {tasks.length === 0 && !syncing ? (
        <EmptyState title="No tasks found" message="This project has no tasks, or they haven't synced yet." />
      ) : (
        <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
          {tasks.map((t) => (
            <a
              key={t.gid}
              href={t.permalink_url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 rounded-lg border border-line px-3 py-2 transition-colors hover:border-ink/20 hover:bg-ink/[0.02]"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  t.completed ? 'border-emerald-500 bg-emerald-500' : 'border-ink/25'
                }`}
              />
              <span className={`flex-1 truncate text-[13px] ${t.completed ? 'text-ink/35 line-through' : 'text-ink/80'}`}>
                {t.name}
              </span>
              {t.assignee && <span className="shrink-0 text-[11.5px] text-ink/40">{t.assignee.name}</span>}
              {t.due_on && <span className="shrink-0 text-[11.5px] text-ink/40">{formatDateShort(t.due_on)}</span>}
              <ExternalLink size={12} className="shrink-0 text-ink/0 transition-colors group-hover:text-ink/30" />
            </a>
          ))}
        </div>
      )}
    </Card>
  )
}

type Step = 'token' | 'workspace' | 'project'

function AsanaConnectModal({
  open,
  onClose,
  onConnected,
}: {
  open: boolean
  onClose: () => void
  onConnected: (settings: AsanaSettings) => void
}) {
  const [step, setStep] = useState<Step>('token')
  const [token, setToken] = useState('')
  const [workspaces, setWorkspaces] = useState<AsanaWorkspace[]>([])
  const [workspaceGid, setWorkspaceGid] = useState('')
  const [projects, setProjects] = useState<AsanaProject[]>([])
  const [projectGid, setProjectGid] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function reset() {
    setStep('token')
    setToken('')
    setWorkspaces([])
    setWorkspaceGid('')
    setProjects([])
    setProjectGid('')
    setError('')
    setLoading(false)
  }

  async function handleTokenSubmit() {
    if (!token.trim()) return
    setLoading(true)
    setError('')
    try {
      const ws = await fetchWorkspaces(token.trim())
      if (ws.length === 0) throw new Error('No workspaces found for this token.')
      setWorkspaces(ws)
      if (ws.length === 1) {
        setWorkspaceGid(ws[0].gid)
        await loadProjects(ws[0].gid)
      } else {
        setStep('workspace')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function loadProjects(gid: string) {
    setLoading(true)
    setError('')
    try {
      const ps = await fetchProjects(token.trim(), gid)
      setProjects(ps)
      setStep('project')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function handleConnect() {
    const workspace = workspaces.find((w) => w.gid === workspaceGid)
    const project = projects.find((p) => p.gid === projectGid)
    if (!workspace || !project) return
    onConnected({
      token: token.trim(),
      workspaceGid: workspace.gid,
      workspaceName: workspace.name,
      projectGid: project.gid,
      projectName: project.name,
    })
    reset()
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose()
        reset()
      }}
      title="Connect Asana"
    >
      <div className="space-y-4">
        {step === 'token' && (
          <>
            <FormRow label="Personal Access Token">
              <Input
                autoFocus
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your Asana token"
                onKeyDown={(e) => e.key === 'Enter' && handleTokenSubmit()}
              />
            </FormRow>
            <p className="text-[12px] leading-relaxed text-ink/45">
              Create one from your Asana profile settings → Apps → Manage Developer Apps → Personal access
              tokens. It's stored only in this browser and used to call Asana's API directly — it isn't sent
              anywhere else.
            </p>
            {error && <p className="text-[12.5px] text-red-500">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleTokenSubmit} disabled={!token.trim() || loading}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : 'Continue'}
              </Button>
            </div>
          </>
        )}

        {step === 'workspace' && (
          <>
            <FormRow label="Workspace">
              <Select value={workspaceGid} onChange={(e) => setWorkspaceGid(e.target.value)}>
                <option value="">Select a workspace…</option>
                {workspaces.map((w) => (
                  <option key={w.gid} value={w.gid}>
                    {w.name}
                  </option>
                ))}
              </Select>
            </FormRow>
            {error && <p className="text-[12.5px] text-red-500">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setStep('token')}>
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => workspaceGid && loadProjects(workspaceGid)}
                disabled={!workspaceGid || loading}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : 'Continue'}
              </Button>
            </div>
          </>
        )}

        {step === 'project' && (
          <>
            <FormRow label="Project">
              <Select value={projectGid} onChange={(e) => setProjectGid(e.target.value)}>
                <option value="">Select a project…</option>
                {projects.map((p) => (
                  <option key={p.gid} value={p.gid}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </FormRow>
            {projects.length === 0 && !loading && (
              <p className="text-[12.5px] text-ink/45">No active projects found in this workspace.</p>
            )}
            {error && <p className="text-[12.5px] text-red-500">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setStep(workspaces.length > 1 ? 'workspace' : 'token')}>
                Back
              </Button>
              <Button variant="primary" size="sm" onClick={handleConnect} disabled={!projectGid}>
                Connect
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

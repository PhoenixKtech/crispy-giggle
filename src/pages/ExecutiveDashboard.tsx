import { Plus, Trash2, Sparkles } from 'lucide-react'
import { useLocalStorage } from '../lib/storage'
import { seedExecutive } from '../data/seed'
import type { DeptSnapshot, ExecutiveState, Priority_ } from '../types'
import { makeId } from '../lib/id'
import { Card, CardHeader } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { EditableField } from '../components/ui/EditableField'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Field'
import { Badge, statusTone } from '../components/ui/Badge'
import { useCurrentRole } from '../components/layout/Topbar'

const DEPARTMENTS = ['CEO', 'Operations', 'Finance', 'Marketing', 'Partnerships'] as const
const STATUSES: DeptSnapshot['status'][] = ['On Track', 'At Risk', 'Off Track']

function greetingWord() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function ExecutiveDashboard() {
  const [state, setState] = useLocalStorage<ExecutiveState>('executive', seedExecutive)
  const [role] = useCurrentRole()

  function updateKpi(id: string, patch: Partial<ExecutiveState['kpis'][number]>) {
    setState((s) => ({ ...s, kpis: s.kpis.map((k) => (k.id === id ? { ...k, ...patch } : k)) }))
  }
  function addKpi() {
    setState((s) => ({
      ...s,
      kpis: [...s.kpis, { id: makeId(), label: 'New Metric', value: '—', delta: '', trend: 'flat' }],
    }))
  }
  function removeKpi(id: string) {
    setState((s) => ({ ...s, kpis: s.kpis.filter((k) => k.id !== id) }))
  }

  function updatePriority(id: string, patch: Partial<Priority_>) {
    setState((s) => ({ ...s, priorities: s.priorities.map((p) => (p.id === id ? { ...p, ...patch } : p)) }))
  }
  function addPriority() {
    setState((s) => ({
      ...s,
      priorities: [
        ...s.priorities,
        { id: makeId(), title: 'New priority', owner: 'Operations', progress: 0, dueQuarter: 'Q3 2026' },
      ],
    }))
  }
  function removePriority(id: string) {
    setState((s) => ({ ...s, priorities: s.priorities.filter((p) => p.id !== id) }))
  }

  function updateDept(id: string, patch: Partial<DeptSnapshot>) {
    setState((s) => ({ ...s, departments: s.departments.map((d) => (d.id === id ? { ...d, ...patch } : d)) }))
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-gold-300">
            <Sparkles size={14} />
            <span className="text-[11px] font-medium uppercase tracking-[0.14em]">Company Pulse</span>
          </div>
          <h2 className="mt-2 font-display text-[22px] font-semibold text-white">
            {greetingWord()}, {role}.
          </h2>
          <EditableField
            value={state.pulse}
            as="textarea"
            onSave={(v) => setState((s) => ({ ...s, pulse: v }))}
            className="mt-2 -ml-2 max-w-3xl text-[14.5px] leading-relaxed text-white/70"
            inputClassName="!bg-white/10 !border-white/20 !text-white"
          />
        </div>
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] font-medium uppercase tracking-wide text-ink/45">Key Metrics</h3>
          <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={addKpi}>
            Add metric
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {state.kpis.map((kpi) => (
            <div key={kpi.id} className="group relative">
              <StatCard
                label={kpi.label}
                value={kpi.value}
                sub={kpi.delta}
                trend={kpi.trend}
                onLabelChange={(v) => updateKpi(kpi.id, { label: v })}
                onValueChange={(v) => updateKpi(kpi.id, { value: v })}
              />
              <button
                onClick={() => removeKpi(kpi.id)}
                className="absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-white text-ink/30 shadow-sm hover:text-red-500 group-hover:flex"
                aria-label="Remove metric"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader
            title="Priorities & OKRs"
            subtitle="What leadership is tracking this quarter"
            action={
              <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addPriority}>
                Add
              </Button>
            }
          />
          <div className="space-y-3">
            {state.priorities.map((p) => (
              <div key={p.id} className="group rounded-xl border border-line p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <EditableField
                    value={p.title}
                    onSave={(v) => updatePriority(p.id, { title: v })}
                    className="-ml-2 flex-1 text-[14px] font-medium text-ink"
                  />
                  <button
                    onClick={() => removePriority(p.id)}
                    className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink/25 hover:text-red-500 group-hover:flex"
                    aria-label="Remove priority"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Select
                    value={p.owner}
                    onChange={(e) => updatePriority(p.id, { owner: e.target.value as Priority_['owner'] })}
                    className="!h-7 !w-auto !py-0 text-[12px]"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </Select>
                  <EditableField
                    value={p.dueQuarter}
                    onSave={(v) => updatePriority(p.id, { dueQuarter: v })}
                    className="w-24 text-[12px] text-ink/50"
                  />
                  <div className="flex flex-1 items-center gap-2 min-w-[140px]">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={p.progress}
                      onChange={(e) => updatePriority(p.id, { progress: Number(e.target.value) })}
                      className="h-1.5 flex-1 cursor-pointer accent-emerald-500"
                    />
                    <span className="w-9 text-right text-[12px] font-medium text-ink/60">{p.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Department Snapshot" subtitle="Status by function lead" />
          <div className="space-y-3">
            {state.departments.map((d) => (
              <div key={d.id} className="rounded-xl border border-line p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-semibold text-ink">{d.department}</span>
                  <Select
                    value={d.status}
                    onChange={(e) => updateDept(d.id, { status: e.target.value as DeptSnapshot['status'] })}
                    className="!h-7 !w-auto !py-0 border-none !bg-transparent text-[11px] font-medium"
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </Select>
                </div>
                <div className="mt-1">
                  <Badge tone={statusTone(d.status)}>{d.status}</Badge>
                </div>
                <EditableField
                  value={d.note}
                  as="textarea"
                  onSave={(v) => updateDept(d.id, { note: v })}
                  className="-ml-2 mt-2 text-[13px] text-ink/60"
                />
                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-ink/40">
                  <span>Lead:</span>
                  <EditableField value={d.lead} onSave={(v) => updateDept(d.id, { lead: v })} className="text-ink/60" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

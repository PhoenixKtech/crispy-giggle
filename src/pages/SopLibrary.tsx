import { useMemo, useState } from 'react'
import { Plus, Trash2, Search, FileText } from 'lucide-react'
import { useLocalStorage } from '../lib/storage'
import { seedSops } from '../data/seed'
import type { Sop } from '../types'
import { makeId } from '../lib/id'
import { formatDate, todayIso } from '../lib/format'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, FormRow } from '../components/ui/Field'
import { EditableField } from '../components/ui/EditableField'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'

function emptySop(): Omit<Sop, 'id'> {
  return { title: '', category: 'Operations', owner: '', updatedAt: todayIso(), content: '' }
}

export function SopLibrary() {
  const [sops, setSops] = useLocalStorage<Sop[]>('sops', seedSops)
  const [selectedId, setSelectedId] = useState<string | null>(seedSops[0]?.id ?? null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [creating, setCreating] = useState<Omit<Sop, 'id'> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const categories = useMemo(() => ['All', ...Array.from(new Set(sops.map((s) => s.category)))], [sops])

  const filtered = useMemo(() => {
    return sops.filter((s) => {
      if (category !== 'All' && s.category !== category) return false
      if (query && !`${s.title} ${s.content}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [sops, category, query])

  const selected = sops.find((s) => s.id === selectedId) ?? null

  function update(id: string, patch: Partial<Sop>) {
    setSops((ss) => ss.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: todayIso() } : s)))
  }

  function createSop() {
    if (!creating || !creating.title.trim()) return
    const id = makeId()
    setSops((ss) => [...ss, { ...creating, id }])
    setSelectedId(id)
    setCreating(null)
  }

  function confirmDelete() {
    if (!deleteId) return
    setSops((ss) => ss.filter((s) => s.id !== deleteId))
    if (selectedId === deleteId) setSelectedId(null)
    setDeleteId(null)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] font-medium uppercase tracking-wide text-ink/45">Procedures</h3>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setCreating(emptySop())}>
            New SOP
          </Button>
        </div>

        <div className="relative mb-3">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search SOPs" className="pl-9" />
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                category === c ? 'bg-ink text-white' : 'bg-ink/5 text-ink/55 hover:bg-ink/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                selectedId === s.id ? 'border-emerald-500/50 bg-emerald-50/50' : 'border-line bg-paper hover:border-ink/20'
              }`}
            >
              <p className="truncate text-[13.5px] font-medium text-ink">{s.title || 'Untitled SOP'}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge tone="emerald">{s.category}</Badge>
                <span className="text-[11.5px] text-ink/40">Updated {formatDate(s.updatedAt)}</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <EmptyState icon={<FileText size={22} />} title="No SOPs found" message="Try a different search or category." />
          )}
        </div>
      </div>

      <div className="lg:col-span-3">
        {!selected ? (
          <Card className="flex h-full min-h-[300px] items-center justify-center">
            <EmptyState icon={<FileText size={22} />} title="Select a procedure" message="Choose an SOP from the list, or create a new one." />
          </Card>
        ) : (
          <Card>
            <div className="mb-4 flex items-start justify-between gap-3">
              <EditableField
                value={selected.title}
                onSave={(v) => update(selected.id, { title: v })}
                className="-ml-2 flex-1 font-display text-[18px] font-semibold text-ink"
              />
              <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => setDeleteId(selected.id)}>
                Delete
              </Button>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-ink/50">
              <span className="flex items-center gap-1.5">
                Category:
                <EditableField value={selected.category} onSave={(v) => update(selected.id, { category: v })} className="text-ink/70" />
              </span>
              <span className="flex items-center gap-1.5">
                Owner:
                <EditableField value={selected.owner} onSave={(v) => update(selected.id, { owner: v })} className="text-ink/70" />
              </span>
              <span>Last updated {formatDate(selected.updatedAt)}</span>
            </div>

            <EditableField
              value={selected.content}
              as="textarea"
              onSave={(v) => update(selected.id, { content: v })}
              placeholder="Write the procedure — purpose, steps, and ownership…"
              className="-ml-2 min-h-[320px] whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink/75"
              inputClassName="min-h-[320px] font-[inherit]"
            />
          </Card>
        )}
      </div>

      <Modal open={!!creating} onClose={() => setCreating(null)} title="New SOP">
        {creating && (
          <div className="space-y-4">
            <FormRow label="Title">
              <Input autoFocus value={creating.title} onChange={(e) => setCreating({ ...creating, title: e.target.value })} placeholder="Procedure title" />
            </FormRow>
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Category">
                <Input value={creating.category} onChange={(e) => setCreating({ ...creating, category: e.target.value })} />
              </FormRow>
              <FormRow label="Owner">
                <Input value={creating.owner} onChange={(e) => setCreating({ ...creating, owner: e.target.value })} placeholder="Name" />
              </FormRow>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setCreating(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={createSop} disabled={!creating.title.trim()}>
                Create SOP
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete SOP"
        message="This procedure will be permanently removed."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

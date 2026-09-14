import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, GripVertical, Calendar } from 'lucide-react'
import { useLocalStorage } from '../lib/storage'
import { seedTasks } from '../data/seed'
import type { Department, Priority, Task, TaskStatus } from '../types'
import { makeId } from '../lib/id'
import { formatDateShort, todayIso } from '../lib/format'
import { Button } from '../components/ui/Button'
import { Input, Select, FormRow, Textarea } from '../components/ui/Field'
import { Badge, priorityTone } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'

const DEPARTMENTS: Department[] = ['CEO', 'Operations', 'Finance', 'Marketing', 'Partnerships']
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical']
const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'Backlog', label: 'Backlog' },
  { status: 'In Progress', label: 'In Progress' },
  { status: 'Review', label: 'Review' },
  { status: 'Done', label: 'Done' },
]

const emptyDraft = (): Omit<Task, 'id' | 'createdAt'> => ({
  title: '',
  description: '',
  owner: '',
  department: 'Operations',
  priority: 'Medium',
  status: 'Backlog',
  dueDate: todayIso(),
})

export function TaskCommandCenter() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', seedTasks)
  const [deptFilter, setDeptFilter] = useState<'All' | Department>('All')
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All')
  const [query, setQuery] = useState('')
  const [modalTask, setModalTask] = useState<Task | null>(null)
  const [draft, setDraft] = useState<Omit<Task, 'id' | 'createdAt'> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null)

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (deptFilter !== 'All' && t.department !== deptFilter) return false
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false
      if (query && !`${t.title} ${t.owner}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [tasks, deptFilter, priorityFilter, query])

  function openNew() {
    setDraft(emptyDraft())
    setModalTask(null)
  }
  function openEdit(t: Task) {
    setDraft({ ...t })
    setModalTask(t)
  }
  function closeModal() {
    setDraft(null)
    setModalTask(null)
  }
  function saveDraft() {
    if (!draft || !draft.title.trim()) return
    if (modalTask) {
      setTasks((ts) => ts.map((t) => (t.id === modalTask.id ? { ...t, ...draft } : t)))
    } else {
      setTasks((ts) => [...ts, { ...draft, id: makeId(), createdAt: todayIso() }])
    }
    closeModal()
  }
  function confirmDelete() {
    if (!deleteId) return
    setTasks((ts) => ts.filter((t) => t.id !== deleteId))
    setDeleteId(null)
    closeModal()
  }
  function moveTask(id: string, status: TaskStatus) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks or owners" className="pl-9" />
        </div>
        <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value as Department | 'All')} className="!w-auto">
          <option value="All">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </Select>
        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')} className="!w-auto">
          <option value="All">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </Select>
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={openNew} className="ml-auto">
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.status)
          return (
            <div
              key={col.status}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverCol(col.status)
              }}
              onDragLeave={() => setDragOverCol((c) => (c === col.status ? null : c))}
              onDrop={(e) => {
                e.preventDefault()
                const id = e.dataTransfer.getData('text/task-id')
                if (id) moveTask(id, col.status)
                setDragOverCol(null)
              }}
              className={`rounded-2xl border p-3 transition-colors ${
                dragOverCol === col.status ? 'border-emerald-400 bg-emerald-50/40' : 'border-line bg-paper-soft/60'
              }`}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-[13px] font-semibold text-ink/70">{col.label}</h3>
                <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-medium text-ink/45">
                  {colTasks.length}
                </span>
              </div>
              <div className="min-h-[80px] space-y-2.5">
                {colTasks.map((t) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/task-id', t.id)}
                    onClick={() => openEdit(t)}
                    className="group cursor-pointer rounded-xl border border-line bg-paper p-3.5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical size={14} className="mt-0.5 shrink-0 cursor-grab text-ink/20" />
                      <p className="flex-1 text-[13.5px] font-medium leading-snug text-ink">{t.title}</p>
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-[22px]">
                      <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
                      <Badge>{t.department}</Badge>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between pl-[22px] text-[12px] text-ink/40">
                      <span className="truncate">{t.owner}</span>
                      <span className="flex shrink-0 items-center gap-1">
                        <Calendar size={11} />
                        {formatDateShort(t.dueDate)}
                      </span>
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-line/80 py-6 text-center text-[12px] text-ink/30">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && tasks.length > 0 && (
        <EmptyState title="No tasks match your filters" message="Try clearing the search or filters above." />
      )}

      <Modal open={!!draft} onClose={closeModal} title={modalTask ? 'Edit Task' : 'New Task'}>
        {draft && (
          <div className="space-y-4">
            <FormRow label="Title">
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Task title" autoFocus />
            </FormRow>
            <FormRow label="Description">
              <Textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="What needs to happen?"
              />
            </FormRow>
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Owner">
                <Input value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} placeholder="Name" />
              </FormRow>
              <FormRow label="Due date">
                <Input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
              </FormRow>
              <FormRow label="Department">
                <Select value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value as Department })}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </Select>
              </FormRow>
              <FormRow label="Priority">
                <Select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as Priority })}>
                  {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Select>
              </FormRow>
            </div>
            <FormRow label="Status">
              <Select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskStatus })}>
                {COLUMNS.map((c) => (
                  <option key={c.status}>{c.status}</option>
                ))}
              </Select>
            </FormRow>
            <div className="flex items-center justify-between pt-2">
              {modalTask ? (
                <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setDeleteId(modalTask.id)}>
                  Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={saveDraft} disabled={!draft.title.trim()}>
                  {modalTask ? 'Save changes' : 'Create task'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete task"
        message="This task will be permanently removed. This can't be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Plus, Trash2, Check, Users, CalendarDays } from 'lucide-react'
import { useLocalStorage } from '../lib/storage'
import { seedMeetings } from '../data/seed'
import type { ActionItem, Department, Meeting } from '../types'
import { makeId } from '../lib/id'
import { formatDate, todayIso } from '../lib/format'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Select, FormRow, Textarea } from '../components/ui/Field'
import { EditableField } from '../components/ui/EditableField'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'

const DEPARTMENTS: Department[] = ['CEO', 'Operations', 'Finance', 'Marketing', 'Partnerships']

function emptyMeeting(): Omit<Meeting, 'id'> {
  return {
    title: '',
    date: todayIso(),
    time: '10:00',
    attendees: '',
    department: 'Operations',
    agenda: '',
    notes: '',
    actionItems: [],
  }
}

export function MeetingAssistant() {
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('meetings', seedMeetings)
  const [selectedId, setSelectedId] = useState<string | null>(meetings[0]?.id ?? null)
  const [creating, setCreating] = useState<Omit<Meeting, 'id'> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { upcoming, past } = useMemo(() => {
    const today = todayIso()
    const sorted = [...meetings].sort((a, b) => a.date.localeCompare(b.date))
    return {
      upcoming: sorted.filter((m) => m.date >= today),
      past: sorted.filter((m) => m.date < today).reverse(),
    }
  }, [meetings])

  const selected = meetings.find((m) => m.id === selectedId) ?? null

  function update(id: string, patch: Partial<Meeting>) {
    setMeetings((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  function createMeeting() {
    if (!creating || !creating.title.trim()) return
    const id = makeId()
    setMeetings((ms) => [...ms, { ...creating, id }])
    setSelectedId(id)
    setCreating(null)
  }

  function confirmDelete() {
    if (!deleteId) return
    setMeetings((ms) => ms.filter((m) => m.id !== deleteId))
    if (selectedId === deleteId) setSelectedId(null)
    setDeleteId(null)
  }

  function addActionItem(meeting: Meeting) {
    const item: ActionItem = { id: makeId(), text: 'New action item', owner: '', dueDate: todayIso(), done: false }
    update(meeting.id, { actionItems: [...meeting.actionItems, item] })
  }
  function updateActionItem(meeting: Meeting, id: string, patch: Partial<ActionItem>) {
    update(meeting.id, { actionItems: meeting.actionItems.map((a) => (a.id === id ? { ...a, ...patch } : a)) })
  }
  function removeActionItem(meeting: Meeting, id: string) {
    update(meeting.id, { actionItems: meeting.actionItems.filter((a) => a.id !== id) })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] font-medium uppercase tracking-wide text-ink/45">Meetings</h3>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setCreating(emptyMeeting())}>
            New
          </Button>
        </div>

        <MeetingGroup label="Upcoming" meetings={upcoming} selectedId={selectedId} onSelect={setSelectedId} />
        <MeetingGroup label="Past" meetings={past} selectedId={selectedId} onSelect={setSelectedId} className="mt-5" />

        {meetings.length === 0 && (
          <EmptyState title="No meetings yet" message="Create your first meeting to get started." />
        )}
      </div>

      <div className="lg:col-span-3">
        {!selected ? (
          <Card className="flex h-full min-h-[300px] items-center justify-center">
            <EmptyState title="Select a meeting" message="Choose a meeting from the list, or create a new one." />
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

            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <FormRow label="Date">
                <Input type="date" value={selected.date} onChange={(e) => update(selected.id, { date: e.target.value })} />
              </FormRow>
              <FormRow label="Time">
                <Input type="time" value={selected.time} onChange={(e) => update(selected.id, { time: e.target.value })} />
              </FormRow>
              <FormRow label="Department">
                <Select value={selected.department} onChange={(e) => update(selected.id, { department: e.target.value as Department })}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </Select>
              </FormRow>
              <FormRow label="Attendees">
                <Input value={selected.attendees} onChange={(e) => update(selected.id, { attendees: e.target.value })} placeholder="Names" />
              </FormRow>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 text-[12px] font-medium uppercase tracking-wide text-ink/45">Agenda</p>
                <EditableField
                  value={selected.agenda}
                  as="textarea"
                  onSave={(v) => update(selected.id, { agenda: v })}
                  placeholder="Add agenda items…"
                  className="-ml-2 min-h-[100px] whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink/70"
                />
              </div>
              <div>
                <p className="mb-1.5 text-[12px] font-medium uppercase tracking-wide text-ink/45">Notes</p>
                <EditableField
                  value={selected.notes}
                  as="textarea"
                  onSave={(v) => update(selected.id, { notes: v })}
                  placeholder="Capture discussion notes…"
                  className="-ml-2 min-h-[100px] whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink/70"
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[12px] font-medium uppercase tracking-wide text-ink/45">Action Items</p>
                <Button variant="ghost" size="sm" icon={<Plus size={13} />} onClick={() => addActionItem(selected)}>
                  Add
                </Button>
              </div>
              <div className="space-y-1.5">
                {selected.actionItems.map((a) => (
                  <div key={a.id} className="group flex items-center gap-2.5 rounded-lg border border-line px-3 py-2">
                    <button
                      onClick={() => updateActionItem(selected, a.id, { done: !a.done })}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        a.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-ink/25 text-transparent hover:border-emerald-400'
                      }`}
                    >
                      <Check size={12} />
                    </button>
                    <EditableField
                      value={a.text}
                      onSave={(v) => updateActionItem(selected, a.id, { text: v })}
                      className={`flex-1 text-[13.5px] ${a.done ? 'text-ink/35 line-through' : 'text-ink/80'}`}
                    />
                    <EditableField
                      value={a.owner}
                      onSave={(v) => updateActionItem(selected, a.id, { owner: v })}
                      placeholder="Owner"
                      className="w-24 shrink-0 text-[12px] text-ink/45"
                    />
                    <input
                      type="date"
                      value={a.dueDate}
                      onChange={(e) => updateActionItem(selected, a.id, { dueDate: e.target.value })}
                      className="w-[124px] shrink-0 rounded-md border-none bg-transparent text-[12px] text-ink/45 outline-none"
                    />
                    <button
                      onClick={() => removeActionItem(selected, a.id)}
                      className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink/25 hover:text-red-500 group-hover:flex"
                      aria-label="Remove action item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {selected.actionItems.length === 0 && (
                  <p className="py-3 text-center text-[12.5px] text-ink/35">No action items yet.</p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      <Modal open={!!creating} onClose={() => setCreating(null)} title="New Meeting">
        {creating && (
          <div className="space-y-4">
            <FormRow label="Title">
              <Input
                autoFocus
                value={creating.title}
                onChange={(e) => setCreating({ ...creating, title: e.target.value })}
                placeholder="Meeting title"
              />
            </FormRow>
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Date">
                <Input type="date" value={creating.date} onChange={(e) => setCreating({ ...creating, date: e.target.value })} />
              </FormRow>
              <FormRow label="Time">
                <Input type="time" value={creating.time} onChange={(e) => setCreating({ ...creating, time: e.target.value })} />
              </FormRow>
              <FormRow label="Department">
                <Select value={creating.department} onChange={(e) => setCreating({ ...creating, department: e.target.value as Department })}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </Select>
              </FormRow>
              <FormRow label="Attendees">
                <Input value={creating.attendees} onChange={(e) => setCreating({ ...creating, attendees: e.target.value })} placeholder="Names" />
              </FormRow>
            </div>
            <FormRow label="Agenda">
              <Textarea rows={3} value={creating.agenda} onChange={(e) => setCreating({ ...creating, agenda: e.target.value })} />
            </FormRow>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setCreating(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={createMeeting} disabled={!creating.title.trim()}>
                Create meeting
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete meeting"
        message="This meeting and its action items will be permanently removed."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

function MeetingGroup({
  label,
  meetings,
  selectedId,
  onSelect,
  className = '',
}: {
  label: string
  meetings: Meeting[]
  selectedId: string | null
  onSelect: (id: string) => void
  className?: string
}) {
  if (meetings.length === 0) return null
  return (
    <div className={className}>
      <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wide text-ink/35">{label}</p>
      <div className="space-y-2">
        {meetings.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`w-full rounded-xl border p-3 text-left transition-colors ${
              selectedId === m.id ? 'border-emerald-500/50 bg-emerald-50/50' : 'border-line bg-paper hover:border-ink/20'
            }`}
          >
            <p className="truncate text-[13.5px] font-medium text-ink">{m.title || 'Untitled meeting'}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge>{m.department}</Badge>
              <span className="flex items-center gap-1 text-[11.5px] text-ink/40">
                <CalendarDays size={11} />
                {formatDate(m.date)}
              </span>
            </div>
            {m.attendees && (
              <p className="mt-1.5 flex items-center gap-1 truncate text-[11.5px] text-ink/35">
                <Users size={11} />
                {m.attendees}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

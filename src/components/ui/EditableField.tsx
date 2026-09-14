import { useEffect, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'

interface EditableFieldProps {
  value: string
  onSave: (next: string) => void
  as?: 'text' | 'textarea'
  className?: string
  inputClassName?: string
  placeholder?: string
}

/** Click-to-edit text. Enter (or blur) saves, Escape cancels. */
export function EditableField({
  value,
  onSave,
  as = 'text',
  className = '',
  inputClassName = '',
  placeholder,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      ref.current?.focus()
      ref.current?.select()
    }
  }, [editing])

  useEffect(() => {
    setDraft(value)
  }, [value])

  function commit() {
    setEditing(false)
    const trimmed = draft.trim()
    if (trimmed !== value) onSave(trimmed || value)
    else setDraft(value)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    const shared = {
      ref,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && as === 'text') {
          e.preventDefault()
          commit()
        } else if (e.key === 'Escape') {
          cancel()
        }
      },
      placeholder,
      className: `w-full rounded-md border border-emerald-500/40 bg-emerald-50/40 px-2 py-1 outline-none ring-2 ring-emerald-500/15 ${inputClassName}`,
    }
    return as === 'textarea' ? (
      <textarea {...shared} rows={4} />
    ) : (
      <input {...shared} />
    )
  }

  const hasWidth = /(^|\s)w-/.test(className)

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`group/edit inline-flex items-start gap-1.5 rounded-md px-2 py-1 text-left transition-colors hover:bg-ink/[0.04] ${
        hasWidth ? '' : 'w-full'
      } ${className}`}
    >
      <span className="flex-1">{value || <span className="text-ink/30">{placeholder}</span>}</span>
      <Pencil size={12} className="mt-1 shrink-0 text-ink/0 transition-colors group-hover/edit:text-ink/30" />
    </button>
  )
}

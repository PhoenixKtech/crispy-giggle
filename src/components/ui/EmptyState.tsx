import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode
  title: string
  message?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-12 text-center">
      {icon && <div className="mb-3 text-ink/25">{icon}</div>}
      <p className="text-[14px] font-medium text-ink/60">{title}</p>
      {message && <p className="mt-1 max-w-xs text-[13px] text-ink/40">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

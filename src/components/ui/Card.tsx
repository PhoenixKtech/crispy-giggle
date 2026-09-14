import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
}

export function Card({ children, className = '', padded = true, ...rest }: CardProps) {
  const hasBg = /(^|\s)bg-/.test(className)
  return (
    <div
      className={`rounded-2xl border border-line shadow-[var(--shadow-soft)] ${hasBg ? '' : 'bg-paper'} ${
        padded ? 'p-5 sm:p-6' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px] text-ink/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { EditableField } from './EditableField'

export function StatCard({
  label,
  value,
  sub,
  trend,
  onLabelChange,
  onValueChange,
}: {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'flat'
  onLabelChange?: (v: string) => void
  onValueChange?: (v: string) => void
}) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus
  const trendColor =
    trend === 'up' ? 'text-emerald-600 bg-emerald-50' : trend === 'down' ? 'text-red-500 bg-red-50' : 'text-ink/40 bg-ink/5'

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-2">
        {onLabelChange ? (
          <EditableField
            value={label}
            onSave={onLabelChange}
            className="text-[12px] font-medium uppercase tracking-wide text-ink/45 -ml-2"
          />
        ) : (
          <p className="px-2 text-[12px] font-medium uppercase tracking-wide text-ink/45">{label}</p>
        )}
        {trend && (
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${trendColor}`}>
            <TrendIcon size={13} />
          </span>
        )}
      </div>
      {onValueChange ? (
        <EditableField
          value={value}
          onSave={onValueChange}
          className="mt-1 -ml-2 font-display text-[26px] font-semibold tracking-tight text-ink"
        />
      ) : (
        <p className="mt-1 px-2 font-display text-[26px] font-semibold tracking-tight text-ink">{value}</p>
      )}
      {sub && <p className="px-2 text-[12px] text-ink/40">{sub}</p>}
    </div>
  )
}

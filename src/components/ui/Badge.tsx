import type { ReactNode } from 'react'

type Tone = 'emerald' | 'gold' | 'red' | 'amber' | 'slate' | 'ink'

const tones: Record<Tone, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-500/20',
  gold: 'bg-gold-100 text-gold-600 ring-1 ring-inset ring-gold-500/30',
  red: 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-500/20',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-500/25',
  slate: 'bg-ink/5 text-ink/60 ring-1 ring-inset ring-ink/10',
  ink: 'bg-ink text-white',
}

export function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function priorityTone(priority: string): Tone {
  switch (priority) {
    case 'Critical':
      return 'red'
    case 'High':
      return 'amber'
    case 'Medium':
      return 'emerald'
    default:
      return 'slate'
  }
}

export function statusTone(status: string): Tone {
  switch (status) {
    case 'On Track':
      return 'emerald'
    case 'At Risk':
      return 'amber'
    case 'Off Track':
      return 'red'
    case 'Done':
      return 'emerald'
    default:
      return 'slate'
  }
}

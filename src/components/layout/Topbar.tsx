import { useState } from 'react'
import { Menu, ChevronDown, Check } from 'lucide-react'
import { useLocalStorage } from '../../lib/storage'

const ROLES = ['Director of Operations', 'CEO', 'Finance', 'Marketing', 'Partnerships'] as const

export function useCurrentRole() {
  return useLocalStorage<string>('currentRole', ROLES[0])
}

export function Topbar({
  title,
  subtitle,
  onMenu,
}: {
  title: string
  subtitle?: string
  onMenu: () => void
}) {
  const [role, setRole] = useCurrentRole()
  const [open, setOpen] = useState(false)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-paper-soft/90 px-5 py-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="text-ink/60 hover:text-ink lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display text-[19px] font-semibold tracking-tight text-ink sm:text-[21px]">{title}</h1>
          {subtitle && <p className="text-[12.5px] text-ink/45">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-[12.5px] text-ink/40 md:block">{today}</span>
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            className="flex items-center gap-2 rounded-full border border-line bg-paper py-1.5 pl-1.5 pr-3 text-left transition-colors hover:border-ink/20"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-gold-300">
              {role
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')}
            </span>
            <span className="text-[13px] font-medium text-ink">{role}</span>
            <ChevronDown size={14} className="text-ink/40" />
          </button>
          {open && (
            <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-line bg-paper p-1.5 shadow-[var(--shadow-lift)]">
              <p className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-ink/40">
                Viewing as
              </p>
              {ROLES.map((r) => (
                <button
                  key={r}
                  onMouseDown={() => setRole(r)}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] text-ink/75 hover:bg-ink/5"
                >
                  {r}
                  {r === role && <Check size={14} className="text-emerald-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

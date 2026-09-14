import { NavLink } from 'react-router-dom'
import { LayoutGrid, ListChecks, Wallet, CalendarClock, BookOpenText, X } from 'lucide-react'

const nav = [
  { to: '/', label: 'Executive Dashboard', icon: LayoutGrid, end: true },
  { to: '/tasks', label: 'Task Command Center', icon: ListChecks },
  { to: '/finance', label: 'Finance Dashboard', icon: Wallet },
  { to: '/meetings', label: 'Meeting Assistant', icon: CalendarClock },
  { to: '/sops', label: 'SOP Library', icon: BookOpenText },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] shrink-0 flex-col bg-ink transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600">
              <span className="font-display text-[13px] font-bold text-white">M</span>
            </div>
            <div>
              <p className="font-display text-[14px] font-semibold leading-none text-white">MG OS</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-gold-300">Operations Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white lg:hidden" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  isActive ? 'bg-white/[0.08] text-white' : 'text-white/55 hover:bg-white/[0.05] hover:text-white/90'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-4 w-1 items-center rounded-full transition-colors ${
                      isActive ? 'bg-gold-500' : 'bg-transparent'
                    }`}
                  />
                  <item.icon size={17} strokeWidth={1.75} className={isActive ? 'text-emerald-400' : ''} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mx-3 mb-5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
          <p className="text-[11px] font-medium text-gold-300">Data storage</p>
          <p className="mt-1 text-[11.5px] leading-snug text-white/45">
            Everything here is saved locally in this browser. Nothing leaves your device.
          </p>
        </div>
      </aside>
    </>
  )
}

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Executive Dashboard', subtitle: 'Company-wide pulse at a glance' },
  '/tasks': { title: 'Task Command Center', subtitle: 'Everything in motion, across every department' },
  '/finance': { title: 'Finance Dashboard', subtitle: 'Revenue, spend, and runway' },
  '/meetings': { title: 'Meeting Assistant', subtitle: 'Agendas, notes, and action items' },
  '/sops': { title: 'SOP Library', subtitle: 'How MG runs, documented' },
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] ?? { title: 'MG OS', subtitle: '' }

  return (
    <div className="flex min-h-screen bg-paper-soft">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={meta.title} subtitle={meta.subtitle} onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useLocalStorage } from '../lib/storage'
import { seedFinance } from '../data/seed'
import type { BudgetLine, FinanceState, MonthlyFinance } from '../types'
import { makeId } from '../lib/id'
import { formatCompactCurrency, formatCurrency } from '../lib/format'
import { Card, CardHeader } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { EditableField } from '../components/ui/EditableField'
import { Button } from '../components/ui/Button'

export function FinanceDashboard() {
  const [state, setState] = useLocalStorage<FinanceState>('finance', seedFinance)

  function updateKpi(id: string, patch: Partial<FinanceState['kpis'][number]>) {
    setState((s) => ({ ...s, kpis: s.kpis.map((k) => (k.id === id ? { ...k, ...patch } : k)) }))
  }

  function updateMonth(id: string, patch: Partial<MonthlyFinance>) {
    setState((s) => ({ ...s, monthly: s.monthly.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))
  }
  function addMonth() {
    setState((s) => ({ ...s, monthly: [...s.monthly, { id: makeId(), month: 'New', revenue: 0, expenses: 0 }] }))
  }
  function removeMonth(id: string) {
    setState((s) => ({ ...s, monthly: s.monthly.filter((m) => m.id !== id) }))
  }

  function updateBudget(id: string, patch: Partial<BudgetLine>) {
    setState((s) => ({ ...s, budget: s.budget.map((b) => (b.id === id ? { ...b, ...patch } : b)) }))
  }
  function addBudget() {
    setState((s) => ({ ...s, budget: [...s.budget, { id: makeId(), category: 'New category', budget: 0, actual: 0 }] }))
  }
  function removeBudget(id: string) {
    setState((s) => ({ ...s, budget: s.budget.filter((b) => b.id !== id) }))
  }

  const totals = useMemo(() => {
    const budget = state.budget.reduce((a, b) => a + b.budget, 0)
    const actual = state.budget.reduce((a, b) => a + b.actual, 0)
    return { budget, actual, variance: budget - actual }
  }, [state.budget])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {state.kpis.map((k) => (
          <StatCard
            key={k.id}
            label={k.label}
            value={k.value}
            sub={k.sub}
            onLabelChange={(v) => updateKpi(k.id, { label: v })}
            onValueChange={(v) => updateKpi(k.id, { value: v })}
          />
        ))}
      </div>

      <Card>
        <CardHeader title="Revenue vs. Expenses" subtitle="Monthly trend — click any figure below to edit it" />
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={state.monthly} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f7b6c" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0f7b6c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a227" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c9a227" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e7e6e1" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#0b0c0c99' }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => formatCompactCurrency(Number(v))}
                tick={{ fontSize: 11, fill: '#0b0c0c66' }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value ?? 0))}
                contentStyle={{ borderRadius: 12, border: '1px solid #e7e6e1', fontSize: 13 }}
              />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0f7b6c" strokeWidth={2} fill="url(#rev)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#c9a227" strokeWidth={2} fill="url(#exp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink/40">
                <th className="py-2 pr-3 font-medium">Month</th>
                <th className="py-2 pr-3 font-medium">Revenue</th>
                <th className="py-2 pr-3 font-medium">Expenses</th>
                <th className="py-2 pr-3 font-medium">Net</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {state.monthly.map((m) => (
                <tr key={m.id} className="group border-b border-line/60 last:border-0">
                  <td className="py-1.5 pr-3">
                    <EditableField value={m.month} onSave={(v) => updateMonth(m.id, { month: v })} className="w-16" />
                  </td>
                  <td className="py-1.5 pr-3">
                    <EditableField
                      value={formatCurrency(m.revenue)}
                      onSave={(v) => updateMonth(m.id, { revenue: Number(v.replace(/[^0-9.-]/g, '')) || 0 })}
                      className="w-28"
                    />
                  </td>
                  <td className="py-1.5 pr-3">
                    <EditableField
                      value={formatCurrency(m.expenses)}
                      onSave={(v) => updateMonth(m.id, { expenses: Number(v.replace(/[^0-9.-]/g, '')) || 0 })}
                      className="w-28"
                    />
                  </td>
                  <td className="py-1.5 pr-3 font-medium text-ink/70">{formatCurrency(m.revenue - m.expenses)}</td>
                  <td>
                    <button
                      onClick={() => removeMonth(m.id)}
                      className="hidden h-6 w-6 items-center justify-center rounded-full text-ink/25 hover:text-red-500 group-hover:flex"
                      aria-label="Remove row"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={addMonth} className="mt-2">
            Add month
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Budget vs. Actual"
          subtitle={`Total variance: ${formatCurrency(totals.variance)}`}
          action={
            <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addBudget}>
              Add line
            </Button>
          }
        />
        <div className="space-y-2.5">
          {state.budget.map((b) => {
            const pct = b.budget > 0 ? Math.min(100, (b.actual / b.budget) * 100) : 0
            const over = b.actual > b.budget
            return (
              <div key={b.id} className="group rounded-xl border border-line p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <EditableField
                    value={b.category}
                    onSave={(v) => updateBudget(b.id, { category: v })}
                    className="-ml-2 flex-1 text-[13.5px] font-medium text-ink"
                  />
                  <button
                    onClick={() => removeBudget(b.id)}
                    className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink/25 hover:text-red-500 group-hover:flex"
                    aria-label="Remove line"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-4 text-[12.5px] text-ink/50">
                  <span className="flex items-center gap-1">
                    Budget:
                    <EditableField
                      value={formatCurrency(b.budget)}
                      onSave={(v) => updateBudget(b.id, { budget: Number(v.replace(/[^0-9.-]/g, '')) || 0 })}
                      className="w-28 text-ink/70"
                    />
                  </span>
                  <span className="flex items-center gap-1">
                    Actual:
                    <EditableField
                      value={formatCurrency(b.actual)}
                      onSave={(v) => updateBudget(b.id, { actual: Number(v.replace(/[^0-9.-]/g, '')) || 0 })}
                      className={`w-28 ${over ? 'text-red-500' : 'text-ink/70'}`}
                    />
                  </span>
                  <span className={`ml-auto font-medium ${over ? 'text-red-500' : 'text-emerald-600'}`}>
                    {over ? '+' : ''}
                    {formatCurrency(b.actual - b.budget)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/5">
                  <div
                    className={`h-full rounded-full ${over ? 'bg-red-400' : 'bg-emerald-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

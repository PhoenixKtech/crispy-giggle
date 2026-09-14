export type Department = 'CEO' | 'Operations' | 'Finance' | 'Marketing' | 'Partnerships'

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

// ---------- Executive Dashboard ----------

export interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
}

export interface Priority_ {
  id: string
  title: string
  owner: Department
  progress: number
  dueQuarter: string
}

export interface DeptSnapshot {
  id: string
  department: Department
  status: 'On Track' | 'At Risk' | 'Off Track'
  note: string
  lead: string
}

export interface ExecutiveState {
  greetingRole: Department
  pulse: string
  kpis: Kpi[]
  priorities: Priority_[]
  departments: DeptSnapshot[]
}

// ---------- Task Command Center ----------

export type TaskStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done'

export interface Task {
  id: string
  title: string
  description: string
  owner: string
  department: Department
  priority: Priority
  status: TaskStatus
  dueDate: string
  createdAt: string
}

// ---------- Finance Dashboard ----------

export interface MonthlyFinance {
  id: string
  month: string
  revenue: number
  expenses: number
}

export interface BudgetLine {
  id: string
  category: string
  budget: number
  actual: number
}

export interface FinanceKpi {
  id: string
  label: string
  value: string
  sub: string
}

export interface FinanceState {
  kpis: FinanceKpi[]
  monthly: MonthlyFinance[]
  budget: BudgetLine[]
}

// ---------- Meeting Assistant ----------

export interface ActionItem {
  id: string
  text: string
  owner: string
  dueDate: string
  done: boolean
}

export interface Meeting {
  id: string
  title: string
  date: string
  time: string
  attendees: string
  department: Department
  agenda: string
  notes: string
  actionItems: ActionItem[]
}

// ---------- SOP Library ----------

export interface Sop {
  id: string
  title: string
  category: string
  owner: string
  updatedAt: string
  content: string
}

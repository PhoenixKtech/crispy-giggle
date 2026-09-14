import type {
  BudgetLine,
  DeptSnapshot,
  ExecutiveState,
  FinanceKpi,
  FinanceState,
  Kpi,
  Meeting,
  MonthlyFinance,
  Priority_,
  Sop,
  Task,
} from '../types'
import { makeId } from '../lib/id'

// ---------- Executive Dashboard ----------

const kpis: Kpi[] = [
  { id: makeId(), label: 'Monthly Revenue', value: '$486,200', delta: '+8.4%', trend: 'up' },
  { id: makeId(), label: 'Gross Margin', value: '61.2%', delta: '+1.1 pt', trend: 'up' },
  { id: makeId(), label: 'Active Projects', value: '14', delta: '+2', trend: 'up' },
  { id: makeId(), label: 'Headcount', value: '38', delta: '+3', trend: 'up' },
  { id: makeId(), label: 'Cash Position', value: '$1.92M', delta: '-2.3%', trend: 'down' },
  { id: makeId(), label: 'Customer NPS', value: '71', delta: 'flat', trend: 'flat' },
]

const priorities: Priority_[] = [
  { id: makeId(), title: 'Close Series A extension', owner: 'CEO', progress: 65, dueQuarter: 'Q3 2026' },
  { id: makeId(), title: 'Launch EU fulfillment hub', owner: 'Operations', progress: 40, dueQuarter: 'Q4 2026' },
  { id: makeId(), title: 'Rebuild financial reporting stack', owner: 'Finance', progress: 80, dueQuarter: 'Q3 2026' },
  { id: makeId(), title: 'Rebrand + website relaunch', owner: 'Marketing', progress: 55, dueQuarter: 'Q3 2026' },
  { id: makeId(), title: 'Sign 3 new channel partners', owner: 'Partnerships', progress: 30, dueQuarter: 'Q4 2026' },
]

const departments: DeptSnapshot[] = [
  { id: makeId(), department: 'CEO', status: 'On Track', lead: 'V. Kariuki', note: 'Board deck finalized, investor calls this week.' },
  { id: makeId(), department: 'Operations', status: 'At Risk', lead: 'A. Mensah', note: 'Warehouse lease negotiation slipping a week.' },
  { id: makeId(), department: 'Finance', status: 'On Track', lead: 'R. Chen', note: 'Close cycle down to 4 business days.' },
  { id: makeId(), department: 'Marketing', status: 'On Track', lead: 'S. Novak', note: 'Q3 campaign outperforming CAC target by 12%.' },
  { id: makeId(), department: 'Partnerships', status: 'At Risk', lead: 'D. Osei', note: 'Two term sheets stuck in legal review.' },
]

export const seedExecutive: ExecutiveState = {
  greetingRole: 'Operations',
  pulse:
    'Company is tracking ahead of plan on revenue and margin. Two watch items: the EU warehouse lease and partner legal review — both flagged at risk this week.',
  kpis,
  priorities,
  departments,
}

// ---------- Task Command Center ----------

export const seedTasks: Task[] = [
  {
    id: makeId(),
    title: 'Finalize EU warehouse lease terms',
    description: 'Get redlines back from legal and confirm move-in date with landlord.',
    owner: 'A. Mensah',
    department: 'Operations',
    priority: 'Critical',
    status: 'In Progress',
    dueDate: addDays(2),
    createdAt: addDays(-6),
  },
  {
    id: makeId(),
    title: 'Prepare board deck v3',
    description: 'Incorporate Q2 actuals and updated runway model.',
    owner: 'V. Kariuki',
    department: 'CEO',
    priority: 'High',
    status: 'Review',
    dueDate: addDays(1),
    createdAt: addDays(-4),
  },
  {
    id: makeId(),
    title: 'Close month-end books',
    description: 'Reconcile AP/AR and post accruals for May.',
    owner: 'R. Chen',
    department: 'Finance',
    priority: 'High',
    status: 'Done',
    dueDate: addDays(-1),
    createdAt: addDays(-10),
  },
  {
    id: makeId(),
    title: 'Launch Q3 brand campaign',
    description: 'Finalize creative and schedule paid social rollout.',
    owner: 'S. Novak',
    department: 'Marketing',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: addDays(5),
    createdAt: addDays(-3),
  },
  {
    id: makeId(),
    title: 'Draft partner term sheet — Nairobi distributor',
    description: 'Coordinate with legal on exclusivity clause.',
    owner: 'D. Osei',
    department: 'Partnerships',
    priority: 'Critical',
    status: 'Backlog',
    dueDate: addDays(7),
    createdAt: addDays(-2),
  },
  {
    id: makeId(),
    title: 'Vendor onboarding — new 3PL',
    description: 'Complete security review and sign MSA.',
    owner: 'A. Mensah',
    department: 'Operations',
    priority: 'Medium',
    status: 'Backlog',
    dueDate: addDays(10),
    createdAt: addDays(-1),
  },
  {
    id: makeId(),
    title: 'Investor update email — June',
    description: 'Draft and circulate for CEO review before sending.',
    owner: 'V. Kariuki',
    department: 'CEO',
    priority: 'Medium',
    status: 'Backlog',
    dueDate: addDays(9),
    createdAt: addDays(-1),
  },
  {
    id: makeId(),
    title: 'Website relaunch QA pass',
    description: 'Cross-browser test new marketing site before go-live.',
    owner: 'S. Novak',
    department: 'Marketing',
    priority: 'High',
    status: 'Review',
    dueDate: addDays(3),
    createdAt: addDays(-5),
  },
]

function addDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

// ---------- Finance Dashboard ----------

const financeKpis: FinanceKpi[] = [
  { id: makeId(), label: 'MRR', value: '$162,400', sub: '+6.1% MoM' },
  { id: makeId(), label: 'Burn Rate', value: '$94,000/mo', sub: 'Net of revenue' },
  { id: makeId(), label: 'Runway', value: '20.4 months', sub: 'At current burn' },
  { id: makeId(), label: 'Cash on Hand', value: '$1.92M', sub: 'As of last close' },
]

const monthly: MonthlyFinance[] = [
  { id: makeId(), month: 'Jan', revenue: 398000, expenses: 341000 },
  { id: makeId(), month: 'Feb', revenue: 412500, expenses: 356000 },
  { id: makeId(), month: 'Mar', revenue: 431000, expenses: 362500 },
  { id: makeId(), month: 'Apr', revenue: 447800, expenses: 370200 },
  { id: makeId(), month: 'May', revenue: 462300, expenses: 379000 },
  { id: makeId(), month: 'Jun', revenue: 486200, expenses: 391500 },
]

const budget: BudgetLine[] = [
  { id: makeId(), category: 'Payroll & Benefits', budget: 210000, actual: 214500 },
  { id: makeId(), category: 'Marketing & Growth', budget: 65000, actual: 58200 },
  { id: makeId(), category: 'Software & Tools', budget: 18000, actual: 19850 },
  { id: makeId(), category: 'Facilities & Ops', budget: 42000, actual: 44100 },
  { id: makeId(), category: 'Professional Services', budget: 25000, actual: 21300 },
  { id: makeId(), category: 'Travel & Events', budget: 12000, actual: 9600 },
]

export const seedFinance: FinanceState = {
  kpis: financeKpis,
  monthly,
  budget,
}

// ---------- Meeting Assistant ----------

export const seedMeetings: Meeting[] = [
  {
    id: makeId(),
    title: 'Weekly Leadership Sync',
    date: addDays(1),
    time: '09:00',
    attendees: 'V. Kariuki, A. Mensah, R. Chen, S. Novak, D. Osei',
    department: 'CEO',
    agenda: '1. Board deck review\n2. EU warehouse lease status\n3. Q3 campaign readout\n4. Partner pipeline',
    notes: '',
    actionItems: [
      { id: makeId(), text: 'Send updated runway model to board', owner: 'R. Chen', dueDate: addDays(2), done: false },
      { id: makeId(), text: 'Confirm warehouse move-in date', owner: 'A. Mensah', dueDate: addDays(3), done: false },
    ],
  },
  {
    id: makeId(),
    title: 'Finance Close Review — May',
    date: addDays(-3),
    time: '14:00',
    attendees: 'R. Chen, V. Kariuki',
    department: 'Finance',
    agenda: '1. Close checklist\n2. Variance review\n3. Runway update',
    notes: 'Close completed in 4 business days, down from 7. AP/AR fully reconciled. Burn slightly under plan.',
    actionItems: [
      { id: makeId(), text: 'Update budget vs actual for June', owner: 'R. Chen', dueDate: addDays(-1), done: true },
    ],
  },
  {
    id: makeId(),
    title: 'Partnerships Pipeline Review',
    date: addDays(4),
    time: '11:30',
    attendees: 'D. Osei, V. Kariuki',
    department: 'Partnerships',
    agenda: '1. Nairobi distributor term sheet\n2. Two stalled legal reviews\n3. New inbound leads',
    notes: '',
    actionItems: [
      { id: makeId(), text: 'Escalate stalled reviews to outside counsel', owner: 'D. Osei', dueDate: addDays(6), done: false },
    ],
  },
]

// ---------- SOP Library ----------

export const seedSops: Sop[] = [
  {
    id: makeId(),
    title: 'Monthly Financial Close Checklist',
    category: 'Finance',
    owner: 'R. Chen',
    updatedAt: addDays(-8),
    content:
      'Purpose\nStandardize the monthly close so books are finalized within 5 business days.\n\nSteps\n1. Reconcile all bank and card accounts.\n2. Post accruals for outstanding vendor invoices.\n3. Review AP/AR aging and flag anything over 30 days.\n4. Update the revenue recognition schedule.\n5. Generate P&L, balance sheet, and cash flow statement.\n6. Circulate variance summary to leadership.\n\nOwner: Finance. Review cadence: quarterly.',
  },
  {
    id: makeId(),
    title: 'New Hire Onboarding',
    category: 'Operations',
    owner: 'A. Mensah',
    updatedAt: addDays(-20),
    content:
      'Purpose\nGet new hires productive within their first week.\n\nSteps\n1. Send offer letter and equipment request 1 week before start.\n2. Provision accounts (email, Slack, HRIS, tools) day before start.\n3. Assign onboarding buddy.\n4. Schedule 30/60/90 check-ins with manager.\n5. Complete compliance training within first 5 days.\n\nOwner: Operations. Review cadence: semi-annual.',
  },
  {
    id: makeId(),
    title: 'Campaign Launch Checklist',
    category: 'Marketing',
    owner: 'S. Novak',
    updatedAt: addDays(-5),
    content:
      'Purpose\nEnsure every paid campaign launches with consistent tracking and creative QA.\n\nSteps\n1. Confirm UTM parameters and conversion tracking.\n2. QA creative across placements and devices.\n3. Set budget caps and pacing alerts.\n4. Brief customer support on messaging.\n5. Schedule 48-hour performance check.\n\nOwner: Marketing. Review cadence: per campaign.',
  },
  {
    id: makeId(),
    title: 'New Partner Agreement Process',
    category: 'Partnerships',
    owner: 'D. Osei',
    updatedAt: addDays(-12),
    content:
      'Purpose\nMove a partner from term sheet to signed agreement predictably.\n\nSteps\n1. Draft term sheet using standard template.\n2. Internal review with Finance and Legal.\n3. Negotiate and finalize terms with partner.\n4. Legal drafts definitive agreement.\n5. Signature via e-sign, then kickoff call within 5 days.\n\nOwner: Partnerships. Review cadence: quarterly.',
  },
  {
    id: makeId(),
    title: 'Board Meeting Preparation',
    category: 'CEO',
    owner: 'V. Kariuki',
    updatedAt: addDays(-2),
    content:
      'Purpose\nEnsure board meetings run efficiently with complete materials.\n\nSteps\n1. Circulate agenda 1 week in advance.\n2. Collect department updates 5 days before.\n3. Finalize deck and financials 2 days before.\n4. Send pre-read materials 48 hours in advance.\n5. Distribute minutes within 3 days after.\n\nOwner: CEO. Review cadence: quarterly.',
  },
]

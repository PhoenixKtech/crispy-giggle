import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ExecutiveDashboard } from './pages/ExecutiveDashboard'
import { TaskCommandCenter } from './pages/TaskCommandCenter'
import { FinanceDashboard } from './pages/FinanceDashboard'
import { MeetingAssistant } from './pages/MeetingAssistant'
import { SopLibrary } from './pages/SopLibrary'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ExecutiveDashboard />} />
          <Route path="/tasks" element={<TaskCommandCenter />} />
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/meetings" element={<MeetingAssistant />} />
          <Route path="/sops" element={<SopLibrary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import EventList from './pages/EventList'
import EventDetail from './pages/EventDetail'
import ConsultationReport from './pages/ConsultationReport'
import DailyReport from './pages/DailyReport'
import Settlement from './pages/Settlement'
import EndReport from './pages/EndReport'
import Layout from './components/layout/Layout'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/report/consultation" element={<ConsultationReport />} />
          <Route path="/events/:id/report/daily/:day" element={<DailyReport />} />
          <Route path="/events/:id/settlement" element={<Settlement />} />
          <Route path="/events/:id/report/end" element={<EndReport />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import EventList from './pages/EventList'
import EventDetail from './pages/EventDetail'
import PreliminaryReport from './pages/PreliminaryReport'
import Profile from './pages/Profile'
import ConsultationReport from './pages/ConsultationReport'
import DailyReport from './pages/DailyReport'
import Settlement from './pages/Settlement'
import EndReport from './pages/EndReport'
import ItemOrder from './pages/ItemOrder'
import QueueStatus from './pages/QueueStatus'
import BusinessInvite from './pages/BusinessInvite'
import EventHistory from './pages/EventHistory'
import SettlementDetail from './pages/SettlementDetail'
import NoticeList from './pages/NoticeList'
import NoticeDetail from './pages/NoticeDetail'
import Layout from './components/layout/Layout'

// Admin Imports
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDispatch from './pages/admin/AdminDispatch'
import AdminSettlement from './pages/admin/AdminSettlement'

// Wrapper for Partner Layout to use with Nested Routes
const PartnerLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Partner App Routes */}
        <Route element={<PartnerLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/history" element={<EventHistory />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/report/preliminary" element={<PreliminaryReport />} />
          <Route path="/events/:id/report/consultation" element={<ConsultationReport />} />
          <Route path="/events/:id/report/daily/:day" element={<DailyReport />} />
          <Route path="/events/:id/settlement" element={<Settlement />} />
          <Route path="/events/:id/report/end" element={<EndReport />} />
          <Route path="/items/order" element={<ItemOrder />} />
          <Route path="/business/invite" element={<BusinessInvite />} />
          <Route path="/notice" element={<NoticeList />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />
          <Route path="/settlement/detail" element={<SettlementDetail />} />
          <Route path="/queue" element={<QueueStatus />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="dispatch" element={<AdminDispatch />} />
          <Route path="settlement" element={<AdminSettlement />} />
          <Route path="partners" element={<div className="p-8">준비 중입니다.</div>} />
          <Route path="notices" element={<div className="p-8">준비 중입니다.</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

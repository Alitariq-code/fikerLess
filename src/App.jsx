import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import PrivacyPolicy from './pages/PrivacyPolicy'
import DeleteUser from './pages/DeleteUser'
import CustomCursor from './components/CustomCursor'
import ScrollToTop from './components/ScrollToTop'

function AppContent() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminPage && <CustomCursor />}
      {!isAdminPage && <ScrollToTop />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/deleteUser" element={<DeleteUser />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App


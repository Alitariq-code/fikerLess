import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import DashboardTab from '../components/admin/DashboardTab'
import InternshipsTab from '../components/admin/InternshipsTab'
import AnalyticsTab from '../components/admin/AnalyticsTab'
import SettingsTab from '../components/admin/SettingsTab'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [breadcrumbItems, setBreadcrumbItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Add admin-page class to body to show default cursor
    document.body.classList.add('admin-page')
    return () => {
      document.body.classList.remove('admin-page')
    }
  }, [])

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('token')
    const userType = localStorage.getItem('user_type')
    
    if (!token || userType !== 'admin') {
      localStorage.removeItem('token')
      localStorage.removeItem('user_type')
      localStorage.removeItem('user_id')
      localStorage.removeItem('email')
      navigate('/admin/login')
      return
    }

    // Set user info
    setUserInfo({
      email: localStorage.getItem('email'),
      user_id: localStorage.getItem('user_id'),
      user_type: localStorage.getItem('user_type'),
    })

    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_type')
    localStorage.removeItem('user_id')
    localStorage.removeItem('email')
    navigate('/admin/login')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />
      case 'internships':
        return <InternshipsTab onBreadcrumbChange={setBreadcrumbItems} />
      case 'analytics':
        return <AnalyticsTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <DashboardTab />
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div className={`p-6 animate-fade-in transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Tab Content */}
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </div>
  )
}

export default AdminDashboard


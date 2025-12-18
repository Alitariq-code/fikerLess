import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import DashboardTab from '../components/admin/DashboardTab'
import InternshipsTab from '../components/admin/InternshipsTab'
import ArticlesTab from '../components/admin/ArticlesTab'
import UsersTab from '../components/admin/UsersTab'
import QuotesTab from '../components/admin/QuotesTab'
import NotificationsTab from '../components/admin/NotificationsTab'
import AchievementsTab from '../components/admin/AchievementsTab'
import AudiosTab from '../components/admin/AudiosTab'
import BookingsTab from '../components/admin/BookingsTab'
import AnalyticsTab from '../components/admin/AnalyticsTab'
import SettingsTab from '../components/admin/SettingsTab'

function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [breadcrumbItems, setBreadcrumbItems] = useState([])
  const navigate = useNavigate()

  // Initialize activeTab from URL on mount and sync with URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    const validTabs = ['dashboard', 'internships', 'articles', 'users', 'quotes', 'notifications', 'achievements', 'audios', 'bookings', 'analytics', 'settings']
    
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    } else if (!tabFromUrl) {
      // If no tab in URL, set default and update URL
      setSearchParams({ tab: 'dashboard' }, { replace: true })
      setActiveTab('dashboard')
    }
  }, [searchParams, setSearchParams])

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
    // Update URL without page reload
    setSearchParams({ tab })
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
      case 'articles':
        return <ArticlesTab onBreadcrumbChange={setBreadcrumbItems} />
      case 'users':
        return <UsersTab onBreadcrumbChange={setBreadcrumbItems} />
      case 'quotes':
        return <QuotesTab onBreadcrumbChange={setBreadcrumbItems} />
      case 'notifications':
        return <NotificationsTab onBreadcrumbChange={setBreadcrumbItems} />
      case 'achievements':
        return <AchievementsTab onBreadcrumbChange={setBreadcrumbItems} />
      case 'audios':
        return <AudiosTab onBreadcrumbChange={setBreadcrumbItems} />
      case 'bookings':
        return <BookingsTab onBreadcrumbChange={setBreadcrumbItems} />
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


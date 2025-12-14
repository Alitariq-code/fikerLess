import { useState, useEffect } from 'react'
import api from '../../services/api'

function DashboardTab() {
  const [stats, setStats] = useState({
    totalInternships: 0,
    activeInternships: 0,
    totalMentors: 0,
    totalCities: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalArticles: 0,
    publishedArticles: 0,
    totalQuotes: 0,
    todayQuotes: 0,
    totalTemplates: 0,
    activeTemplates: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllStats()
  }, [])

  const fetchAllStats = async () => {
    try {
      // Fetch all stats in parallel
      const [
        internshipsRes,
        usersRes,
        articlesRes,
        quotesRes,
        templatesRes,
      ] = await Promise.allSettled([
        api.get('/internships', { params: { page: 1, limit: 1000, includeInactive: 'true' } }),
        api.get('/users/admin/all', { params: { page: 1, limit: 1000 } }),
        api.get('/articles/admin/all', { params: { page: 1, limit: 1000 } }),
        api.get('/quote/admin/all', { params: { page: 1, limit: 1000 } }),
        api.get('/notifications/admin/templates/all', { params: { page: 1, limit: 1000 } }),
      ])

      // Process Internships
      let internships = []
      if (internshipsRes.status === 'fulfilled' && internshipsRes.value.data.success) {
        internships = internshipsRes.value.data.data || []
      }

      // Process Users
      let users = []
      if (usersRes.status === 'fulfilled' && usersRes.value.data.success) {
        users = usersRes.value.data.data || []
      }

      // Process Articles
      let articles = []
      if (articlesRes.status === 'fulfilled' && articlesRes.value.data.success) {
        articles = articlesRes.value.data.data || []
      }

      // Process Quotes
      let quotes = []
      if (quotesRes.status === 'fulfilled' && quotesRes.value.data.success) {
        quotes = quotesRes.value.data.data || []
      }

      // Process Templates
      let templates = []
      if (templatesRes.status === 'fulfilled' && templatesRes.value.data.success) {
        templates = templatesRes.value.data.data || []
      }

      // Calculate statistics
      const activeInternships = internships.filter((i) => i.is_active !== false).length
      const uniqueMentors = new Set(internships.map((i) => i.mentorName).filter(Boolean)).size
      const uniqueCities = new Set(internships.map((i) => i.city).filter(Boolean)).size
      
      const activeUsers = users.filter((u) => !u.is_disabled).length
      const publishedArticles = articles.filter((a) => a.status === 'published').length
      const todayQuotes = quotes.filter((q) => q.is_today_quote).length
      const activeTemplates = templates.filter((t) => t.is_active).length

      setStats({
        totalInternships: internships.length,
        activeInternships,
        totalMentors: uniqueMentors,
        totalCities: uniqueCities,
        totalUsers: users.length,
        activeUsers,
        totalArticles: articles.length,
        publishedArticles,
        totalQuotes: quotes.length,
        todayQuotes,
        totalTemplates: templates.length,
        activeTemplates,
      })

    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subtitle: `${stats.activeUsers} active`,
      icon: 'fa-users',
      color: 'blue',
      percentage: stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0,
    },
    {
      title: 'Internships',
      value: stats.totalInternships,
      subtitle: `${stats.activeInternships} active`,
      icon: 'fa-graduation-cap',
      color: 'green',
      percentage: stats.totalInternships > 0 ? Math.round((stats.activeInternships / stats.totalInternships) * 100) : 0,
    },
    {
      title: 'Articles',
      value: stats.totalArticles,
      subtitle: `${stats.publishedArticles} published`,
      icon: 'fa-newspaper',
      color: 'purple',
      percentage: stats.totalArticles > 0 ? Math.round((stats.publishedArticles / stats.totalArticles) * 100) : 0,
    },
    {
      title: 'Quotes',
      value: stats.totalQuotes,
      subtitle: `${stats.todayQuotes} today's quote`,
      icon: 'fa-quote-left',
      color: 'orange',
      percentage: stats.totalQuotes > 0 ? Math.round((stats.todayQuotes / stats.totalQuotes) * 100) : 0,
    },
    {
      title: 'Templates',
      value: stats.totalTemplates,
      subtitle: `${stats.activeTemplates} active`,
      icon: 'fa-bell',
      color: 'pink',
      percentage: stats.totalTemplates > 0 ? Math.round((stats.activeTemplates / stats.totalTemplates) * 100) : 0,
    },
    {
      title: 'Mentors',
      value: stats.totalMentors,
      subtitle: `${stats.totalCities} cities`,
      icon: 'fa-user-tie',
      color: 'indigo',
      percentage: 100,
    },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        icon: 'bg-blue-100 text-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-200',
      },
      green: {
        bg: 'from-green-500 to-green-600',
        icon: 'bg-green-100 text-green-600',
        text: 'text-green-600',
        border: 'border-green-200',
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        icon: 'bg-purple-100 text-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-200',
      },
      orange: {
        bg: 'from-orange-500 to-orange-600',
        icon: 'bg-orange-100 text-orange-600',
        text: 'text-orange-600',
        border: 'border-orange-200',
      },
      pink: {
        bg: 'from-pink-500 to-pink-600',
        icon: 'bg-pink-100 text-pink-600',
        text: 'text-pink-600',
        border: 'border-pink-200',
      },
      indigo: {
        bg: 'from-indigo-500 to-indigo-600',
        icon: 'bg-indigo-100 text-indigo-600',
        text: 'text-indigo-600',
        border: 'border-indigo-200',
      },
    }
    return colors[color] || colors.blue
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const colors = getColorClasses(card.color)
          return (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
                  <p className={`text-4xl font-bold ${colors.text} mb-2`}>{card.value}</p>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                </div>
                <div className={`${colors.icon} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`fas ${card.icon} text-2xl`}></i>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Active Rate</span>
                  <span className={`text-xs font-semibold ${colors.text}`}>{card.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.bg} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${card.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Content Distribution Chart */}
      <div className="glass-card rounded-2xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-chart-pie text-blue-600 mr-3"></i>
          Content Distribution
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Internships', value: stats.totalInternships, color: 'bg-green-500' },
            { label: 'Articles', value: stats.totalArticles, color: 'bg-purple-500' },
            { label: 'Quotes', value: stats.totalQuotes, color: 'bg-orange-500' },
            { label: 'Templates', value: stats.totalTemplates, color: 'bg-pink-500' },
          ].map((item, idx) => {
            const total = stats.totalInternships + stats.totalArticles + stats.totalQuotes + stats.totalTemplates
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
            return (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-24 text-sm text-gray-600 font-medium">{item.label}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-12 text-right">{item.value}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


export default DashboardTab


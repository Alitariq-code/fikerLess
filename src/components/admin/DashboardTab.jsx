import { useState, useEffect } from 'react'
import api from '../../services/api'

function DashboardTab() {
  const [stats, setStats] = useState({
    totalInternships: 0,
    activeInternships: 0,
    totalMentors: 0,
    totalCities: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/internships', { 
        params: { page: 1, limit: 1000, includeInactive: 'true' } 
      })
      if (response.data.success) {
        const internships = response.data.data || []
        const activeCount = internships.filter((i) => i.is_active !== false).length
        const uniqueMentors = new Set(internships.map((i) => i.mentorName)).size
        const uniqueCities = new Set(internships.map((i) => i.city)).size

        setStats({
          totalInternships: internships.length,
          activeInternships: activeCount,
          totalMentors: uniqueMentors,
          totalCities: uniqueCities,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Internships',
      value: stats.totalInternships,
      subtitle: 'All programs',
      icon: 'fa-graduation-cap',
      color: 'blue',
      trend: '+12%',
      trendLabel: 'vs last month',
    },
    {
      title: 'Active Internships',
      value: stats.activeInternships,
      subtitle: 'Currently running',
      icon: 'fa-check-circle',
      color: 'green',
      trend: '100%',
      trendLabel: 'uptime',
    },
    {
      title: 'Total Mentors',
      value: stats.totalMentors,
      subtitle: 'Expert professionals',
      icon: 'fa-users',
      color: 'purple',
      trend: '+5',
      trendLabel: 'new this month',
    },
    {
      title: 'Cities Covered',
      value: stats.totalCities,
      subtitle: 'Nationwide reach',
      icon: 'fa-map-marker-alt',
      color: 'orange',
      trend: '+3',
      trendLabel: 'new locations',
    },
  ]

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
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="glass-card rounded-2xl p-6 card-hover group animate-slide-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className={`text-3xl font-bold text-${card.color}-600 mt-1`}>{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
              </div>
              <div
                className={`bg-gradient-to-br from-${card.color}-100 to-${card.color}-200 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}
              >
                <i className={`fas ${card.icon} text-${card.color}-600 text-2xl`}></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`text-${card.color}-500 font-medium`}>{card.trend}</span>
              <span className="text-gray-400 ml-2">{card.trendLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardTab


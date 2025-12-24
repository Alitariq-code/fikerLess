import { useState, useEffect } from 'react'
import api from '../../services/api'
import StatCard from './dashboard/StatCard'
import LineChart from './dashboard/LineChart'
import BarChart from './dashboard/BarChart'
import PieChart from './dashboard/PieChart'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import RecentActivity from './dashboard/RecentActivity'
import TopPerformers from './dashboard/TopPerformers'
import DateRangePicker from './dashboard/DateRangePicker'
import UserSelector from './dashboard/UserSelector'
import UserInsights from './dashboard/UserInsights'

function DashboardTab() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState(null)
  
  // Date ranges for different sections
  const [userGrowthRange, setUserGrowthRange] = useState({ start: null, end: null })
  const [activityTrendRange, setActivityTrendRange] = useState({ start: null, end: null })
  const [moodDistributionRange, setMoodDistributionRange] = useState({ start: null, end: null })
  const [userTypeRange, setUserTypeRange] = useState({ start: null, end: null })

  useEffect(() => {
    fetchDashboardStats()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardStats, 300000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardStats = async (startDate = null, endDate = null) => {
    try {
      const params = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      
      const response = await api.get('/dashboard/admin/stats', { params })
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (section, startDate, endDate) => {
    if (section === 'userGrowth') {
      setUserGrowthRange({ start: startDate, end: endDate })
      fetchDashboardStats(startDate, endDate)
    } else if (section === 'activityTrend') {
      setActivityTrendRange({ start: startDate, end: endDate })
      fetchDashboardStats(startDate, endDate)
    } else if (section === 'moodDistribution') {
      setMoodDistributionRange({ start: startDate, end: endDate })
      fetchDashboardStats(startDate, endDate)
    } else if (section === 'userType') {
      setUserTypeRange({ start: startDate, end: endDate })
      fetchDashboardStats(startDate, endDate)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* User Insights Section - Top of Dashboard */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <i className="fas fa-user-chart text-white"></i>
            </div>
            User Insights
          </h2>
          <p className="text-gray-600">Select a user to view their complete activity and engagement details</p>
        </div>
        <div className="mb-6">
          <UserSelector
            onUserSelect={setSelectedUserId}
            selectedUserId={selectedUserId}
          />
        </div>
        {selectedUserId && (
          <UserInsights 
            userId={selectedUserId} 
            onClose={() => setSelectedUserId(null)}
          />
        )}
      </div>

      {/* Header with Quick Stats */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
            <p className="text-gray-600">Complete system monitoring and insights</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Last Updated</p>
            <p className="text-lg font-semibold text-gray-700">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-users text-blue-600 text-lg"></i>
            </div>
            <p className="text-xs text-blue-600 font-medium mb-1">Total Users</p>
            <p className="text-2xl font-bold text-blue-800">{stats.users.total.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-user-check text-green-600 text-lg"></i>
            </div>
            <p className="text-xs text-green-600 font-medium mb-1">Active Today</p>
            <p className="text-2xl font-bold text-green-800">{stats.users.active_7d.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-calendar-check text-purple-600 text-lg"></i>
            </div>
            <p className="text-xs text-purple-600 font-medium mb-1">Sessions</p>
            <p className="text-2xl font-bold text-purple-800">{stats.sessions.total.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-comments text-pink-600 text-lg"></i>
            </div>
            <p className="text-xs text-pink-600 font-medium mb-1">Forum Posts</p>
            <p className="text-2xl font-bold text-pink-800">{stats.forum.total_posts.toLocaleString()}</p>
          </div>
          {stats.revenue && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <i className="fas fa-dollar-sign text-orange-600 text-lg"></i>
              </div>
              <p className="text-xs text-orange-600 font-medium mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-orange-800">PKR {stats.revenue.total.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* User Engagement Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <i className="fas fa-users text-white text-xl"></i>
            </div>
            User Engagement
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Users"
            value={stats.users.total}
            subtitle={`${stats.users.active} active, ${stats.users.disabled} disabled`}
            icon="fa-users"
            color="blue"
            percentage={stats.users.total > 0 ? Math.round((stats.users.active / stats.users.total) * 100) : 0}
          />
          <StatCard
            title="Active Users (7d)"
            value={stats.users.active_7d}
            subtitle={`${stats.users.active_30d} active (30d)`}
            icon="fa-user-check"
            color="green"
          />
          <StatCard
            title="New Users"
            value={stats.users.new_today}
            subtitle={`${stats.users.new_this_week} this week, ${stats.users.new_this_month} this month`}
            icon="fa-user-plus"
            color="purple"
          />
          <StatCard
            title="Email Verified"
            value={stats.users.verified}
            subtitle={`${stats.users.email_verification_rate}% verification rate`}
            icon="fa-envelope-check"
            color="orange"
            percentage={stats.users.email_verification_rate}
          />
        </div>

        {/* User Type Distribution & Growth Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {stats.users.type_distribution && stats.users.type_distribution.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <i className="fas fa-chart-pie text-blue-600 mr-2"></i>
                  User Type Distribution
                </h4>
                <div className="w-64">
                  <DateRangePicker
                    onDateChange={(start, end) => handleDateRangeChange('userType', start, end)}
                    defaultStartDate={userTypeRange.start}
                    defaultEndDate={userTypeRange.end}
                    showLabel={false}
                    size="sm"
                    position="bottom"
                  />
                </div>
              </div>
              <PieChart 
                data={stats.users.type_distribution.map(item => ({ 
                  name: item.type.charAt(0).toUpperCase() + item.type.slice(1), 
                  value: item.count 
                }))}
                height={250}
              />
            </div>
          )}
          
          {stats.users.growth_trend && stats.users.growth_trend.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <i className="fas fa-chart-line text-green-600 mr-2"></i>
                  User Growth
                </h4>
                <div className="w-64">
                  <DateRangePicker
                    onDateChange={(start, end) => handleDateRangeChange('userGrowth', start, end)}
                    defaultStartDate={userGrowthRange.start}
                    defaultEndDate={userGrowthRange.end}
                    showLabel={false}
                    size="sm"
                    position="bottom"
                  />
                </div>
              </div>
              <LineChart 
                data={stats.users.growth_trend.map(item => ({ date: item.date, count: item.count }))}
                dataKey="count"
                name="New Users"
                color="#3b82f6"
                height={250}
              />
            </div>
          )}
        </div>

        {/* Additional User Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Demographics Completion</p>
                <p className="text-2xl font-bold text-blue-800">{stats.users.demographics_completion_rate}%</p>
                <p className="text-xs text-blue-600 mt-1">{stats.users.with_demographics} users</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-clipboard-user text-blue-600"></i>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Active Rate (30d)</p>
                <p className="text-2xl font-bold text-green-800">{stats.users.active_30d}</p>
                <p className="text-xs text-green-600 mt-1">Active users</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-chart-line text-green-600"></i>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">New This Month</p>
                <p className="text-2xl font-bold text-purple-800">{stats.users.new_this_month}</p>
                <p className="text-xs text-purple-600 mt-1">New registrations</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-user-plus text-purple-600"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Therapy Sessions Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <i className="fas fa-calendar-check text-white text-xl"></i>
            </div>
            Therapy Sessions
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Sessions"
            value={stats.sessions.total}
            subtitle={`${stats.sessions.completed} completed`}
            icon="fa-calendar"
            color="green"
            percentage={stats.sessions.completion_rate}
          />
          <StatCard
            title="This Week"
            value={stats.sessions.this_week}
            subtitle={`${stats.sessions.this_month} this month`}
            icon="fa-calendar-week"
            color="blue"
          />
          <StatCard
            title="Upcoming"
            value={stats.sessions.upcoming}
            subtitle={`${stats.sessions.confirmed} confirmed`}
            icon="fa-clock"
            color="purple"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats.sessions.completion_rate}%`}
            subtitle={`${stats.sessions.completed} of ${stats.sessions.total}`}
            icon="fa-check-circle"
            color="teal"
            percentage={stats.sessions.completion_rate}
          />
        </div>

        {/* Session Status Breakdown */}
        {stats.sessions.status_breakdown && stats.sessions.status_breakdown.length > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-chart-pie text-green-600 mr-2"></i>
              Session Status Distribution
            </h4>
            <PieChart 
              data={stats.sessions.status_breakdown.map(item => ({ 
                name: item.status, 
                value: item.count 
              }))}
              height={250}
            />
          </div>
        )}
      </div>

      {/* Forum Activity Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <i className="fas fa-comments text-white text-xl"></i>
            </div>
            Forum Activity
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Posts"
            value={stats.forum.total_posts}
            subtitle={`${stats.forum.posts_today} today, ${stats.forum.posts_this_week} this week`}
            icon="fa-file-alt"
            color="purple"
          />
          <StatCard
            title="Total Comments"
            value={stats.forum.total_comments}
            subtitle={`${stats.forum.comments_today} today`}
            icon="fa-comments"
            color="blue"
          />
          <StatCard
            title="Total Likes"
            value={stats.forum.total_likes}
            subtitle={`${stats.forum.active_users} active users`}
            icon="fa-heart"
            color="red"
          />
          <StatCard
            title="Engagement"
            value={stats.forum.posts_this_week}
            subtitle="Posts this week"
            icon="fa-chart-line"
            color="green"
          />
        </div>
      </div>

      {/* Wellness Tracking Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <i className="fas fa-heart-pulse text-white text-xl"></i>
            </div>
            Wellness Tracking
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Mood Entries"
            value={stats.wellness.mood.total_entries}
            subtitle={`${stats.wellness.mood.entries_today} today, ${stats.wellness.mood.entries_this_week} this week`}
            icon="fa-smile"
            color="pink"
          />
          <StatCard
            title="Journal Entries"
            value={stats.wellness.journal.total_entries}
            subtitle={`${stats.wellness.journal.entries_today} today, ${stats.wellness.journal.entries_this_week} this week`}
            icon="fa-book"
            color="indigo"
          />
          <StatCard
            title="Active Goals"
            value={stats.wellness.goals.active}
            subtitle={`${stats.wellness.goals.completed} completed`}
            icon="fa-bullseye"
            color="green"
            percentage={stats.wellness.goals.completion_rate}
          />
          <StatCard
            title="Goal Completion"
            value={`${stats.wellness.goals.completion_rate}%`}
            subtitle={`${stats.wellness.goals.completed} of ${stats.wellness.goals.total}`}
            icon="fa-trophy"
            color="orange"
            percentage={stats.wellness.goals.completion_rate}
          />
        </div>

        {/* Mood Distribution & Goal Category Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats.wellness.mood.distribution && stats.wellness.mood.distribution.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <i className="fas fa-chart-bar text-pink-600 mr-2"></i>
                  Mood Distribution
                </h4>
                <div className="w-64">
                  <DateRangePicker
                    onDateChange={(start, end) => handleDateRangeChange('moodDistribution', start, end)}
                    defaultStartDate={moodDistributionRange.start}
                    defaultEndDate={moodDistributionRange.end}
                    showLabel={false}
                    size="sm"
                    position="bottom"
                  />
                </div>
              </div>
              <BarChart 
                data={stats.wellness.mood.distribution.map(item => ({ 
                  name: item.mood.charAt(0).toUpperCase() + item.mood.slice(1), 
                  count: item.count 
                }))}
                dataKey="count"
                name="Mood Entries"
                color="#ec4899"
                height={250}
              />
            </div>
          )}
          
          {stats.wellness.goals.category_breakdown && stats.wellness.goals.category_breakdown.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-chart-pie text-green-600 mr-2"></i>
                Goals by Category
              </h4>
              <PieChart 
                data={stats.wellness.goals.category_breakdown.map(item => ({ 
                  name: item.category, 
                  value: item.count 
                }))}
                height={250}
              />
            </div>
          )}
        </div>
      </div>

      {/* Activity Trends Chart */}
      {stats.activity_trend && stats.activity_trend.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
                <i className="fas fa-chart-area text-white text-xl"></i>
              </div>
              Activity Trends
            </h3>
            <div className="w-64">
              <DateRangePicker
                onDateChange={(start, end) => handleDateRangeChange('activityTrend', start, end)}
                defaultStartDate={activityTrendRange.start}
                defaultEndDate={activityTrendRange.end}
                showLabel={false}
                size="md"
                position="bottom"
              />
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
            <ResponsiveContainer width="100%" height={350}>
              <RechartsLineChart data={stats.activity_trend.map(item => ({ 
                date: item.date, 
                moods: item.moods,
                journals: item.journals,
                posts: item.posts,
                comments: item.comments,
              }))} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => {
                    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                      const [year, month, day] = value.split('-')
                      return `${parseInt(month)}/${parseInt(day)}`
                    }
                    return value
                  }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="moods" name="Mood Entries" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="journals" name="Journal Entries" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="posts" name="Forum Posts" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="comments" name="Comments" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Content, Specialists & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <i className="fas fa-newspaper text-white"></i>
            </div>
            Content
          </h3>
          <div className="space-y-4">
            <StatCard
              title="Articles"
              value={stats.content.articles.total}
              subtitle={`${stats.content.articles.published} published, ${stats.content.articles.total_views.toLocaleString()} views`}
              icon="fa-newspaper"
              color="blue"
              percentage={stats.content.articles.total > 0 ? Math.round((stats.content.articles.published / stats.content.articles.total) * 100) : 0}
            />
            <StatCard
              title="Audio Content"
              value={stats.content.audio.total}
              subtitle={`${stats.content.audio.active} active, ${stats.content.audio.total_plays.toLocaleString()} plays`}
              icon="fa-headphones"
              color="purple"
            />
            <StatCard
              title="Quotes"
              value={stats.content.quotes.total}
              subtitle={`${stats.content.quotes.today} today's quote`}
              icon="fa-quote-left"
              color="orange"
            />
            <StatCard
              title="Templates"
              value={stats.content.templates.total}
              subtitle={`${stats.content.templates.active} active`}
              icon="fa-bell"
              color="pink"
            />
          </div>
        </div>

        {/* Specialists Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <i className="fas fa-user-md text-white"></i>
            </div>
            Specialists
          </h3>
          <div className="space-y-4">
            <StatCard
              title="Total Specialists"
              value={stats.specialists.total}
              subtitle={`${stats.specialists.verified} verified`}
              icon="fa-user-md"
              color="green"
              percentage={stats.specialists.total > 0 ? Math.round((stats.specialists.verified / stats.specialists.total) * 100) : 0}
            />
            <StatCard
              title="Completed Profiles"
              value={stats.specialists.completed_profiles}
              subtitle={`${stats.specialists.total_reviews.toLocaleString()} total reviews`}
              icon="fa-user-check"
              color="teal"
            />
            <StatCard
              title="Average Rating"
              value={stats.specialists.avg_rating.toFixed(1)}
              subtitle="Out of 5.0"
              icon="fa-star"
              color="yellow"
            />
          </div>
        </div>

        {/* System Health Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <i className="fas fa-heartbeat text-white"></i>
            </div>
            System Health
          </h3>
          <div className="space-y-4">
            {stats.notifications && (
              <StatCard
                title="Notifications"
                value={stats.notifications.total}
                subtitle={`${stats.notifications.unread} unread, ${stats.notifications.read_rate}% read rate`}
                icon="fa-bell"
                color="indigo"
                percentage={stats.notifications.read_rate}
              />
            )}
            {stats.activity && stats.activity.steps && (
              <StatCard
                title="Steps Tracking"
                value={stats.activity.steps.total_entries}
                subtitle={`${stats.activity.steps.total_steps.toLocaleString()} total steps`}
                icon="fa-walking"
                color="green"
              />
            )}
            {stats.achievements && (
              <StatCard
                title="Achievements"
                value={stats.achievements.total_achievements}
                subtitle={`${stats.achievements.unlocked} unlocked, ${stats.achievements.unlock_rate}% rate`}
                icon="fa-trophy"
                color="orange"
                percentage={stats.achievements.unlock_rate}
              />
            )}
            {stats.session_requests && (
              <StatCard
                title="Session Requests"
                value={stats.session_requests.total}
                subtitle={`${stats.session_requests.pending} pending, ${stats.session_requests.approval_rate}% approval`}
                icon="fa-calendar-plus"
                color="purple"
                percentage={stats.session_requests.approval_rate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      {stats.revenue && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
                <i className="fas fa-dollar-sign text-white text-xl"></i>
              </div>
              Revenue & Financials
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Revenue"
              value={`PKR ${stats.revenue.total.toLocaleString()}`}
              subtitle="From completed sessions"
              icon="fa-money-bill-wave"
              color="green"
            />
            <StatCard
              title="This Month"
              value={`PKR ${stats.revenue.this_month.toLocaleString()}`}
              subtitle={`PKR ${stats.revenue.this_week.toLocaleString()} this week`}
              icon="fa-calendar-alt"
              color="blue"
            />
            <StatCard
              title="Today"
              value={`PKR ${stats.revenue.today.toLocaleString()}`}
              subtitle="Revenue today"
              icon="fa-clock"
              color="purple"
            />
            <StatCard
              title="Avg Session Price"
              value={`PKR ${Math.round(stats.revenue.avg_session_price).toLocaleString()}`}
              subtitle={`PKR ${stats.revenue.pending_payments.toLocaleString()} pending`}
              icon="fa-chart-line"
              color="orange"
            />
          </div>

          {/* Top Specialists by Revenue */}
          {stats.revenue.top_specialists && stats.revenue.top_specialists.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-trophy text-yellow-600 mr-2"></i>
                Top Specialists by Revenue
              </h4>
              <div className="space-y-3">
                {stats.revenue.top_specialists.slice(0, 5).map((specialist, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <span className="font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{specialist.doctor_name}</p>
                        <p className="text-sm text-gray-600">{specialist.sessions} sessions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">PKR {specialist.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Performers Section */}
      {stats.top_performers && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPerformers
            title="Top Forum Posters"
            data={stats.top_performers.users?.top_posters || []}
            type="users"
            icon="fa-user-edit"
            color="blue"
          />
          <TopPerformers
            title="Top Commenters"
            data={stats.top_performers.users?.top_commenters || []}
            type="users"
            icon="fa-comments"
            color="purple"
          />
        </div>
      )}

      {stats.top_performers && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TopPerformers
            title="Top Articles"
            data={stats.top_performers.content?.top_articles || []}
            type="articles"
            icon="fa-newspaper"
            color="blue"
          />
          <TopPerformers
            title="Top Audio Content"
            data={stats.top_performers.content?.top_audios || []}
            type="audios"
            icon="fa-headphones"
            color="purple"
          />
          <TopPerformers
            title="Most Liked Posts"
            data={stats.top_performers.content?.top_posts || []}
            type="posts"
            icon="fa-heart"
            color="red"
          />
        </div>
      )}

      {/* Recent Activity Section */}
      {stats.recent_activity && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <i className="fas fa-history text-white text-xl"></i>
            </div>
            Recent Activity
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-user-plus text-blue-600 mr-2"></i>
                New Users
              </h4>
              <RecentActivity
                activities={stats.recent_activity.new_users || []}
                type="users"
                icon="fa-user-plus"
                color="blue"
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-calendar-check text-green-600 mr-2"></i>
                Recent Sessions
              </h4>
              <RecentActivity
                activities={stats.recent_activity.sessions || []}
                type="sessions"
                icon="fa-calendar-check"
                color="green"
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-comments text-purple-600 mr-2"></i>
                Recent Forum Posts
              </h4>
              <RecentActivity
                activities={stats.recent_activity.forum_posts || []}
                type="posts"
                icon="fa-comments"
                color="purple"
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-trophy text-yellow-600 mr-2"></i>
                Recent Achievements
              </h4>
              <RecentActivity
                activities={stats.recent_activity.achievements || []}
                type="achievements"
                icon="fa-trophy"
                color="yellow"
              />
            </div>
          </div>
        </div>
      )}

      {/* User Retention Section */}
      {stats.retention && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <i className="fas fa-chart-area text-white text-xl"></i>
            </div>
            User Retention & Engagement
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Daily Active Users"
              value={stats.retention.dau || 0}
              subtitle="Active in last 7 days"
              icon="fa-calendar-day"
              color="blue"
            />
            <StatCard
              title="Weekly Active Users"
              value={stats.retention.wau || 0}
              subtitle="Active in last week"
              icon="fa-calendar-week"
              color="green"
            />
            <StatCard
              title="Monthly Active Users"
              value={stats.retention.mau || 0}
              subtitle="Active in last 30 days"
              icon="fa-calendar-alt"
              color="purple"
            />
            <StatCard
              title="Retention Rate"
              value={`${stats.retention.retention_rate || 0}%`}
              subtitle="30-day retention"
              icon="fa-chart-line"
              color="orange"
              percentage={stats.retention.retention_rate || 0}
            />
          </div>

          {/* Retention by User Age */}
          {stats.retention.user_retention_by_age && stats.retention.user_retention_by_age.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-chart-bar text-teal-600 mr-2"></i>
                Retention by User Age (Days Since Registration)
              </h4>
              <BarChart
                data={stats.retention.user_retention_by_age.map(item => ({
                  name: item.age_range,
                  retention: item.retention_rate,
                  total: item.total_users,
                  active: item.active_users,
                }))}
                dataKey="retention"
                name="Retention Rate (%)"
                color="#14b8a6"
                height={300}
              />
            </div>
          )}
        </div>
      )}

      {/* Internships Section */}
      {stats.internships && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <i className="fas fa-graduation-cap text-white"></i>
            </div>
            Internships
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
              <p className="text-sm text-teal-600 font-medium mb-1">Total</p>
              <p className="text-2xl font-bold text-teal-800">{stats.internships.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-600 font-medium mb-1">Active</p>
              <p className="text-2xl font-bold text-green-800">{stats.internships.active}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">Mentors</p>
              <p className="text-2xl font-bold text-blue-800">{stats.internships.mentors}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-600 font-medium mb-1">Cities</p>
              <p className="text-2xl font-bold text-purple-800">{stats.internships.cities}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardTab

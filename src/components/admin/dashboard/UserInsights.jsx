import { useState, useEffect } from 'react'
import api from '../../../services/api'

function UserInsights({ userId, onClose }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    wellness: true,
    forum: true,
    sessions: true,
    achievements: true,
  })

  useEffect(() => {
    if (userId) {
      fetchUserInsights()
    } else {
      setInsights(null)
    }
  }, [userId])

  const fetchUserInsights = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/dashboard/admin/user/${userId}/insights`)
      if (response.data.success) {
        setInsights(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching user insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getTimeAgo = (days) => {
    if (days === null || days === undefined) return 'Never'
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
  }

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      calm: '😌',
      excited: '🤩',
      tired: '😴',
      neutral: '😐',
    }
    return moodEmojis[mood?.toLowerCase()] || '😐'
  }

  if (!userId) {
    return null
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading user insights...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
        <p className="text-gray-500">Failed to load user insights</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-md">
              <i className="fas fa-user text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {insights.user.first_name} {insights.user.last_name}
              </h3>
              <p className="text-gray-600">@{insights.user.username || 'N/A'} • {insights.user.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                  {insights.user.user_type}
                </span>
                {insights.user.is_email_verified && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    <i className="fas fa-check-circle mr-1"></i>Verified
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  Joined {new Date(insights.user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Activity Status</p>
              <p className={`text-lg font-semibold ${
                insights.activity.activity_streak === 'Active' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {insights.activity.activity_streak}
              </p>
              {insights.activity.days_since_last_activity !== null && (
                <p className="text-xs text-gray-500 mt-1">
                  {getTimeAgo(insights.activity.days_since_last_activity)}
                </p>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md group"
                title="Close insights"
              >
                <i className="fas fa-times text-gray-600 group-hover:text-gray-800 transition-colors"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border-b border-gray-200">
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200 text-center hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <i className="fas fa-smile text-2xl text-pink-600 mb-2"></i>
          <p className="text-xs text-pink-700 font-medium mb-1">Last Mood</p>
          <p className="font-bold text-pink-800 text-lg">
            {insights.wellness.last_mood ? getTimeAgo(insights.wellness.last_mood.days_ago) : 'Never'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200 text-center hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <i className="fas fa-book text-2xl text-indigo-600 mb-2"></i>
          <p className="text-xs text-indigo-700 font-medium mb-1">Last Journal</p>
          <p className="font-bold text-indigo-800 text-lg">
            {insights.wellness.last_journal ? getTimeAgo(insights.wellness.last_journal.days_ago) : 'Never'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 text-center hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <i className="fas fa-walking text-2xl text-green-600 mb-2"></i>
          <p className="text-xs text-green-700 font-medium mb-1">Last Steps</p>
          <p className="font-bold text-green-800 text-lg">
            {insights.wellness.last_steps ? getTimeAgo(insights.wellness.last_steps.days_ago) : 'Never'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 text-center hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <i className="fas fa-bullseye text-2xl text-orange-600 mb-2"></i>
          <p className="text-xs text-orange-700 font-medium mb-1">Active Goals</p>
          <p className="font-bold text-orange-800 text-lg">{insights.wellness.goals.active}</p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="p-6 space-y-4">
        {/* Wellness Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
          <button
            onClick={() => toggleSection('wellness')}
            className="w-full bg-gradient-to-r from-pink-50 to-purple-50 p-4 flex items-center justify-between hover:from-pink-100 hover:to-purple-100 transition-all duration-200"
          >
            <div className="flex items-center">
              <i className="fas fa-heart-pulse text-pink-600 text-xl mr-3"></i>
              <h4 className="text-lg font-bold text-gray-800">Wellness Tracking</h4>
            </div>
            <i className={`fas fa-chevron-${expandedSections.wellness ? 'up' : 'down'} text-gray-600 transition-transform duration-200`}></i>
          </button>
          {expandedSections.wellness && (
            <div className="p-4 bg-white space-y-4 animate-fade-in">
              {insights.wellness.last_mood && (
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getMoodEmoji(insights.wellness.last_mood.mood)}</span>
                    <div>
                      <p className="font-semibold text-gray-800">Last Mood: {insights.wellness.last_mood.mood}</p>
                      <p className="text-sm text-gray-600">{getTimeAgo(insights.wellness.last_mood.days_ago)}</p>
                    </div>
                  </div>
                </div>
              )}
              {insights.wellness.last_steps && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <i className="fas fa-walking text-green-600 text-xl mr-3"></i>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {insights.wellness.last_steps.steps.toLocaleString()} steps
                      </p>
                      <p className="text-sm text-gray-600">
                        {insights.wellness.last_steps.calories} calories • {getTimeAgo(insights.wellness.last_steps.days_ago)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
                  <p className="text-2xl font-bold text-blue-800">{insights.wellness.goals.active}</p>
                  <p className="text-xs text-blue-600">Active Goals</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
                  <p className="text-2xl font-bold text-green-800">{insights.wellness.goals.completed}</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 text-center">
                  <p className="text-2xl font-bold text-purple-800">{insights.wellness.goals.completion_rate}%</p>
                  <p className="text-xs text-purple-600">Completion Rate</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Forum Activity */}
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
          <button
            onClick={() => toggleSection('forum')}
            className="w-full bg-gradient-to-r from-blue-50 to-purple-50 p-4 flex items-center justify-between hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
          >
            <div className="flex items-center">
              <i className="fas fa-comments text-blue-600 text-xl mr-3"></i>
              <h4 className="text-lg font-bold text-gray-800">Forum Activity</h4>
            </div>
            <i className={`fas fa-chevron-${expandedSections.forum ? 'up' : 'down'} text-gray-600 transition-transform duration-200`}></i>
          </button>
          {expandedSections.forum && (
            <div className="p-4 bg-white animate-fade-in">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
                  <p className="text-2xl font-bold text-blue-800">{insights.forum.total_posts}</p>
                  <p className="text-xs text-blue-600">Posts</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 text-center">
                  <p className="text-2xl font-bold text-purple-800">{insights.forum.total_comments}</p>
                  <p className="text-xs text-purple-600">Comments</p>
                </div>
                <div className="bg-pink-50 rounded-lg p-3 border border-pink-200 text-center">
                  <p className="text-2xl font-bold text-pink-800">{insights.forum.total_likes}</p>
                  <p className="text-xs text-pink-600">Likes</p>
                </div>
              </div>
              {insights.forum.last_post && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">Last Post: {insights.forum.last_post.title}</p>
                  <p className="text-xs text-gray-600">{insights.forum.last_post.category} • {getTimeAgo(insights.forum.last_post.days_ago)}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sessions */}
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
          <button
            onClick={() => toggleSection('sessions')}
            className="w-full bg-gradient-to-r from-green-50 to-teal-50 p-4 flex items-center justify-between hover:from-green-100 hover:to-teal-100 transition-all duration-200"
          >
            <div className="flex items-center">
              <i className="fas fa-calendar-check text-green-600 text-xl mr-3"></i>
              <h4 className="text-lg font-bold text-gray-800">Sessions</h4>
            </div>
            <i className={`fas fa-chevron-${expandedSections.sessions ? 'up' : 'down'} text-gray-600 transition-transform duration-200`}></i>
          </button>
          {expandedSections.sessions && (
            <div className="p-4 bg-white animate-fade-in">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
                  <p className="text-2xl font-bold text-green-800">{insights.sessions.total}</p>
                  <p className="text-xs text-green-600">Total</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-3 border border-teal-200 text-center">
                  <p className="text-2xl font-bold text-teal-800">{insights.sessions.completed}</p>
                  <p className="text-xs text-teal-600">Completed</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
                  <p className="text-2xl font-bold text-blue-800">{insights.sessions.upcoming}</p>
                  <p className="text-xs text-blue-600">Upcoming</p>
                </div>
              </div>
              {insights.sessions.last_session && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">
                    Last Session: {new Date(insights.sessions.last_session.date).toLocaleDateString()} at {insights.sessions.last_session.time}
                  </p>
                  <p className="text-xs text-gray-600">
                    {insights.sessions.last_session.status} • PKR {insights.sessions.last_session.amount} • {getTimeAgo(insights.sessions.last_session.days_ago)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
          <button
            onClick={() => toggleSection('achievements')}
            className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 p-4 flex items-center justify-between hover:from-yellow-100 hover:to-orange-100 transition-all duration-200"
          >
            <div className="flex items-center">
              <i className="fas fa-trophy text-yellow-600 text-xl mr-3"></i>
              <h4 className="text-lg font-bold text-gray-800">Achievements</h4>
            </div>
            <i className={`fas fa-chevron-${expandedSections.achievements ? 'up' : 'down'} text-gray-600 transition-transform duration-200`}></i>
          </button>
          {expandedSections.achievements && (
            <div className="p-4 bg-white animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-center">
                  <p className="text-3xl font-bold text-yellow-800">{insights.achievements.unlocked}</p>
                  <p className="text-sm text-yellow-600">of {insights.achievements.total} Unlocked</p>
                </div>
              </div>
              {insights.achievements.recent.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Recent Achievements:</p>
                  {insights.achievements.recent.map((ach, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center">
                      <span className="text-2xl mr-3">{ach.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{ach.name}</p>
                        <p className="text-xs text-gray-600">{getTimeAgo(ach.days_ago)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserInsights


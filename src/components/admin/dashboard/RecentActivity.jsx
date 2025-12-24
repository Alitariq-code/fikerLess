function RecentActivity({ activities, type, icon, color }) {
  const getTimeAgo = (date) => {
    if (!date) return 'Unknown'
    const now = new Date()
    const then = new Date(date)
    const diffMs = now - then
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return then.toLocaleDateString()
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <i className={`fas ${icon} text-3xl mb-2 opacity-50`}></i>
        <p>No recent {type} activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 5).map((activity, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {type === 'users' && (
                <>
                  <p className="font-semibold text-gray-800">{activity.name}</p>
                  <p className="text-sm text-gray-600">@{activity.username} • {activity.type}</p>
                </>
              )}
              {type === 'sessions' && (
                <>
                  <p className="font-semibold text-gray-800">
                    Session on {new Date(activity.date).toLocaleDateString()} at {activity.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.user?.name} → {activity.doctor?.name} • {activity.status}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PKR {activity.amount.toLocaleString()}</p>
                </>
              )}
              {type === 'posts' && (
                <>
                  <p className="font-semibold text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-600">
                    by {activity.author?.name || 'Unknown'} • {activity.category}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500">
                      <i className="fas fa-heart text-red-500 mr-1"></i>
                      {activity.likes}
                    </span>
                    <span className="text-xs text-gray-500">
                      <i className="fas fa-comments text-blue-500 mr-1"></i>
                      {activity.comments}
                    </span>
                  </div>
                </>
              )}
              {type === 'achievements' && (
                <>
                  <p className="font-semibold text-gray-800 flex items-center">
                    <span className="mr-2">{activity.achievement_icon}</span>
                    {activity.achievement_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Unlocked by {activity.user?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.achievement_description}</p>
                </>
              )}
            </div>
            <div className="ml-4 text-right">
              <p className="text-xs text-gray-500">{getTimeAgo(activity.created_at || activity.unlocked_at)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentActivity


function ForumStats({ stats }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-12 w-12 bg-gray-200 rounded-full ml-auto"></div>
          </div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Posts',
      value: stats.total_posts,
      icon: 'fa-file-alt',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      today: stats.posts_today,
    },
    {
      label: 'Total Comments',
      value: stats.total_comments,
      icon: 'fa-comments',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      today: stats.comments_today,
    },
    {
      label: 'Total Likes',
      value: stats.total_likes,
      icon: 'fa-heart',
      gradient: 'from-red-500 to-pink-600',
      bgGradient: 'from-red-50 to-pink-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      today: null,
    },
    {
      label: 'Active Users',
      value: stats.total_active_users,
      icon: 'fa-users',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      today: null,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative"
        >
          {/* Gradient accent bar */}
          <div className={`h-1 bg-gradient-to-r ${stat.gradient}`}></div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value.toLocaleString()}
                </p>
                {stat.today !== null && stat.today > 0 && (
                  <div className="flex items-center space-x-1 mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <i className="fas fa-arrow-up mr-1 text-xs"></i>
                      +{stat.today} today
                    </span>
                  </div>
                )}
              </div>
              <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <i className={`fas ${stat.icon} ${stat.iconColor} text-xl`}></i>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ForumStats

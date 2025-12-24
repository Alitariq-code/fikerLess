function StatCard({ title, value, subtitle, icon, color, percentage, trend }) {
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
    red: {
      bg: 'from-red-500 to-red-600',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-600',
      border: 'border-red-200',
    },
    teal: {
      bg: 'from-teal-500 to-teal-600',
      icon: 'bg-teal-100 text-teal-600',
      text: 'text-teal-600',
      border: 'border-teal-200',
    },
    yellow: {
      bg: 'from-yellow-500 to-yellow-600',
      icon: 'bg-yellow-100 text-yellow-600',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
    },
  }

  const colorScheme = colors[color] || colors.blue

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group relative">
      <div className={`h-1 bg-gradient-to-r ${colorScheme.bg}`}></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <p className={`text-4xl font-bold ${colorScheme.text} mb-2`}>{value.toLocaleString()}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            {trend && (
              <div className="flex items-center mt-2">
                <span className={`text-xs font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <i className={`fas fa-arrow-${trend > 0 ? 'up' : 'down'} mr-1`}></i>
                  {Math.abs(trend)}%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last period</span>
              </div>
            )}
          </div>
          <div className={`${colorScheme.icon} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
            <i className={`fas ${icon} text-2xl`}></i>
          </div>
        </div>
        
        {percentage !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Rate</span>
              <span className={`text-xs font-semibold ${colorScheme.text}`}>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${colorScheme.bg} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard


function TopPerformers({ title, data, type, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600',
  }

  const gradientClass = colorClasses[color] || colorClasses.blue

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <div className={`w-10 h-10 bg-gradient-to-br ${gradientClass} rounded-lg flex items-center justify-center mr-3 shadow-md`}>
            <i className={`fas ${icon} text-white`}></i>
          </div>
          {title}
        </h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <div className={`w-10 h-10 bg-gradient-to-br ${gradientClass} rounded-lg flex items-center justify-center mr-3 shadow-md`}>
          <i className={`fas ${icon} text-white`}></i>
        </div>
        {title}
      </h3>
      <div className="space-y-3">
        {data.slice(0, 10).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                index === 0 ? 'bg-yellow-100 text-yellow-600' :
                index === 1 ? 'bg-gray-100 text-gray-600' :
                index === 2 ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <span className="font-bold text-sm">#{index + 1}</span>
              </div>
              <div className="flex-1">
                {type === 'users' && (
                  <>
                    <p className="font-semibold text-gray-800">{item.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">@{item.username || 'N/A'}</p>
                  </>
                )}
                {type === 'articles' && (
                  <>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.views.toLocaleString()} views</p>
                  </>
                )}
                {type === 'audios' && (
                  <>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.plays.toLocaleString()} plays</p>
                  </>
                )}
                {type === 'posts' && (
                  <>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">by {item.author} • {item.likes} likes</p>
                  </>
                )}
                {type === 'specialists' && (
                  <>
                    <p className="font-semibold text-gray-800">{item.doctor_name}</p>
                    <p className="text-sm text-gray-600">{item.sessions} sessions</p>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              {type === 'users' && (
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{item.posts || item.comments}</p>
                  <p className="text-xs text-gray-500">{type === 'users' && item.posts ? 'posts' : 'comments'}</p>
                </div>
              )}
              {type === 'articles' && (
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{item.views.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              )}
              {type === 'audios' && (
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{item.plays.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">plays</p>
                </div>
              )}
              {type === 'posts' && (
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{item.likes}</p>
                  <p className="text-xs text-gray-500">likes</p>
                </div>
              )}
              {type === 'specialists' && (
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">PKR {item.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">revenue</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopPerformers


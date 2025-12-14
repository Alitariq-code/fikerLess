function AnalyticsTab() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Comprehensive insights and reporting</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-chart-pie text-blue-600 mr-3"></i>
            Program Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Online Programs</span>
              <span className="text-sm font-medium text-blue-600">65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hybrid Programs</span>
              <span className="text-sm font-medium text-green-600">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In-Person</span>
              <span className="text-sm font-medium text-purple-600">10%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-map-marked-alt text-green-600 mr-3"></i>
            Geographic Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lahore</span>
              <span className="text-sm font-medium text-green-600">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Islamabad</span>
              <span className="text-sm font-medium text-blue-600">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Online</span>
              <span className="text-sm font-medium text-purple-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Other Cities</span>
              <span className="text-sm font-medium text-orange-600">6</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-trending-up text-purple-600 mr-3"></i>
            Growth Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Monthly Growth</span>
              <span className="text-lg font-bold text-green-600">+15%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Mentors</span>
              <span className="text-lg font-bold text-blue-600">+3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Programs</span>
              <span className="text-lg font-bold text-purple-600">16</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i className="fas fa-chart-line text-blue-600 mr-3"></i>
            Program Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-blue-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Top Performer</p>
                  <p className="text-sm text-gray-600">Multiple Programs</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">100% Active</p>
                <p className="text-xs text-gray-500">Excellent</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i className="fas fa-calendar-alt text-purple-600 mr-3"></i>
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-plus text-blue-600 text-sm"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">New internship added</p>
                <p className="text-xs text-gray-500">Recently</p>
              </div>
              <span className="text-xs text-gray-400">2h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsTab


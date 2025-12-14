function SettingsTab() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">System Settings</h2>
        <p className="text-gray-600">Configure your admin panel and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i className="fas fa-cog text-blue-600 mr-3"></i>
            General Settings
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Username</label>
              <input
                type="text"
                value="admin"
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">System Version</label>
              <input
                type="text"
                value="v2.1.0"
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
              <input
                type="text"
                value={new Date().toISOString().split('T')[0]}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i className="fas fa-server text-green-600 mr-3"></i>
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-800">Database Connection</span>
              </div>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-800">API Status</span>
              </div>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-800">File System</span>
              </div>
              <span className="text-green-600 font-medium">Healthy</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-800">Memory Usage</span>
              </div>
              <span className="text-blue-600 font-medium">45%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="glass-card rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-shield-alt text-red-600 mr-3"></i>
          Security & Backup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Security Features</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Authentication</span>
                <span className="text-sm font-medium text-green-600">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Session Timeout</span>
                <span className="text-sm font-medium text-blue-600">30 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rate Limiting</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Backup & Recovery</h4>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                <i className="fas fa-download mr-2"></i>Download Backup
              </button>
              <button className="w-full px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                <i className="fas fa-upload mr-2"></i>Restore Backup
              </button>
              <button className="w-full px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors">
                <i className="fas fa-sync mr-2"></i>Sync Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab


import { useState } from 'react'

function AdminSidebar({ activeTab, onTabChange, onLogout, isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { id: 'internships', label: 'Internships', icon: 'fa-graduation-cap' },
    { id: 'analytics', label: 'Analytics', icon: 'fa-chart-bar' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <i className={`fas ${isMobileOpen ? 'fa-times' : 'fa-bars'} text-gray-700`}></i>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gradient-to-b from-slate-800 to-slate-900 transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-all duration-300 z-50 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-6 h-full flex flex-col relative">
          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-10 hidden lg:flex"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-xs`}></i>
          </button>

          {/* Logo Section */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-8 transition-all duration-300`}>
            <img src="/images/logo.png" alt="FikrLess Logo" className="w-10 h-10 object-contain" />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h2 className="text-white font-bold text-xl whitespace-nowrap">FikrLess</h2>
                <p className="text-gray-300 text-sm whitespace-nowrap">Admin Panel</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id)
                  setIsMobileOpen(false)
                }}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                } p-3 rounded-lg transition-all duration-300 group relative ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <i className={`fas ${item.icon} ${isCollapsed ? 'text-lg' : ''}`}></i>
                {!isCollapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={onLogout}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center' : 'space-x-3'
              } p-3 rounded-lg text-gray-300 hover:text-white hover:bg-red-600 transition-all duration-300 group relative`}
              title={isCollapsed ? 'Logout' : ''}
            >
              <i className={`fas fa-sign-out-alt ${isCollapsed ? 'text-lg' : ''}`}></i>
              {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                  Logout
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </>
  )
}

export default AdminSidebar


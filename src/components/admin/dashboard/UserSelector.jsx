import { useState, useEffect, useRef } from 'react'
import api from '../../../services/api'

function UserSelector({ onUserSelect, selectedUserId }) {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/users/admin/all', {
        params: { page: 1, limit: 1000 },
      })
      if (response.data.success) {
        setUsers(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    const name = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase()
    const email = (user.email || '').toLowerCase()
    const username = (user.username || '').toLowerCase()
    return name.includes(search) || email.includes(search) || username.includes(search)
  })

  const selectedUser = users.find((u) => u._id === selectedUserId)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center flex-1">
          <i className="fas fa-user text-blue-600 mr-3"></i>
          {selectedUser ? (
            <div className="text-left">
              <p className="font-semibold text-gray-800">
                {selectedUser.first_name} {selectedUser.last_name}
              </p>
              <p className="text-sm text-gray-500">@{selectedUser.username || 'N/A'}</p>
            </div>
          ) : (
            <span className="text-gray-500">Select a user to view insights...</span>
          )}
        </div>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-gray-400 ml-2 transition-transform`}></i>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden animate-fade-in">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Users List */}
          <div className="overflow-y-auto max-h-80">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <i className="fas fa-user-slash text-3xl mb-2 opacity-50"></i>
                <p>No users found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    onUserSelect(user._id)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedUserId === user._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {user.first_name} {user.last_name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-600">@{user.username || 'N/A'}</p>
                        <span className="text-xs text-gray-500">•</span>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.user_type === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.user_type === 'specialist' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.user_type}
                        </span>
                        {user.is_email_verified && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            <i className="fas fa-check-circle mr-1"></i>Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedUserId === user._id && (
                      <i className="fas fa-check-circle text-blue-600 ml-2"></i>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserSelector


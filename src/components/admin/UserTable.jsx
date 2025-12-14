import { useState, useEffect } from 'react'
import api from '../../services/api'
import Breadcrumb from '../common/Breadcrumb'
import UserForm from './UserForm'

function UserTable({ onBreadcrumbChange }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [editingUser, setEditingUser] = useState(null)
  const [viewingUser, setViewingUser] = useState(null)
  const [mode, setMode] = useState('list') // 'list', 'view', 'edit'
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Users' },
  ])
  const [actionLoading, setActionLoading] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const pageSize = 10

  const USER_TYPES = ['user', 'specialist', 'admin']

  useEffect(() => {
    if (onBreadcrumbChange) {
      onBreadcrumbChange(breadcrumbItems)
    }
  }, [breadcrumbItems, onBreadcrumbChange])

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, searchTerm ? 500 : 0) // 500ms debounce for search

    return () => clearTimeout(timer)
  }, [searchTerm, userTypeFilter, statusFilter])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, userTypeFilter, statusFilter])

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const fetchUsers = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const params = {
        page: 1,
        limit: 1000, // Fetch all for admin
      }

      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim()
      }
      if (userTypeFilter && userTypeFilter !== 'all') {
        params.user_type = userTypeFilter
      }
      if (statusFilter && statusFilter !== 'all') {
        params.is_disabled = statusFilter
      }

      const response = await api.get('/users/admin/all', { params })
      if (response.data.success) {
        let data = response.data.data || []

        // Apply client-side search if backend search wasn't used
        if (searchTerm && searchTerm.trim() && !params.search) {
          const searchLower = searchTerm.toLowerCase().trim()
          data = data.filter((user) => {
            const email = (user.email || '').toLowerCase()
            const firstName = (user.first_name || '').toLowerCase()
            const lastName = (user.last_name || '').toLowerCase()
            const username = (user.username || '').toLowerCase()
            return email.includes(searchLower) ||
                   firstName.includes(searchLower) ||
                   lastName.includes(searchLower) ||
                   username.includes(searchLower)
          })
        }

        setUsers(data)
        setTotalItems(data.length)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
      setTotalItems(0)
      setErrorMessage('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBreadcrumbNavigate = (index) => {
    if (index === 0) {
      setMode('list')
      setViewingUser(null)
      setEditingUser(null)
      setBreadcrumbItems([{ label: 'Users' }])
    } else if (index === 1 && mode === 'view') {
      setMode('list')
      setViewingUser(null)
      setBreadcrumbItems([{ label: 'Users' }])
    } else if (index === 1 && mode === 'edit') {
      setMode('list')
      setEditingUser(null)
      setBreadcrumbItems([{ label: 'Users' }])
    }
  }

  const handleView = (user) => {
    setViewingUser(user)
    setMode('view')
    setBreadcrumbItems([
      { label: 'Users', onClick: () => handleBreadcrumbNavigate(0) },
      { label: user.email || 'User Details' },
    ])
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setMode('edit')
    setBreadcrumbItems([
      { label: 'Users', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Edit User' },
    ])
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.email}"?\n\nThis action cannot be undone and will delete all associated data.`)) {
      return
    }

    setActionLoading(`delete-${user._id}`)
    setErrorMessage('')
    try {
      await api.delete(`/users/admin/${user._id}`)
      setSuccessMessage(`User "${user.email}" deleted successfully!`)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      setErrorMessage('Failed to delete user. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleStatus = async (user) => {
    setActionLoading(`toggle-${user._id}`)
    setErrorMessage('')
    try {
      await api.patch(`/users/admin/${user._id}/toggle-status`)
      const newStatus = !user.is_disabled
      setSuccessMessage(`User ${newStatus ? 'disabled' : 'enabled'} successfully!`)
      fetchUsers()
      // Update viewing user if we're viewing it
      if (viewingUser && viewingUser._id === user._id) {
        setViewingUser({ ...viewingUser, is_disabled: newStatus })
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      setErrorMessage('Failed to update user status. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleFormSave = () => {
    setSuccessMessage('User updated successfully!')
    fetchUsers()
    setMode('list')
    setEditingUser(null)
    setBreadcrumbItems([{ label: 'Users' }])
  }

  const handleFormCancel = () => {
    setMode('list')
    setEditingUser(null)
    setBreadcrumbItems([{ label: 'Users' }])
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <i className="fas fa-sort text-gray-400"></i>
    }
    return sortConfig.direction === 'asc' ? (
      <i className="fas fa-sort-up text-blue-600"></i>
    ) : (
      <i className="fas fa-sort-down text-blue-600"></i>
    )
  }

  // Sort and paginate data
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0

    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    // Handle nested values
    if (sortConfig.key === 'name') {
      aValue = `${a.first_name} ${a.last_name}`.trim()
      bValue = `${b.first_name} ${b.last_name}`.trim()
    }

    // Handle null/undefined
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' })
        : bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' })
    }

    // Handle dates
    if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
      const aDate = new Date(aValue).getTime()
      const bDate = new Date(bValue).getTime()
      if (!isNaN(aDate) && !isNaN(bDate)) {
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate
      }
    }

    // Handle numbers
    const aNum = Number(aValue)
    const bNum = Number(bValue)
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum
    }

    // Handle booleans
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortConfig.direction === 'asc'
        ? (aValue === bValue ? 0 : aValue ? 1 : -1)
        : (aValue === bValue ? 0 : aValue ? -1 : 1)
    }

    return 0
  })

  const startItem = (currentPage - 1) * pageSize
  const endItem = Math.min(currentPage * pageSize, sortedUsers.length)
  const paginatedUsers = sortedUsers.slice(startItem, endItem)
  const totalPages = Math.ceil(sortedUsers.length / pageSize)

  const stats = {
    total: users.length,
    users: users.filter(u => u.user_type === 'user').length,
    specialists: users.filter(u => u.user_type === 'specialist').length,
    admins: users.filter(u => u.user_type === 'admin').length,
    disabled: users.filter(u => u.is_disabled).length,
    active: users.filter(u => !u.is_disabled).length,
  }

  const columns = [
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value, row) => (
        <div className="max-w-xs">
          <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {value || '-'}
          </div>
          {(row.first_name || row.last_name) && (
            <div className="text-xs text-gray-500 mt-1">
              {`${row.first_name || ''} ${row.last_name || ''}`.trim() || '-'}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'user_type',
      label: 'Type',
      sortable: true,
      render: (value) => {
        const colors = {
          user: 'bg-blue-100 text-blue-700 border-blue-200',
          specialist: 'bg-purple-100 text-purple-700 border-purple-200',
          admin: 'bg-red-100 text-red-700 border-red-200',
        }
        return (
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center border ${
            colors[value] || 'bg-gray-100 text-gray-700 border-gray-200'
          }`}>
            <i className={`fas ${
              value === 'admin' ? 'fa-user-shield' :
              value === 'specialist' ? 'fa-user-md' : 'fa-user'
            } mr-1.5`}></i>
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : '-'}
          </span>
        )
      },
    },
    {
      key: 'is_email_verified',
      label: 'Verified',
      sortable: true,
      render: (value) => (
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${
          value
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
        }`}>
          <i className={`fas ${value ? 'fa-check-circle' : 'fa-clock'} mr-1.5`}></i>
          {value ? 'Verified' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'has_demographics',
      label: 'Demographics',
      sortable: true,
      render: (value) => (
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${
          value
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          <i className={`fas ${value ? 'fa-check' : 'fa-times'} mr-1.5`}></i>
          {value ? 'Complete' : 'Incomplete'}
        </span>
      ),
    },
    {
      key: 'is_disabled',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${
          value
            ? 'bg-red-100 text-red-700 border border-red-200'
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          <i className={`fas ${value ? 'fa-ban' : 'fa-check-circle'} mr-1.5`}></i>
          {value ? 'Disabled' : 'Active'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Created At',
      sortable: true,
      render: (value) => {
        if (!value) return <span className="text-gray-400">-</span>
        const date = new Date(value)
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
        return (
          <div className="text-sm text-gray-600">
            <div className="flex items-center">
              <i className="fas fa-calendar text-gray-400 mr-2"></i>
              <span>{formattedDate}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 ml-6">
              {formattedTime}
            </div>
          </div>
        )
      },
    },
  ]

  // If editing
  if (mode === 'edit') {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <UserForm
          user={editingUser}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  // If viewing a single user
  if (mode === 'view' && viewingUser) {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-6 border-b border-gray-200 space-y-4 md:space-y-0">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{viewingUser.email}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center ${
                  viewingUser.is_disabled
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  <i className={`fas ${viewingUser.is_disabled ? 'fa-ban' : 'fa-check-circle'} mr-2`}></i>
                  {viewingUser.is_disabled ? 'Disabled' : 'Active'}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center ${
                  viewingUser.user_type === 'admin' ? 'bg-red-100 text-red-700 border border-red-200' :
                  viewingUser.user_type === 'specialist' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                  'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  <i className={`fas ${
                    viewingUser.user_type === 'admin' ? 'fa-user-shield' :
                    viewingUser.user_type === 'specialist' ? 'fa-user-md' : 'fa-user'
                  } mr-2`}></i>
                  {viewingUser.user_type ? viewingUser.user_type.charAt(0).toUpperCase() + viewingUser.user_type.slice(1) : 'User'}
                </span>
                {viewingUser.is_email_verified && (
                  <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    <i className="fas fa-check-circle mr-2"></i>
                    Email Verified
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleToggleStatus(viewingUser)}
                disabled={actionLoading === `toggle-${viewingUser._id}`}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  viewingUser.is_disabled
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                    : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                }`}
              >
                {actionLoading === `toggle-${viewingUser._id}` ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className={`fas ${viewingUser.is_disabled ? 'fa-check' : 'fa-ban'} mr-2`}></i>
                )}
                {viewingUser.is_disabled ? 'Enable' : 'Disable'}
              </button>
              <button
                onClick={() => handleEdit(viewingUser)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                <i className="fas fa-edit mr-2"></i>Edit
              </button>
            </div>
          </div>

          {/* Meta Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-user text-white"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {`${viewingUser.first_name || ''} ${viewingUser.last_name || ''}`.trim() || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-phone text-white"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-semibold text-gray-800">{viewingUser.phone_number || 'Not set'}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-at text-white"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Username</p>
                  <p className="text-sm font-semibold text-gray-800">{viewingUser.username || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Demographics Section */}
          {viewingUser.demographics ? (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-user-circle text-blue-600 mr-3"></i>
                Demographics Information
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewingUser.demographics.age_range && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                      <p className="text-gray-900">{viewingUser.demographics.age_range}</p>
                    </div>
                  )}
                  {viewingUser.demographics.gender_identity && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender Identity</label>
                      <p className="text-gray-900">{viewingUser.demographics.gender_identity}</p>
                    </div>
                  )}
                  {viewingUser.demographics.country_of_residence && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <p className="text-gray-900">{viewingUser.demographics.country_of_residence}</p>
                    </div>
                  )}
                  {viewingUser.demographics.relationship_status && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Status</label>
                      <p className="text-gray-900">{viewingUser.demographics.relationship_status}</p>
                    </div>
                  )}
                  {viewingUser.demographics.mental_health_diagnosis && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mental Health Diagnosis</label>
                      <p className="text-gray-900">{viewingUser.demographics.mental_health_diagnosis}</p>
                    </div>
                  )}
                  {viewingUser.demographics.exercise_frequency && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Frequency</label>
                      <p className="text-gray-900">{viewingUser.demographics.exercise_frequency}</p>
                    </div>
                  )}
                </div>
                {viewingUser.demographics.what_brings_you_here && viewingUser.demographics.what_brings_you_here.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">What Brings You Here</label>
                    <div className="flex flex-wrap gap-2">
                      {viewingUser.demographics.what_brings_you_here.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {viewingUser.demographics.goals_for_using_app && viewingUser.demographics.goals_for_using_app.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
                    <div className="flex flex-wrap gap-2">
                      {viewingUser.demographics.goals_for_using_app.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <p className="text-yellow-800 font-medium flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                No demographics data available for this user.
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => handleBreadcrumbNavigate(0)}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              <i className="fas fa-arrow-left mr-2"></i>Back to List
            </button>
            <button
              onClick={() => handleEdit(viewingUser)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              <i className="fas fa-edit mr-2"></i>Edit User
            </button>
          </div>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="animate-fade-in">
      <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center animate-slide-down shadow-lg">
          <div className="flex-shrink-0">
            <i className="fas fa-check-circle text-green-500 text-xl"></i>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-semibold text-green-800">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="ml-4 text-green-500 hover:text-green-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center animate-slide-down shadow-lg">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-semibold text-red-800">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Users</h2>
          <p className="text-gray-600">Comprehensive user management system</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Regular Users</p>
              <p className="text-2xl font-bold text-blue-600">{stats.users}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-user text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Specialists</p>
              <p className="text-2xl font-bold text-purple-600">{stats.specialists}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-md text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Admins</p>
              <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-shield text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Disabled</p>
              <p className="text-2xl font-bold text-red-600">{stats.disabled}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-ban text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-search mr-2 text-gray-400"></i>Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by email, name, username..."
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-filter mr-2 text-gray-400"></i>User Type
            </label>
            <select
              value={userTypeFilter}
              onChange={(e) => {
                setUserTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
            >
              <option value="all">All Types</option>
              {USER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-toggle-on mr-2 text-gray-400"></i>Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="false">Active</option>
              <option value="true">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading users...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                          column.sortable !== false ? 'cursor-pointer hover:bg-gray-200' : ''
                        } transition-colors`}
                        onClick={() => column.sortable !== false && handleSort(column.key)}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{column.label}</span>
                          {column.sortable !== false && getSortIcon(column.key)}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                          <p className="text-gray-500 font-medium text-lg mb-2">No users found</p>
                          <p className="text-gray-400 text-sm">
                            {searchTerm || userTypeFilter !== 'all' || statusFilter !== 'all'
                              ? 'Try adjusting your filters'
                              : 'No users registered yet'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, rowIndex) => (
                      <tr
                        key={user._id || rowIndex}
                        className="hover:bg-blue-50 transition-colors group"
                      >
                        {columns.map((column) => (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            {column.render ? (
                              column.render(user[column.key], user)
                            ) : (
                              <div className="text-sm text-gray-900">{user[column.key] || '-'}</div>
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView(user)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110"
                              title="View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all transform hover:scale-110"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              disabled={actionLoading === `toggle-${user._id}`}
                              className={`p-2 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                                user.is_disabled
                                  ? 'text-green-600 hover:bg-green-100'
                                  : 'text-red-600 hover:bg-red-100'
                              }`}
                              title={user.is_disabled ? 'Enable' : 'Disable'}
                            >
                              {actionLoading === `toggle-${user._id}` ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className={`fas ${user.is_disabled ? 'fa-check' : 'fa-ban'}`}></i>
                              )}
                            </button>
                            {user.user_type !== 'admin' && (
                              <button
                                onClick={() => handleDelete(user)}
                                disabled={actionLoading === `delete-${user._id}`}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete"
                              >
                                {actionLoading === `delete-${user._id}` ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fas fa-trash"></i>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startItem + 1}</span> to{' '}
                  <span className="font-medium">{endItem}</span> of{' '}
                  <span className="font-medium">{sortedUsers.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <i className="fas fa-chevron-left mr-1"></i> Previous
                  </button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <i className="fas fa-chevron-right ml-1"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UserTable


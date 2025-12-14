import { useState, useEffect } from 'react'
import api from '../../services/api'
import Breadcrumb from '../common/Breadcrumb'
import AchievementForm from './AchievementForm'

const CATEGORY_LABELS = {
  streak: 'Streak',
  community: 'Community',
  activity: 'Activity',
  milestone: 'Milestone',
}

const CONDITION_TYPE_LABELS = {
  streak_days: 'Streak Days',
  forum_helps: 'Forum Helps',
  steps_total: 'Total Steps',
  mood_days: 'Mood Days',
  journal_days: 'Journal Days',
}

function AchievementTable({ onBreadcrumbChange }) {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [conditionTypeFilter, setConditionTypeFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [editingAchievement, setEditingAchievement] = useState(null)
  const [viewingAchievement, setViewingAchievement] = useState(null)
  const [mode, setMode] = useState('list') // 'list', 'view', 'add', 'edit'
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Achievements' },
  ])
  const [actionLoading, setActionLoading] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const pageSize = 10

  useEffect(() => {
    if (onBreadcrumbChange) {
      onBreadcrumbChange(breadcrumbItems)
    }
  }, [breadcrumbItems, onBreadcrumbChange])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAchievements()
    }, searchTerm ? 500 : 0)

    return () => clearTimeout(timer)
  }, [searchTerm, categoryFilter, conditionTypeFilter, activeFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, conditionTypeFilter, activeFilter])

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

  const fetchAchievements = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const params = {
        page: 1,
        limit: 1000,
      }

      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim()
      }
      if (categoryFilter && categoryFilter !== 'all') {
        params.category = categoryFilter
      }
      if (conditionTypeFilter && conditionTypeFilter !== 'all') {
        params.condition_type = conditionTypeFilter
      }
      if (activeFilter && activeFilter !== 'all') {
        params.is_active = activeFilter
      }

      const response = await api.get('/achievements/admin/all', { params })
      if (response.data.success) {
        let data = response.data.data || []

        if (searchTerm && searchTerm.trim() && !params.search) {
          const searchLower = searchTerm.toLowerCase().trim()
          data = data.filter((achievement) => {
            const name = (achievement.name || '').toLowerCase()
            const description = (achievement.description || '').toLowerCase()
            return name.includes(searchLower) || description.includes(searchLower)
          })
        }

        setAchievements(data)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
      setAchievements([])
      setErrorMessage('Failed to load achievements. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBreadcrumbNavigate = (index) => {
    if (index === 0) {
      setMode('list')
      setViewingAchievement(null)
      setEditingAchievement(null)
      setBreadcrumbItems([{ label: 'Achievements' }])
    } else if (index === 1 && mode === 'view') {
      setMode('list')
      setViewingAchievement(null)
      setBreadcrumbItems([{ label: 'Achievements' }])
    } else if (index === 1 && (mode === 'edit' || mode === 'add')) {
      setMode('list')
      setEditingAchievement(null)
      setBreadcrumbItems([{ label: 'Achievements' }])
    }
  }

  const handleView = (achievement) => {
    setViewingAchievement(achievement)
    setMode('view')
    setBreadcrumbItems([
      { label: 'Achievements', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Achievement Details' },
    ])
  }

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement)
    setMode('edit')
    setBreadcrumbItems([
      { label: 'Achievements', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Edit Achievement' },
    ])
  }

  const handleDelete = async (achievement) => {
    if (!window.confirm(`Are you sure you want to delete this achievement?\n\n"${achievement.name}"\n\nThis action cannot be undone.`)) {
      return
    }

    setActionLoading(`delete-${achievement._id}`)
    setErrorMessage('')
    try {
      await api.delete(`/achievements/admin/${achievement._id}`)
      setSuccessMessage('Achievement deleted successfully!')
      fetchAchievements()
    } catch (error) {
      console.error('Error deleting achievement:', error)
      const errorMsg = error.response?.data?.message || 'Failed to delete achievement. Please try again.'
      setErrorMessage(errorMsg)
    } finally {
      setActionLoading(null)
    }
  }

  const handleAdd = () => {
    setEditingAchievement(null)
    setMode('add')
    setBreadcrumbItems([
      { label: 'Achievements', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Add New Achievement' },
    ])
  }

  const handleFormSave = () => {
    setSuccessMessage(editingAchievement ? 'Achievement updated successfully!' : 'Achievement created successfully!')
    fetchAchievements()
    setMode('list')
    setEditingAchievement(null)
    setBreadcrumbItems([{ label: 'Achievements' }])
  }

  const handleFormCancel = () => {
    setMode('list')
    setEditingAchievement(null)
    setBreadcrumbItems([{ label: 'Achievements' }])
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
      <i className="fas fa-sort-up text-yellow-600"></i>
    ) : (
      <i className="fas fa-sort-down text-yellow-600"></i>
    )
  }

  const sortedAchievements = [...achievements].sort((a, b) => {
    if (!sortConfig.key) return 0

    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' })
        : bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' })
    }

    const aNum = Number(aValue)
    const bNum = Number(bValue)
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum
    }

    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortConfig.direction === 'asc'
        ? (aValue === bValue ? 0 : aValue ? 1 : -1)
        : (aValue === bValue ? 0 : aValue ? -1 : 1)
    }

    if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
      const aDate = new Date(aValue).getTime()
      const bDate = new Date(bValue).getTime()
      if (!isNaN(aDate) && !isNaN(bDate)) {
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate
      }
    }

    return 0
  })

  const startItem = (currentPage - 1) * pageSize
  const endItem = Math.min(currentPage * pageSize, sortedAchievements.length)
  const paginatedAchievements = sortedAchievements.slice(startItem, endItem)
  const totalPages = Math.ceil(sortedAchievements.length / pageSize)

  const stats = {
    total: achievements.length,
    active: achievements.filter(a => a.is_active).length,
    inactive: achievements.filter(a => !a.is_active).length,
    byCategory: {
      streak: achievements.filter(a => a.category === 'streak').length,
      community: achievements.filter(a => a.category === 'community').length,
      activity: achievements.filter(a => a.category === 'activity').length,
      milestone: achievements.filter(a => a.category === 'milestone').length,
    },
  }

  const uniqueCategories = [...new Set(achievements.map(a => a.category).filter(Boolean))].sort()
  const uniqueConditionTypes = [...new Set(achievements.map(a => a.condition_type).filter(Boolean))].sort()

  const columns = [
    {
      key: 'icon',
      label: 'Icon',
      sortable: false,
      render: (value, row) => (
        <div className="flex items-center">
          <span className="text-2xl mr-3">{value || '🏆'}</span>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => (
        <div className="max-w-md">
          <div className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors">
            {value || '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value) => (
        <div className="max-w-xs text-sm text-gray-700 line-clamp-2">
          {value || <span className="text-gray-400">-</span>}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          {CATEGORY_LABELS[value] || value}
        </span>
      ),
    },
    {
      key: 'condition_type',
      label: 'Condition',
      sortable: true,
      render: (value) => (
        <div className="text-xs text-gray-600">
          {CONDITION_TYPE_LABELS[value] || value}
        </div>
      ),
    },
    {
      key: 'condition_value',
      label: 'Target',
      sortable: true,
      render: (value) => (
        <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
          {value || 0}
        </span>
      ),
    },
    {
      key: 'xp_reward',
      label: 'XP Reward',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <i className="fas fa-star text-yellow-500 mr-1"></i>
          <span className="font-semibold text-gray-700">{value || 0}</span>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${
          value
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          <i className={`fas ${value ? 'fa-check-circle' : 'fa-times-circle'} mr-1.5`}></i>
          {value ? 'Active' : 'Inactive'}
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

  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <AchievementForm
          achievement={editingAchievement}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  if (mode === 'view' && viewingAchievement) {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-6 border-b border-gray-200 space-y-4 md:space-y-0">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-4xl mr-4">{viewingAchievement.icon || '🏆'}</span>
                <h2 className="text-3xl font-bold text-gray-800">{viewingAchievement.name}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center ${
                  viewingAchievement.is_active
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}>
                  <i className={`fas ${viewingAchievement.is_active ? 'fa-check-circle' : 'fa-times-circle'} mr-2`}></i>
                  {viewingAchievement.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  <i className="fas fa-folder mr-2"></i>
                  {CATEGORY_LABELS[viewingAchievement.category] || viewingAchievement.category}
                </span>
                <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  <i className="fas fa-bullseye mr-2"></i>
                  Target: {viewingAchievement.condition_value}
                </span>
                <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  <i className="fas fa-star mr-2"></i>
                  {viewingAchievement.xp_reward || 0} XP
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(viewingAchievement)}
                className="px-5 py-2.5 bg-yellow-600 text-white rounded-xl font-semibold text-sm hover:bg-yellow-700 transition-all transform hover:scale-105"
              >
                <i className="fas fa-edit mr-2"></i>Edit
              </button>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-align-left text-yellow-600 mr-2"></i>
                Description
              </label>
              <p className="text-lg text-gray-900 leading-relaxed">{viewingAchievement.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-cog text-blue-600 mr-2"></i>
                  Condition Type
                </label>
                <p className="text-lg text-gray-900 font-semibold">
                  {CONDITION_TYPE_LABELS[viewingAchievement.condition_type] || viewingAchievement.condition_type}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-bullseye text-purple-600 mr-2"></i>
                  Condition Value
                </label>
                <p className="text-lg text-gray-900 font-semibold">{viewingAchievement.condition_value}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => handleBreadcrumbNavigate(0)}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              <i className="fas fa-arrow-left mr-2"></i>Back to List
            </button>
            <button
              onClick={() => handleEdit(viewingAchievement)}
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              <i className="fas fa-edit mr-2"></i>Edit Achievement
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />

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

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Achievements</h2>
          <p className="text-gray-600">Create and manage achievement definitions</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <i className="fas fa-plus mr-2"></i>Add New Achievement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-trophy text-yellow-600 text-xl"></i>
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
              <p className="text-sm text-gray-500 mb-1">Streak</p>
              <p className="text-2xl font-bold text-blue-600">{stats.byCategory.streak}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-fire text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Community</p>
              <p className="text-2xl font-bold text-purple-600">{stats.byCategory.community}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Activity</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.byCategory.activity}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-running text-indigo-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-search mr-2 text-gray-400"></i>Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by name or description..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-folder mr-2 text-gray-400"></i>Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-cog mr-2 text-gray-400"></i>Condition Type
            </label>
            <select
              value={conditionTypeFilter}
              onChange={(e) => {
                setConditionTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none bg-white"
            >
              <option value="all">All Types</option>
              {uniqueConditionTypes.map(type => (
                <option key={type} value={type}>{CONDITION_TYPE_LABELS[type] || type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-filter mr-2 text-gray-400"></i>Status
            </label>
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading achievements...</p>
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
                  {paginatedAchievements.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                          <p className="text-gray-500 font-medium text-lg mb-2">No achievements found</p>
                          <p className="text-gray-400 text-sm">
                            {searchTerm || categoryFilter !== 'all' || conditionTypeFilter !== 'all' || activeFilter !== 'all'
                              ? 'Try adjusting your filters'
                              : 'No achievements available yet'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedAchievements.map((achievement, rowIndex) => (
                      <tr
                        key={achievement._id || rowIndex}
                        className="hover:bg-yellow-50 transition-colors group"
                      >
                        {columns.map((column) => (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            {column.render ? (
                              column.render(achievement[column.key], achievement)
                            ) : (
                              <div className="text-sm text-gray-900">{achievement[column.key] || '-'}</div>
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView(achievement)}
                              className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-all transform hover:scale-110"
                              title="View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => handleEdit(achievement)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all transform hover:scale-110"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(achievement)}
                              disabled={actionLoading === `delete-${achievement._id}`}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              {actionLoading === `delete-${achievement._id}` ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fas fa-trash"></i>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startItem + 1}</span> to{' '}
                  <span className="font-medium">{endItem}</span> of{' '}
                  <span className="font-medium">{sortedAchievements.length}</span> results
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
                              ? 'bg-yellow-600 text-white shadow-lg'
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

export default AchievementTable


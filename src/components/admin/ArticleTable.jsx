import { useState, useEffect } from 'react'
import api from '../../services/api'
import Breadcrumb from '../common/Breadcrumb'
import ArticleForm from './ArticleForm'

function ArticleTable({ onBreadcrumbChange }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [editingArticle, setEditingArticle] = useState(null)
  const [viewingArticle, setViewingArticle] = useState(null)
  const [mode, setMode] = useState('list') // 'list', 'view', 'add', 'edit'
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Articles' },
  ])
  const [actionLoading, setActionLoading] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const pageSize = 10

  const ARTICLE_CATEGORIES = [
    'Sleep',
    'Exercise',
    'Meditation',
    'Mood Tracking',
    'Fitness',
    'Yoga',
    'Anxiety',
    'Depression',
    'Stress Management',
    'Self-Care',
    'Relationships',
    'Nutrition',
    'Mindfulness',
    'Therapy & Counseling',
    'Personal Growth',
    'Work-Life Balance',
    'Addiction Recovery',
    'Trauma Healing',
    'Parenting & Family',
    'Grief & Loss',
    'Cognitive Behavioral Therapy (CBT)',
    'Other',
  ]

  useEffect(() => {
    if (onBreadcrumbChange) {
      onBreadcrumbChange(breadcrumbItems)
    }
  }, [breadcrumbItems, onBreadcrumbChange])

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles()
    }, searchTerm ? 500 : 0) // 500ms debounce for search

    return () => clearTimeout(timer)
  }, [searchTerm, statusFilter, categoryFilter])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, categoryFilter])

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

  const fetchArticles = async () => {
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
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter
      }
      if (categoryFilter && categoryFilter !== 'all') {
        params.category = categoryFilter
      }

      const response = await api.get('/articles/admin/all', { params })
      if (response.data.success) {
        let data = response.data.data || []

        // Apply client-side search if backend search wasn't used
        if (searchTerm && searchTerm.trim() && !params.search) {
          const searchLower = searchTerm.toLowerCase().trim()
          data = data.filter((article) => {
            const title = (article.title || '').toLowerCase()
            const category = (article.category || '').toLowerCase()
            const authorName = (article.author?.name || '').toLowerCase()
            return title.includes(searchLower) ||
                   category.includes(searchLower) ||
                   authorName.includes(searchLower)
          })
        }

        setArticles(data)
        setTotalItems(data.length)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      setArticles([])
      setTotalItems(0)
      setErrorMessage('Failed to load articles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBreadcrumbNavigate = (index) => {
    if (index === 0) {
      setMode('list')
      setViewingArticle(null)
      setEditingArticle(null)
      setBreadcrumbItems([{ label: 'Articles' }])
    } else if (index === 1 && mode === 'view') {
      setMode('list')
      setViewingArticle(null)
      setBreadcrumbItems([{ label: 'Articles' }])
    } else if (index === 1 && (mode === 'add' || mode === 'edit')) {
      setMode('list')
      setEditingArticle(null)
      setBreadcrumbItems([{ label: 'Articles' }])
    }
  }

  const handleView = (article) => {
    setViewingArticle(article)
    setMode('view')
    setBreadcrumbItems([
      { label: 'Articles', onClick: () => handleBreadcrumbNavigate(0) },
      { label: article.title || 'Article Details' },
    ])
  }

  const handleEdit = (article) => {
    setEditingArticle(article)
    setMode('edit')
    setBreadcrumbItems([
      { label: 'Articles', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Edit Article' },
    ])
  }

  const handleDelete = async (article) => {
    if (!window.confirm(`Are you sure you want to delete "${article.title}"?\n\nThis action cannot be undone.`)) {
      return
    }

    setActionLoading(`delete-${article._id}`)
    setErrorMessage('')
    try {
      await api.delete(`/articles/admin/${article._id}`)
      setSuccessMessage(`Article "${article.title}" deleted successfully!`)
      fetchArticles()
    } catch (error) {
      console.error('Error deleting article:', error)
      setErrorMessage('Failed to delete article. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleStatus = async (article) => {
    setActionLoading(`toggle-${article._id}`)
    setErrorMessage('')
    try {
      await api.patch(`/articles/admin/${article._id}/toggle-status`)
      const newStatus = article.status === 'published' ? 'draft' : 'published'
      setSuccessMessage(`Article ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`)
      fetchArticles()
      // Update viewing article if we're viewing it
      if (viewingArticle && viewingArticle._id === article._id) {
        setViewingArticle({ ...viewingArticle, status: newStatus })
      }
    } catch (error) {
      console.error('Error toggling article status:', error)
      setErrorMessage('Failed to update article status. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleAdd = () => {
    setEditingArticle(null)
    setMode('add')
    setBreadcrumbItems([
      { label: 'Articles', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Add New Article' },
    ])
  }

  const handleFormSave = () => {
    setSuccessMessage(editingArticle ? 'Article updated successfully!' : 'Article created successfully!')
    fetchArticles()
    setMode('list')
    setEditingArticle(null)
    setBreadcrumbItems([{ label: 'Articles' }])
  }

  const handleFormCancel = () => {
    setMode('list')
    setEditingArticle(null)
    setBreadcrumbItems([{ label: 'Articles' }])
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
  const sortedArticles = [...articles].sort((a, b) => {
    if (!sortConfig.key) return 0

    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    // Handle nested values
    if (sortConfig.key === 'author') {
      aValue = a.author?.name || ''
      bValue = b.author?.name || ''
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
    if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at' || sortConfig.key === 'published_at') {
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

    return 0
  })

  const startItem = (currentPage - 1) * pageSize
  const endItem = Math.min(currentPage * pageSize, sortedArticles.length)
  const paginatedArticles = sortedArticles.slice(startItem, endItem)
  const totalPages = Math.ceil(sortedArticles.length / pageSize)

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0),
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value, row) => (
        <div className="max-w-xs">
          <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {value || '-'}
          </div>
          {row.category && (
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <i className="fas fa-tag mr-1"></i>
              {row.category}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'author',
      label: 'Author',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-900 flex items-center">
          {value?.profile_photo ? (
            <img
              src={value.profile_photo}
              alt={value.name}
              className="w-6 h-6 rounded-full mr-2 object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full mr-2 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
              {(value?.name || 'U')[0].toUpperCase()}
            </div>
          )}
          <span>{value?.name || 'Unknown'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${
            value === 'published'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
          }`}
        >
          <i className={`fas ${value === 'published' ? 'fa-check-circle' : 'fa-clock'} mr-1.5`}></i>
          {value === 'published' ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-900 flex items-center">
          <i className="fas fa-eye text-gray-400 mr-2"></i>
          <span className="font-medium">{value || 0}</span>
        </div>
      ),
    },
    {
      key: 'read_time_minutes',
      label: 'Read Time',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-600 flex items-center">
          <i className="fas fa-clock text-gray-400 mr-2"></i>
          {value || '-'} {value ? 'min' : ''}
        </div>
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

  // If adding or editing
  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <ArticleForm
          article={editingArticle}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  // If viewing a single article
  if (mode === 'view' && viewingArticle) {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-6 border-b border-gray-200 space-y-4 md:space-y-0">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{viewingArticle.title}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center ${
                  viewingArticle.status === 'published'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}>
                  <i className={`fas ${viewingArticle.status === 'published' ? 'fa-check-circle' : 'fa-clock'} mr-2`}></i>
                  {viewingArticle.status === 'published' ? 'Published' : 'Draft'}
                </span>
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  <i className="fas fa-tag mr-2"></i>
                  {viewingArticle.category}
                </span>
                {viewingArticle.read_time_minutes && (
                  <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                    <i className="fas fa-clock mr-2"></i>
                    {viewingArticle.read_time_minutes} min read
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleToggleStatus(viewingArticle)}
                disabled={actionLoading === `toggle-${viewingArticle._id}`}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  viewingArticle.status === 'published'
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300'
                    : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                }`}
              >
                {actionLoading === `toggle-${viewingArticle._id}` ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className={`fas ${viewingArticle.status === 'published' ? 'fa-eye-slash' : 'fa-eye'} mr-2`}></i>
                )}
                {viewingArticle.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => handleEdit(viewingArticle)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                <i className="fas fa-edit mr-2"></i>Edit
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {viewingArticle.featured_image_url && (
            <div className="mb-8">
              <img
                src={viewingArticle.featured_image_url}
                alt={viewingArticle.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg border-2 border-gray-200"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Article Images */}
          {viewingArticle.image_urls && viewingArticle.image_urls.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-images text-blue-600 mr-3"></i>
                Article Images ({viewingArticle.image_urls.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {viewingArticle.image_urls.map((url, index) => {
                  const getImageUrl = (imageUrl) => {
                    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                      return imageUrl
                    }
                    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api/v1'
                    const baseUrl = API_BASE_URL.replace('/api/v1', '')
                    return `${baseUrl}${imageUrl}`
                  }
                  
                  return (
                    <div
                      key={index}
                      className="relative group bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 transition-all duration-200"
                    >
                      <img
                        src={getImageUrl(url)}
                        alt={`Article image ${index + 1}`}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded pointer-events-none">
                        {index + 1}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Article Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-user text-white"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Author</p>
                  <p className="text-sm font-semibold text-gray-800">{viewingArticle.author?.name || 'Unknown'}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-eye text-white"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Views</p>
                  <p className="text-sm font-semibold text-gray-800">{viewingArticle.views || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-heart text-white"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Likes</p>
                  <p className="text-sm font-semibold text-gray-800">{viewingArticle.likes || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="bg-gray-50 p-8 rounded-2xl border border-gray-200"
              dangerouslySetInnerHTML={{ __html: viewingArticle.content }}
            />
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => handleBreadcrumbNavigate(0)}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              <i className="fas fa-arrow-left mr-2"></i>Back to List
            </button>
            <button
              onClick={() => handleEdit(viewingArticle)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              <i className="fas fa-edit mr-2"></i>Edit Article
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Articles</h2>
          <p className="text-gray-600">Comprehensive article management system</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <i className="fas fa-plus mr-2"></i>Add New Article
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Articles</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-newspaper text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-clock text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Views</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-eye text-purple-600 text-xl"></i>
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
                placeholder="Search by title, category, author..."
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-filter mr-2 text-gray-400"></i>Status
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-tag mr-2 text-gray-400"></i>Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {ARTICLE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
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
              <p className="text-gray-600 font-medium">Loading articles...</p>
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
                  {paginatedArticles.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                          <p className="text-gray-500 font-medium text-lg mb-2">No articles found</p>
                          <p className="text-gray-400 text-sm">
                            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                              ? 'Try adjusting your filters'
                              : 'Get started by creating your first article'}
                          </p>
                          {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
                            <button
                              onClick={handleAdd}
                              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                            >
                              <i className="fas fa-plus mr-2"></i>Create Article
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedArticles.map((article, rowIndex) => (
                      <tr
                        key={article._id || rowIndex}
                        className="hover:bg-blue-50 transition-colors group"
                      >
                        {columns.map((column) => (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            {column.render ? (
                              column.render(article[column.key], article)
                            ) : (
                              <div className="text-sm text-gray-900">{article[column.key] || '-'}</div>
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView(article)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110"
                              title="View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => handleEdit(article)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all transform hover:scale-110"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(article)}
                              disabled={actionLoading === `toggle-${article._id}`}
                              className={`p-2 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                                article.status === 'published'
                                  ? 'text-yellow-600 hover:bg-yellow-100'
                                  : 'text-green-600 hover:bg-green-100'
                              }`}
                              title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                            >
                              {actionLoading === `toggle-${article._id}` ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className={`fas ${article.status === 'published' ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(article)}
                              disabled={actionLoading === `delete-${article._id}`}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              {actionLoading === `delete-${article._id}` ? (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startItem + 1}</span> to{' '}
                  <span className="font-medium">{endItem}</span> of{' '}
                  <span className="font-medium">{sortedArticles.length}</span> results
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

export default ArticleTable

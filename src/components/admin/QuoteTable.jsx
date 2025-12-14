import { useState, useEffect } from 'react'
import api from '../../services/api'
import Breadcrumb from '../common/Breadcrumb'
import QuoteForm from './QuoteForm'

function QuoteTable({ onBreadcrumbChange }) {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [todayQuoteFilter, setTodayQuoteFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [editingQuote, setEditingQuote] = useState(null)
  const [viewingQuote, setViewingQuote] = useState(null)
  const [mode, setMode] = useState('list') // 'list', 'view', 'add', 'edit'
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Quotes' },
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

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuotes()
    }, searchTerm ? 500 : 0) // 500ms debounce for search

    return () => clearTimeout(timer)
  }, [searchTerm, todayQuoteFilter])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, todayQuoteFilter])

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

  const fetchQuotes = async () => {
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
      if (todayQuoteFilter && todayQuoteFilter !== 'all') {
        params.is_today_quote = todayQuoteFilter
      }

      const response = await api.get('/quote/admin/all', { params })
      if (response.data.success) {
        let data = response.data.data || []

        // Apply client-side search if backend search wasn't used
        if (searchTerm && searchTerm.trim() && !params.search) {
          const searchLower = searchTerm.toLowerCase().trim()
          data = data.filter((quote) => {
            const english = (quote.quote_english || '').toLowerCase()
            const urdu = (quote.quote_urdu || '').toLowerCase()
            const verse = (quote.quranic_verse || '').toLowerCase()
            return english.includes(searchLower) ||
                   urdu.includes(searchLower) ||
                   verse.includes(searchLower)
          })
        }

        setQuotes(data)
        setTotalItems(data.length)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
      setQuotes([])
      setTotalItems(0)
      setErrorMessage('Failed to load quotes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBreadcrumbNavigate = (index) => {
    if (index === 0) {
      setMode('list')
      setViewingQuote(null)
      setEditingQuote(null)
      setBreadcrumbItems([{ label: 'Quotes' }])
    } else if (index === 1 && mode === 'view') {
      setMode('list')
      setViewingQuote(null)
      setBreadcrumbItems([{ label: 'Quotes' }])
    } else if (index === 1 && mode === 'edit') {
      setMode('list')
      setEditingQuote(null)
      setBreadcrumbItems([{ label: 'Quotes' }])
    }
  }

  const handleView = (quote) => {
    setViewingQuote(quote)
    setMode('view')
    setBreadcrumbItems([
      { label: 'Quotes', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Quote Details' },
    ])
  }

  const handleEdit = (quote) => {
    setEditingQuote(quote)
    setMode('edit')
    setBreadcrumbItems([
      { label: 'Quotes', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Edit Quote' },
    ])
  }

  const handleDelete = async (quote) => {
    if (!window.confirm(`Are you sure you want to delete this quote?\n\n"${quote.quote_english.substring(0, 50)}..."\n\nThis action cannot be undone.`)) {
      return
    }

    setActionLoading(`delete-${quote._id}`)
    setErrorMessage('')
    try {
      await api.delete(`/quote/admin/${quote._id}`)
      setSuccessMessage('Quote deleted successfully!')
      fetchQuotes()
    } catch (error) {
      console.error('Error deleting quote:', error)
      setErrorMessage('Failed to delete quote. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSetTodayQuote = async (quote) => {
    setActionLoading(`today-${quote._id}`)
    setErrorMessage('')
    try {
      await api.patch(`/quote/admin/${quote._id}/set-today`)
      setSuccessMessage('Quote set as quote of the day successfully!')
      fetchQuotes()
      // Update viewing quote if we're viewing it
      if (viewingQuote && viewingQuote._id === quote._id) {
        setViewingQuote({ ...viewingQuote, is_today_quote: true })
      }
    } catch (error) {
      console.error('Error setting today quote:', error)
      setErrorMessage('Failed to set quote of the day. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleAdd = () => {
    setEditingQuote(null)
    setMode('add')
    setBreadcrumbItems([
      { label: 'Quotes', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Add New Quote' },
    ])
  }

  const handleFormSave = () => {
    setSuccessMessage(editingQuote ? 'Quote updated successfully!' : 'Quote created successfully!')
    fetchQuotes()
    setMode('list')
    setEditingQuote(null)
    setBreadcrumbItems([{ label: 'Quotes' }])
  }

  const handleFormCancel = () => {
    setMode('list')
    setEditingQuote(null)
    setBreadcrumbItems([{ label: 'Quotes' }])
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
      <i className="fas fa-sort-up text-purple-600"></i>
    ) : (
      <i className="fas fa-sort-down text-purple-600"></i>
    )
  }

  // Sort and paginate data
  const sortedQuotes = [...quotes].sort((a, b) => {
    if (!sortConfig.key) return 0

    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    // Handle null/undefined
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' })
        : bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' })
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

    // Handle dates
    if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at' || sortConfig.key === 'selected_date') {
      const aDate = new Date(aValue).getTime()
      const bDate = new Date(bValue).getTime()
      if (!isNaN(aDate) && !isNaN(bDate)) {
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate
      }
    }

    return 0
  })

  const startItem = (currentPage - 1) * pageSize
  const endItem = Math.min(currentPage * pageSize, sortedQuotes.length)
  const paginatedQuotes = sortedQuotes.slice(startItem, endItem)
  const totalPages = Math.ceil(sortedQuotes.length / pageSize)

  const stats = {
    total: quotes.length,
    todayQuote: quotes.filter(q => q.is_today_quote).length,
    regular: quotes.filter(q => !q.is_today_quote).length,
  }

  const columns = [
    {
      key: 'quote_english',
      label: 'English Quote',
      sortable: true,
      render: (value, row) => (
        <div className="max-w-md">
          <div className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {value || '-'}
          </div>
          {row.quote_urdu && (
            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
              {row.quote_urdu}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'quote_urdu',
      label: 'Urdu Quote',
      sortable: true,
      render: (value) => (
        <div className="max-w-xs text-sm text-gray-700 line-clamp-2">
          {value || <span className="text-gray-400">-</span>}
        </div>
      ),
    },
    {
      key: 'quranic_verse',
      label: 'Quranic Verse',
      sortable: true,
      render: (value) => (
        <div className="max-w-xs text-sm text-gray-700 line-clamp-2">
          {value || <span className="text-gray-400">-</span>}
        </div>
      ),
    },
    {
      key: 'is_today_quote',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${
          value
            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          <i className={`fas ${value ? 'fa-star' : 'fa-star-o'} mr-1.5`}></i>
          {value ? "Today's Quote" : 'Regular'}
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

  // If adding or editing
  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <QuoteForm
          quote={editingQuote}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  // If viewing a single quote
  if (mode === 'view' && viewingQuote) {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-6 border-b border-gray-200 space-y-4 md:space-y-0">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quote Details</h2>
              <div className="flex flex-wrap items-center gap-3">
                {viewingQuote.is_today_quote && (
                  <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold border border-yellow-200">
                    <i className="fas fa-star mr-2"></i>
                    Today's Quote
                  </span>
                )}
                {viewingQuote.selected_date && (
                  <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    <i className="fas fa-calendar mr-2"></i>
                    Selected: {new Date(viewingQuote.selected_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              {!viewingQuote.is_today_quote && (
                <button
                  onClick={() => handleSetTodayQuote(viewingQuote)}
                  disabled={actionLoading === `today-${viewingQuote._id}`}
                  className="px-5 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl font-semibold text-sm hover:bg-yellow-200 border border-yellow-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {actionLoading === `today-${viewingQuote._id}` ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-star mr-2"></i>
                  )}
                  Set as Today's Quote
                </button>
              )}
              <button
                onClick={() => handleEdit(viewingQuote)}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition-all transform hover:scale-105"
              >
                <i className="fas fa-edit mr-2"></i>Edit
              </button>
            </div>
          </div>

          {/* Quote Content */}
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-quote-right text-purple-600 mr-2"></i>
                English Quote
              </label>
              <p className="text-lg text-gray-900 leading-relaxed">{viewingQuote.quote_english}</p>
            </div>

            {viewingQuote.quote_urdu && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-language text-blue-600 mr-2"></i>
                  Urdu Quote
                </label>
                <p className="text-lg text-gray-900 leading-relaxed" dir="rtl">{viewingQuote.quote_urdu}</p>
              </div>
            )}

            {viewingQuote.quranic_verse && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-book-quran text-green-600 mr-2"></i>
                  Quranic Verse
                </label>
                <p className="text-lg text-gray-900 leading-relaxed">{viewingQuote.quranic_verse}</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => handleBreadcrumbNavigate(0)}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              <i className="fas fa-arrow-left mr-2"></i>Back to List
            </button>
            {!viewingQuote.is_today_quote && (
              <button
                onClick={() => handleSetTodayQuote(viewingQuote)}
                disabled={actionLoading === `today-${viewingQuote._id}`}
                className="px-6 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl font-semibold hover:bg-yellow-200 border border-yellow-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {actionLoading === `today-${viewingQuote._id}` ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-star mr-2"></i>
                )}
                Set as Today's Quote
              </button>
            )}
            <button
              onClick={() => handleEdit(viewingQuote)}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              <i className="fas fa-edit mr-2"></i>Edit Quote
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Quotes</h2>
          <p className="text-gray-600">Comprehensive quote management system</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <i className="fas fa-plus mr-2"></i>Add New Quote
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Quotes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-quote-left text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Today's Quote</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.todayQuote}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-star text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Regular Quotes</p>
              <p className="text-2xl font-bold text-gray-600">{stats.regular}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-quote-right text-gray-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Search by English, Urdu, or Quranic verse..."
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-filter mr-2 text-gray-400"></i>Status
            </label>
            <select
              value={todayQuoteFilter}
              onChange={(e) => {
                setTodayQuoteFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none bg-white"
            >
              <option value="all">All Quotes</option>
              <option value="true">Today's Quote</option>
              <option value="false">Regular Quotes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading quotes...</p>
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
                  {paginatedQuotes.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                          <p className="text-gray-500 font-medium text-lg mb-2">No quotes found</p>
                          <p className="text-gray-400 text-sm">
                            {searchTerm || todayQuoteFilter !== 'all'
                              ? 'Try adjusting your filters'
                              : 'No quotes available yet'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedQuotes.map((quote, rowIndex) => (
                      <tr
                        key={quote._id || rowIndex}
                        className="hover:bg-purple-50 transition-colors group"
                      >
                        {columns.map((column) => (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            {column.render ? (
                              column.render(quote[column.key], quote)
                            ) : (
                              <div className="text-sm text-gray-900">{quote[column.key] || '-'}</div>
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView(quote)}
                              className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-all transform hover:scale-110"
                              title="View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => handleEdit(quote)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all transform hover:scale-110"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {!quote.is_today_quote && (
                              <button
                                onClick={() => handleSetTodayQuote(quote)}
                                disabled={actionLoading === `today-${quote._id}`}
                                className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Set as Today's Quote"
                              >
                                {actionLoading === `today-${quote._id}` ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fas fa-star"></i>
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(quote)}
                              disabled={actionLoading === `delete-${quote._id}`}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              {actionLoading === `delete-${quote._id}` ? (
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
                  <span className="font-medium">{sortedQuotes.length}</span> results
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
                              ? 'bg-purple-600 text-white shadow-lg'
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

export default QuoteTable


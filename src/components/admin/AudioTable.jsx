import { useState, useEffect } from 'react'
import api from '../../services/api'
import Breadcrumb from '../common/Breadcrumb'
import AudioForm from './AudioForm'

const CATEGORY_LABELS = {
  Breathing: 'Breathing',
  Meditation: 'Meditation',
  Sleep: 'Sleep',
  Relaxation: 'Relaxation',
  Mindfulness: 'Mindfulness',
}

const LANGUAGE_LABELS = {
  Urdu: 'Urdu',
  English: 'English',
}

function AudioTable({ onBreadcrumbChange }) {
  const [audios, setAudios] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [editingAudio, setEditingAudio] = useState(null)
  const [viewingAudio, setViewingAudio] = useState(null)
  const [playingAudio, setPlayingAudio] = useState(null)
  const [mode, setMode] = useState('list') // 'list', 'view', 'add', 'edit'
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Audios' },
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
    fetchStatistics()
    const timer = setTimeout(() => {
      fetchAudios()
    }, searchTerm ? 500 : 0)

    return () => clearTimeout(timer)
  }, [searchTerm, categoryFilter, languageFilter, activeFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, languageFilter, activeFilter])

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

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/audio/admin/statistics')
      if (response.data.success) {
        setStatistics(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const fetchAudios = async () => {
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
      if (languageFilter && languageFilter !== 'all') {
        params.language = languageFilter
      }
      if (activeFilter && activeFilter !== 'all') {
        params.is_active = activeFilter
      }

      const response = await api.get('/audio/admin/all', { params })
      if (response.data.success) {
        let data = response.data.data || []

        if (searchTerm && searchTerm.trim() && !params.search) {
          const searchLower = searchTerm.toLowerCase().trim()
          data = data.filter((audio) => {
            const title = (audio.title || '').toLowerCase()
            const description = (audio.description || '').toLowerCase()
            const filename = (audio.filename || '').toLowerCase()
            return title.includes(searchLower) || description.includes(searchLower) || filename.includes(searchLower)
          })
        }

        setAudios(data)
      }
    } catch (error) {
      console.error('Error fetching audios:', error)
      setAudios([])
      setErrorMessage('Failed to load audios. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBreadcrumbNavigate = (index) => {
    if (index === 0) {
      setMode('list')
      setViewingAudio(null)
      setEditingAudio(null)
      setBreadcrumbItems([{ label: 'Audios' }])
    } else if (index === 1 && mode === 'view') {
      setMode('list')
      setViewingAudio(null)
      setBreadcrumbItems([{ label: 'Audios' }])
    } else if (index === 1 && (mode === 'edit' || mode === 'add')) {
      setMode('list')
      setEditingAudio(null)
      setBreadcrumbItems([{ label: 'Audios' }])
    }
  }

  const handleView = (audio) => {
    setViewingAudio(audio)
    setMode('view')
    setBreadcrumbItems([
      { label: 'Audios', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Audio Details' },
    ])
  }

  const handleEdit = (audio) => {
    setEditingAudio(audio)
    setMode('edit')
    setBreadcrumbItems([
      { label: 'Audios', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Edit Audio' },
    ])
  }

  const handleDelete = async (audio) => {
    if (!window.confirm(`Are you sure you want to delete this audio?\n\n"${audio.title}"\n\nThis will delete the file and database record. This action cannot be undone.`)) {
      return
    }

    setActionLoading(`delete-${audio._id}`)
    setErrorMessage('')
    try {
      await api.delete(`/audio/admin/${audio._id}`)
      setSuccessMessage('Audio deleted successfully!')
      fetchAudios()
      fetchStatistics()
    } catch (error) {
      console.error('Error deleting audio:', error)
      const errorMsg = error.response?.data?.message || 'Failed to delete audio. Please try again.'
      setErrorMessage(errorMsg)
    } finally {
      setActionLoading(null)
    }
  }

  const handleAdd = () => {
    setEditingAudio(null)
    setMode('add')
    setBreadcrumbItems([
      { label: 'Audios', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Add New Audio' },
    ])
  }

  const handleFormSave = () => {
    setSuccessMessage(editingAudio ? 'Audio updated successfully!' : 'Audio created successfully!')
    fetchAudios()
    fetchStatistics()
    setMode('list')
    setEditingAudio(null)
    setBreadcrumbItems([{ label: 'Audios' }])
  }

  const handleFormCancel = () => {
    setMode('list')
    setEditingAudio(null)
    setBreadcrumbItems([{ label: 'Audios' }])
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

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const mb = bytes / (1024 * 1024)
    if (mb < 1) {
      const kb = bytes / 1024
      return `${kb.toFixed(2)} KB`
    }
    return `${mb.toFixed(2)} MB`
  }

  const getAudioUrl = (streamUrl) => {
    if (!streamUrl) return null
    if (streamUrl.startsWith('http://') || streamUrl.startsWith('https://')) {
      return streamUrl
    }
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api/v1'
    const baseUrl = API_BASE_URL.replace('/api/v1', '')
    return `${baseUrl}${streamUrl}`
  }

  const sortedAudios = [...audios].sort((a, b) => {
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
  const endItem = Math.min(currentPage * pageSize, sortedAudios.length)
  const paginatedAudios = sortedAudios.slice(startItem, endItem)
  const totalPages = Math.ceil(sortedAudios.length / pageSize)

  const stats = statistics || {
    total: audios.length,
    active: audios.filter(a => a.is_active).length,
    inactive: audios.filter(a => !a.is_active).length,
    byCategory: {},
    byLanguage: {},
  }

  const uniqueCategories = [...new Set(audios.map(a => a.category).filter(Boolean))].sort()
  const uniqueLanguages = [...new Set(audios.map(a => a.language).filter(Boolean))].sort()

  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value, row) => (
        <div className="max-w-md">
          <div className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {value || '-'}
          </div>
          {row.filename && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              <i className="fas fa-file-audio mr-1"></i>
              {row.filename}
            </div>
          )}
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
      key: 'language',
      label: 'Language',
      sortable: true,
      render: (value) => (
        <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
          {LANGUAGE_LABELS[value] || value}
        </span>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <i className="fas fa-clock text-gray-400 mr-2"></i>
          <span className="text-sm font-semibold text-gray-700">{formatDuration(value)}</span>
        </div>
      ),
    },
    {
      key: 'file_size',
      label: 'File Size',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-600">
          {formatFileSize(value)}
        </div>
      ),
    },
    {
      key: 'play_count',
      label: 'Plays',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <i className="fas fa-play-circle text-green-500 mr-2"></i>
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
        <AudioForm
          audio={editingAudio}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  if (mode === 'view' && viewingAudio) {
    const audioUrl = getAudioUrl(viewingAudio.stream_url)
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-6 border-b border-gray-200 space-y-4 md:space-y-0">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <i className="fas fa-music text-4xl mr-4 text-blue-600"></i>
                <h2 className="text-3xl font-bold text-gray-800">{viewingAudio.title}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center ${
                  viewingAudio.is_active
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}>
                  <i className={`fas ${viewingAudio.is_active ? 'fa-check-circle' : 'fa-times-circle'} mr-2`}></i>
                  {viewingAudio.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  <i className="fas fa-folder mr-2"></i>
                  {CATEGORY_LABELS[viewingAudio.category] || viewingAudio.category}
                </span>
                <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  <i className="fas fa-language mr-2"></i>
                  {LANGUAGE_LABELS[viewingAudio.language] || viewingAudio.language}
                </span>
                <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  <i className="fas fa-play-circle mr-2"></i>
                  {viewingAudio.play_count || 0} plays
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(viewingAudio)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                <i className="fas fa-edit mr-2"></i>Edit
              </button>
            </div>
          </div>

          {audioUrl && (
            <div className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-headphones text-blue-600 mr-3"></i>
                Audio Player
              </h3>
              <audio controls className="w-full">
                <source src={audioUrl} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="space-y-6 mb-8">
            {viewingAudio.description && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-align-left text-blue-600 mr-2"></i>
                  Description
                </label>
                <p className="text-lg text-gray-900 leading-relaxed">{viewingAudio.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-clock text-green-600 mr-2"></i>
                  Duration
                </label>
                <p className="text-lg text-gray-900 font-semibold">{formatDuration(viewingAudio.duration)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-hdd text-purple-600 mr-2"></i>
                  File Size
                </label>
                <p className="text-lg text-gray-900 font-semibold">{formatFileSize(viewingAudio.file_size)}</p>
              </div>
              {viewingAudio.bitrate && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-signal text-orange-600 mr-2"></i>
                    Bitrate
                  </label>
                  <p className="text-lg text-gray-900 font-semibold">{viewingAudio.bitrate} kbps</p>
                </div>
              )}
              {viewingAudio.sample_rate && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-waveform-lines text-indigo-600 mr-2"></i>
                    Sample Rate
                  </label>
                  <p className="text-lg text-gray-900 font-semibold">{viewingAudio.sample_rate} Hz</p>
                </div>
              )}
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
              onClick={() => handleEdit(viewingAudio)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              <i className="fas fa-edit mr-2"></i>Edit Audio
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Audios</h2>
          <p className="text-gray-600">Upload and manage audio files for meditation, breathing, and relaxation</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <i className="fas fa-plus mr-2"></i>Add New Audio
        </button>
      </div>

      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="glass-card rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-music text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active</p>
                <p className="text-2xl font-bold text-green-600">{statistics.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Storage</p>
                <p className="text-2xl font-bold text-purple-600">{formatFileSize(statistics.totalStorage)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-hdd text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg Duration</p>
                <p className="text-2xl font-bold text-orange-600">{formatDuration(statistics.averageDuration)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-orange-600 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Plays</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {statistics.mostPlayed?.reduce((sum, a) => sum + (a.play_count || 0), 0) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-play-circle text-indigo-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      )}

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
              placeholder="Search by title, description, filename..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-language mr-2 text-gray-400"></i>Language
            </label>
            <select
              value={languageFilter}
              onChange={(e) => {
                setLanguageFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
            >
              <option value="all">All Languages</option>
              {uniqueLanguages.map(lang => (
                <option key={lang} value={lang}>{LANGUAGE_LABELS[lang] || lang}</option>
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
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
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading audios...</p>
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
                  {paginatedAudios.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                          <p className="text-gray-500 font-medium text-lg mb-2">No audios found</p>
                          <p className="text-gray-400 text-sm">
                            {searchTerm || categoryFilter !== 'all' || languageFilter !== 'all' || activeFilter !== 'all'
                              ? 'Try adjusting your filters'
                              : 'No audios available yet'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedAudios.map((audio, rowIndex) => {
                      const audioUrl = getAudioUrl(audio.stream_url)
                      return (
                        <tr
                          key={audio._id || rowIndex}
                          className="hover:bg-blue-50 transition-colors group"
                        >
                          {columns.map((column) => (
                            <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                              {column.render ? (
                                column.render(audio[column.key], audio)
                              ) : (
                                <div className="text-sm text-gray-900">{audio[column.key] || '-'}</div>
                              )}
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {audioUrl && (
                                <button
                                  onClick={() => setPlayingAudio(playingAudio === audio._id ? null : audio._id)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110"
                                  title="Preview"
                                >
                                  <i className={`fas ${playingAudio === audio._id ? 'fa-pause' : 'fa-play'}`}></i>
                                </button>
                              )}
                              <button
                                onClick={() => handleView(audio)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110"
                                title="View"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                onClick={() => handleEdit(audio)}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all transform hover:scale-110"
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(audio)}
                                disabled={actionLoading === `delete-${audio._id}`}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete"
                              >
                                {actionLoading === `delete-${audio._id}` ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fas fa-trash"></i>
                                )}
                              </button>
                            </div>
                            {playingAudio === audio._id && audioUrl && (
                              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                <audio controls className="w-full" onEnded={() => setPlayingAudio(null)}>
                                  <source src={audioUrl} />
                                  Your browser does not support the audio element.
                                </audio>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startItem + 1}</span> to{' '}
                  <span className="font-medium">{endItem}</span> of{' '}
                  <span className="font-medium">{sortedAudios.length}</span> results
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

export default AudioTable


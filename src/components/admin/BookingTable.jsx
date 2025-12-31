import { useState, useEffect } from 'react'
import api from '../../services/api'
import Breadcrumb from '../common/Breadcrumb'

const STATUS_LABELS = {
  PENDING_PAYMENT: 'Pending Payment',
  PENDING_APPROVAL: 'Pending Approval',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
}

const SESSION_STATUS_LABELS = {
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
}

const STATUS_COLORS = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  PENDING_APPROVAL: 'bg-orange-100 text-orange-700 border-orange-200',
  CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-700 border-gray-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  EXPIRED: 'bg-gray-100 text-gray-700 border-gray-200',
}

const SESSION_STATUS_COLORS = {
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
  NO_SHOW: 'bg-gray-100 text-gray-700 border-gray-200',
}

function BookingTable({ onBreadcrumbChange }) {
  const [view, setView] = useState('pending') // 'pending' or 'sessions'
  const [pendingRequests, setPendingRequests] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [viewingItem, setViewingItem] = useState(null)
  const [mode, setMode] = useState('list') // 'list', 'view'
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Bookings & Sessions' },
  ])
  const [actionLoading, setActionLoading] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [approvalNotes, setApprovalNotes] = useState('')
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [newStatus, setNewStatus] = useState('COMPLETED')
  const [statusNotes, setStatusNotes] = useState('')
  const [cancellationReason, setCancellationReason] = useState('')
  const pageSize = 10

  useEffect(() => {
    if (onBreadcrumbChange) {
      onBreadcrumbChange(breadcrumbItems)
    }
  }, [breadcrumbItems, onBreadcrumbChange])

  useEffect(() => {
    if (view === 'pending') {
      fetchPendingRequests()
    } else {
      fetchSessions()
    }
  }, [view, currentPage, statusFilter, dateFilter])

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

  const fetchPendingRequests = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const response = await api.get('/booking/admin/pending-requests', {
        params: {
          page: currentPage,
          limit: pageSize,
        },
      })
      if (response.data.success) {
        setPendingRequests(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error)
      setPendingRequests([])
      setErrorMessage('Failed to load pending requests. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchSessions = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      }

      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter
      }

      if (dateFilter && dateFilter !== 'all') {
        const today = new Date()
        if (dateFilter === 'today') {
          params.start_date = today.toISOString().split('T')[0]
          params.end_date = today.toISOString().split('T')[0]
        } else if (dateFilter === 'week') {
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          params.start_date = weekStart.toISOString().split('T')[0]
          params.end_date = today.toISOString().split('T')[0]
        } else if (dateFilter === 'month') {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
          params.start_date = monthStart.toISOString().split('T')[0]
          params.end_date = today.toISOString().split('T')[0]
        }
      }

      const response = await api.get('/booking/admin/sessions', { params })
      if (response.data.success) {
        setSessions(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
      setSessions([])
      setErrorMessage('Failed to load sessions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    setViewingItem(item)
    setMode('view')
    setBreadcrumbItems([
      { label: 'Bookings & Sessions', onClick: () => handleBreadcrumbNavigate(0) },
      { label: view === 'pending' ? 'Request Details' : 'Session Details' },
    ])
  }

  const handleBreadcrumbNavigate = (index) => {
    if (index === 0) {
      setMode('list')
      setViewingItem(null)
      setBreadcrumbItems([{ label: 'Bookings & Sessions' }])
    }
  }

  const handleApprove = async (requestId) => {
    setSelectedRequestId(requestId)
    setShowApproveModal(true)
  }

  const confirmApprove = async () => {
    if (!selectedRequestId) return

    setActionLoading(`approve-${selectedRequestId}`)
    setErrorMessage('')
    try {
      await api.post(`/booking/admin/session-requests/${selectedRequestId}/approve`, {
        notes: approvalNotes || undefined,
      })
      setSuccessMessage('Session request approved successfully!')
      setShowApproveModal(false)
      setApprovalNotes('')
      setSelectedRequestId(null)
      fetchPendingRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      const errorMsg = error.response?.data?.message || 'Failed to approve request. Please try again.'
      setErrorMessage(errorMsg)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = (requestId) => {
    setSelectedRequestId(requestId)
    setShowRejectModal(true)
  }

  const confirmReject = async () => {
    if (!selectedRequestId || !rejectionReason.trim()) {
      setErrorMessage('Please provide a rejection reason.')
      return
    }

    setActionLoading(`reject-${selectedRequestId}`)
    setErrorMessage('')
    try {
      await api.post(`/booking/admin/session-requests/${selectedRequestId}/reject`, {
        reason: rejectionReason,
      })
      setSuccessMessage('Session request rejected successfully!')
      setShowRejectModal(false)
      setRejectionReason('')
      setSelectedRequestId(null)
      fetchPendingRequests()
    } catch (error) {
      console.error('Error rejecting request:', error)
      const errorMsg = error.response?.data?.message || 'Failed to reject request. Please try again.'
      setErrorMessage(errorMsg)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateStatus = (sessionId, currentStatus) => {
    setSelectedSessionId(sessionId)
    setNewStatus(currentStatus === 'CONFIRMED' ? 'COMPLETED' : currentStatus)
    setStatusNotes('')
    setCancellationReason('')
    setShowStatusModal(true)
  }

  const confirmUpdateStatus = async () => {
    if (!selectedSessionId) return

    // Validate cancellation reason if cancelling
    if (newStatus === 'CANCELLED' && !cancellationReason.trim()) {
      setErrorMessage('Please provide a cancellation reason.')
      return
    }

    setActionLoading(`status-${selectedSessionId}`)
    setErrorMessage('')
    try {
      const payload = {
        status: newStatus,
      }
      
      if (statusNotes.trim()) {
        payload.notes = statusNotes
      }
      
      if (newStatus === 'CANCELLED' && cancellationReason.trim()) {
        payload.cancellation_reason = cancellationReason
      }

      await api.put(`/booking/admin/sessions/${selectedSessionId}/status`, payload)
      setSuccessMessage(`Session status updated to ${newStatus} successfully!`)
      setShowStatusModal(false)
      setStatusNotes('')
      setCancellationReason('')
      setSelectedSessionId(null)
      fetchSessions()
    } catch (error) {
      console.error('Error updating session status:', error)
      const errorMsg = error.response?.data?.message || 'Failed to update session status. Please try again.'
      setErrorMessage(errorMsg)
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return '-'
    const date = new Date(`${dateString}T${timeString}`)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStats = () => {
    if (view === 'pending') {
      return {
        total: pendingRequests.length,
        pendingApproval: pendingRequests.filter(r => r.status === 'PENDING_APPROVAL').length,
      }
    } else {
      return {
        total: sessions.length,
        confirmed: sessions.filter(s => s.status === 'CONFIRMED').length,
        completed: sessions.filter(s => s.status === 'COMPLETED').length,
        cancelled: sessions.filter(s => s.status === 'CANCELLED').length,
      }
    }
  }

  const stats = getStats()

  if (mode === 'view' && viewingItem) {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-6 border-b border-gray-200 space-y-4 md:space-y-0">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {view === 'pending' ? 'Session Request Details' : 'Session Details'}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {view === 'pending' ? (
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center ${
                    STATUS_COLORS[viewingItem.status] || STATUS_COLORS.PENDING_APPROVAL
                  } border`}>
                    <i className="fas fa-clock mr-2"></i>
                    {STATUS_LABELS[viewingItem.status] || viewingItem.status}
                  </span>
                ) : (
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center ${
                    SESSION_STATUS_COLORS[viewingItem.status] || SESSION_STATUS_COLORS.CONFIRMED
                  } border`}>
                    <i className="fas fa-check-circle mr-2"></i>
                    {SESSION_STATUS_LABELS[viewingItem.status] || viewingItem.status}
                  </span>
                )}
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  <i className="fas fa-calendar mr-2"></i>
                  {formatDate(viewingItem.date)}
                </span>
                <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  <i className="fas fa-clock mr-2"></i>
                  {viewingItem.start_time} - {viewingItem.end_time}
                </span>
                <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  <i className="fas fa-money-bill-wave mr-2"></i>
                  {viewingItem.amount} {viewingItem.currency || 'PKR'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user-md text-blue-600 mr-2"></i>
                  Doctor
                </label>
                <p className="text-lg text-gray-900 font-semibold">
                  {viewingItem.doctor_id?.first_name || 'N/A'} {viewingItem.doctor_id?.last_name || ''}
                </p>
                <p className="text-sm text-gray-600 mt-1">{viewingItem.doctor_id?.email || ''}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user text-green-600 mr-2"></i>
                  User
                </label>
                <p className="text-lg text-gray-900 font-semibold">
                  {viewingItem.user_id?.first_name || 'N/A'} {viewingItem.user_id?.last_name || ''}
                </p>
                <p className="text-sm text-gray-600 mt-1">{viewingItem.user_id?.email || ''}</p>
              </div>
            </div>

            {view === 'pending' && viewingItem.payment_screenshot_url && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-image text-yellow-600 mr-2"></i>
                  Payment Screenshot
                </label>
                <a
                  href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002'}${viewingItem.payment_screenshot_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Payment Screenshot
                </a>
              </div>
            )}

            {viewingItem.notes && (
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-sticky-note text-gray-600 mr-2"></i>
                  Notes
                </label>
                <p className="text-lg text-gray-900">{viewingItem.notes}</p>
              </div>
            )}

            {view === 'pending' && viewingItem.rejection_reason && (
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-times-circle text-red-600 mr-2"></i>
                  Rejection Reason
                </label>
                <p className="text-lg text-gray-900">{viewingItem.rejection_reason}</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => handleBreadcrumbNavigate(0)}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              <i className="fas fa-arrow-left mr-2"></i>Back to List
            </button>
            {view === 'pending' && viewingItem.status === 'PENDING_APPROVAL' && (
              <>
                <button
                  onClick={() => handleReject(viewingItem._id)}
                  className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all transform hover:scale-105"
                >
                  <i className="fas fa-times mr-2"></i>Reject
                </button>
                <button
                  onClick={() => handleApprove(viewingItem._id)}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <i className="fas fa-check mr-2"></i>Approve
                </button>
              </>
            )}
            {view === 'sessions' && viewingItem.status === 'CONFIRMED' && (
              <button
                onClick={() => {
                  setNewStatus('COMPLETED')
                  handleUpdateStatus(viewingItem._id, viewingItem.status)
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
              >
                <i className="fas fa-check-double mr-2"></i>Mark as Completed
              </button>
            )}
            {view === 'sessions' && (viewingItem.status === 'CONFIRMED' || viewingItem.status === 'COMPLETED') && (
              <button
                onClick={() => {
                  setNewStatus('CANCELLED')
                  handleUpdateStatus(viewingItem._id, viewingItem.status)
                }}
                className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all transform hover:scale-105"
              >
                <i className="fas fa-times-circle mr-2"></i>Cancel Session
              </button>
            )}
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Bookings & Sessions</h2>
          <p className="text-gray-600">Manage session requests and confirmed sessions</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setView('pending')
              setCurrentPage(1)
            }}
            className={`px-6 py-3 font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 ${
              view === 'pending'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <i className="fas fa-clock mr-2"></i>Pending Requests
          </button>
          <button
            onClick={() => {
              setView('sessions')
              setCurrentPage(1)
            }}
            className={`px-6 py-3 font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 ${
              view === 'sessions'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <i className="fas fa-calendar-check mr-2"></i>Confirmed Sessions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total {view === 'pending' ? 'Requests' : 'Sessions'}</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-list text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        {view === 'pending' ? (
          <div className="glass-card rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Approval</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingApproval}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-hourglass-half text-orange-600 text-xl"></i>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="glass-card rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Confirmed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-check-circle text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-check-double text-green-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-times-circle text-red-600 text-xl"></i>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {view === 'sessions' && (
        <div className="glass-card rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-calendar mr-2 text-gray-400"></i>Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading {view === 'pending' ? 'requests' : 'sessions'}...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
                  <tr>
                    {view === 'pending' ? (
                      <>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Request ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Session ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(view === 'pending' ? pendingRequests : sessions).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                          <p className="text-gray-500 font-medium text-lg mb-2">
                            No {view === 'pending' ? 'pending requests' : 'sessions'} found
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    (view === 'pending' ? pendingRequests : sessions).map((item) => (
                      <tr key={item._id} className="hover:bg-blue-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-600">
                            {item._id.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.doctor_id?.first_name || 'N/A'} {item.doctor_id?.last_name || ''}
                          </div>
                          <div className="text-xs text-gray-500">{item.doctor_id?.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.user_id?.first_name || 'N/A'} {item.user_id?.last_name || ''}
                          </div>
                          <div className="text-xs text-gray-500">{item.user_id?.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(item.date)}</div>
                          <div className="text-xs text-gray-500">
                            {item.start_time} - {item.end_time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {item.amount} {item.currency || 'PKR'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {view === 'pending' ? (
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${
                              STATUS_COLORS[item.status] || STATUS_COLORS.PENDING_APPROVAL
                            } border`}>
                              {STATUS_LABELS[item.status] || item.status}
                            </span>
                          ) : (
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${
                              SESSION_STATUS_COLORS[item.status] || SESSION_STATUS_COLORS.CONFIRMED
                            } border`}>
                              {SESSION_STATUS_LABELS[item.status] || item.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView(item)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110"
                              title="View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {view === 'pending' && item.status === 'PENDING_APPROVAL' && (
                              <>
                                <button
                                  onClick={() => handleReject(item._id)}
                                  disabled={actionLoading === `reject-${item._id}`}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50"
                                  title="Reject"
                                >
                                  {actionLoading === `reject-${item._id}` ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                  ) : (
                                    <i className="fas fa-times"></i>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleApprove(item._id)}
                                  disabled={actionLoading === `approve-${item._id}`}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50"
                                  title="Approve"
                                >
                                  {actionLoading === `approve-${item._id}` ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                  ) : (
                                    <i className="fas fa-check"></i>
                                  )}
                                </button>
                              </>
                            )}
                            {view === 'sessions' && item.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleUpdateStatus(item._id, item.status)}
                                disabled={actionLoading === `status-${item._id}`}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50"
                                title="Mark as Completed"
                              >
                                {actionLoading === `status-${item._id}` ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fas fa-check-double"></i>
                                )}
                              </button>
                            )}
                            {view === 'sessions' && (item.status === 'CONFIRMED' || item.status === 'COMPLETED') && (
                              <button
                                onClick={() => {
                                  setNewStatus('CANCELLED')
                                  handleUpdateStatus(item._id, item.status)
                                }}
                                disabled={actionLoading === `status-${item._id}`}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50"
                                title="Cancel Session"
                              >
                                {actionLoading === `status-${item._id}` ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fas fa-times-circle"></i>
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
          </>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Approve Session Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                rows="3"
                placeholder="Add any notes about this approval..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowApproveModal(false)
                  setApprovalNotes('')
                  setSelectedRequestId(null)
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Reject Session Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                rows="3"
                placeholder="Please provide a reason for rejection..."
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                  setSelectedRequestId(null)
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {newStatus === 'COMPLETED' ? 'Mark Session as Completed' : newStatus === 'CANCELLED' ? 'Cancel Session' : 'Update Session Status'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
              >
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>
            {newStatus === 'CANCELLED' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows="3"
                  placeholder="Please provide a reason for cancellation..."
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="3"
                placeholder="Add any notes about this session..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setStatusNotes('')
                  setCancellationReason('')
                  setSelectedSessionId(null)
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdateStatus}
                disabled={actionLoading || (newStatus === 'CANCELLED' && !cancellationReason.trim())}
                className={`flex-1 px-4 py-2 text-white font-semibold rounded-xl disabled:opacity-50 ${
                  newStatus === 'COMPLETED'
                    ? 'bg-green-600 hover:bg-green-700'
                    : newStatus === 'CANCELLED'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {actionLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                {newStatus === 'COMPLETED' ? 'Mark as Completed' : newStatus === 'CANCELLED' ? 'Cancel Session' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingTable


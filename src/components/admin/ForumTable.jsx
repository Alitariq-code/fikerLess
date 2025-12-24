import { useState, useEffect } from 'react'
import api from '../../services/api'
import Breadcrumb from '../common/Breadcrumb'
import ForumStats from './forum/ForumStats'
import ForumFilters from './forum/ForumFilters'
import ForumPostList from './forum/ForumPostList'
import ForumPostView from './forum/ForumPostView'
import ForumPostEdit from './forum/ForumPostEdit'
import ForumPostCreate from './forum/ForumPostCreate'

function ForumTable({ onBreadcrumbChange }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedPost, setSelectedPost] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list', 'view', 'edit', 'create'
  const [editingPost, setEditingPost] = useState(null)
  const [creatingPost, setCreatingPost] = useState({ title: '', description: '', category: '', is_anonymous: false })
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [stats, setStats] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const pageSize = 20

  const CATEGORIES = [
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

  const [breadcrumbItems, setBreadcrumbItems] = useState([{ label: 'Forum Management' }])

  useEffect(() => {
    if (onBreadcrumbChange) {
      onBreadcrumbChange(breadcrumbItems)
    }
  }, [breadcrumbItems, onBreadcrumbChange])

  useEffect(() => {
    fetchPosts()
    fetchStats()
  }, [currentPage, searchTerm, categoryFilter])

  useEffect(() => {
    if (selectedPost && viewMode === 'view') {
      fetchComments(selectedPost._id)
    }
  }, [selectedPost, viewMode])

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

  const fetchStats = async () => {
    try {
      const response = await api.get('/forum/admin/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchPosts = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      }

      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim()
      }
      if (categoryFilter && categoryFilter !== 'all') {
        params.category = categoryFilter
      }

      const response = await api.get('/forum/admin/posts', { params })
      if (response.data.success) {
        setPosts(response.data.data || [])
        setTotalPages(response.data.pagination?.total_pages || 1)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
      setErrorMessage('Failed to load posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (postId) => {
    setLoadingComments(true)
    try {
      const response = await api.get(`/forum/admin/posts/${postId}/comments`)
      if (response.data.success) {
        setComments(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }

  const handleViewPost = async (post) => {
    // Fetch the latest post data to get updated like status
    try {
      const response = await api.get(`/forum/admin/posts/${post._id}`)
      if (response.data.success) {
        setSelectedPost(response.data.data)
      } else {
        setSelectedPost(post)
      }
    } catch (error) {
      console.error('Error fetching post details:', error)
      setSelectedPost(post)
    }
    setViewMode('view')
    setBreadcrumbItems([{ label: 'Forum Management' }, { label: 'View Post' }])
  }

  const handleEditPost = (post) => {
    setEditingPost({ ...post })
    setViewMode('edit')
    setBreadcrumbItems([{ label: 'Forum Management' }, { label: 'Edit Post' }])
  }

  const handleSavePost = async () => {
    if (!editingPost) return

    setActionLoading('save-post')
    try {
      const response = await api.put(`/forum/admin/posts/${editingPost._id}`, {
        title: editingPost.title,
        description: editingPost.description,
        category: editingPost.category,
        is_anonymous: editingPost.is_anonymous,
      })

      if (response.data.success) {
        setSuccessMessage('Post updated successfully!')
        setViewMode('list')
        setEditingPost(null)
        setBreadcrumbItems([{ label: 'Forum Management' }])
        fetchPosts()
        fetchStats()
      }
    } catch (error) {
      console.error('Error updating post:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to update post.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeletePost = async (postId) => {
    setActionLoading(`delete-post-${postId}`)
    try {
      const response = await api.delete(`/forum/admin/posts/${postId}`)
      if (response.data.success) {
        setSuccessMessage('Post deleted successfully!')
        setDeleteConfirm(null)
        if (selectedPost?._id === postId) {
          setViewMode('list')
          setSelectedPost(null)
        }
        fetchPosts()
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to delete post.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSaveComment = async (comment) => {
    setActionLoading(`save-comment-${comment._id}`)
    try {
      const response = await api.put(`/forum/admin/comments/${comment._id}`, {
        content: comment.content,
      })

      if (response.data.success) {
        setSuccessMessage('Comment updated successfully!')
        fetchComments(selectedPost._id)
        fetchStats()
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to update comment.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteComment = async (commentId) => {
    setActionLoading(`delete-comment-${commentId}`)
    try {
      const response = await api.delete(`/forum/admin/comments/${commentId}`)
      if (response.data.success) {
        setSuccessMessage('Comment deleted successfully!')
        fetchComments(selectedPost._id)
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to delete comment.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreatePost = async () => {
    if (!creatingPost.title || !creatingPost.description || creatingPost.description.length < 10) {
      setErrorMessage('Please fill in all required fields. Description must be at least 10 characters.')
      return
    }

    setActionLoading('create-post')
    try {
      const response = await api.post('/forum/admin/posts', {
        title: creatingPost.title,
        description: creatingPost.description,
        category: creatingPost.category || undefined,
        is_anonymous: creatingPost.is_anonymous || false,
      })

      if (response.data.success) {
        setSuccessMessage('Post created successfully!')
        setViewMode('list')
        setCreatingPost({ title: '', description: '', category: '', is_anonymous: false })
        setBreadcrumbItems([{ label: 'Forum Management' }])
        fetchPosts()
        fetchStats()
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to create post.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateComment = async (content, parentCommentId = null) => {
    if (!selectedPost || !content.trim()) return

    setActionLoading('create-comment')
    try {
      const response = await api.post(`/forum/admin/posts/${selectedPost._id}/comments`, {
        content: content.trim(),
        parent_comment_id: parentCommentId || undefined,
      })

      if (response.data.success) {
        setSuccessMessage(parentCommentId ? 'Reply posted successfully!' : 'Comment posted successfully!')
        fetchComments(selectedPost._id)
        fetchStats()
      }
    } catch (error) {
      console.error('Error creating comment:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to create comment.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleLike = async (postId) => {
    setActionLoading(`like-post-${postId}`)
    try {
      const response = await api.post(`/forum/admin/posts/${postId}/like`)

      if (response.data.success) {
        // Update the post in the list
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, is_liked: response.data.is_liked, likes_count: response.data.likes_count }
              : post
          )
        )
        
        // Update selected post if it's the one being liked
        if (selectedPost && selectedPost._id === postId) {
          setSelectedPost(prev => ({
            ...prev,
            is_liked: response.data.is_liked,
            likes_count: response.data.likes_count
          }))
        }
        
        fetchStats()
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to toggle like.')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleBreadcrumbNavigate = (index) => {
    if (index === 0) {
      setViewMode('list')
      setSelectedPost(null)
      setEditingPost(null)
      setCreatingPost({ title: '', description: '', category: '', is_anonymous: false })
      setBreadcrumbItems([{ label: 'Forum Management' }])
    }
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setCurrentPage(1)
  }

  // View Mode: Create Post
  if (viewMode === 'create') {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        
        {successMessage && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800 px-5 py-4 rounded-lg flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-check-circle text-white"></i>
              </div>
              <span className="font-semibold">{successMessage}</span>
            </div>
            <button 
              onClick={() => setSuccessMessage('')} 
              className="text-green-700 hover:text-green-900 hover:bg-green-100 rounded-full p-1 transition-colors"
              title="Dismiss"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded-lg flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-exclamation-circle text-white"></i>
              </div>
              <span className="font-semibold">{errorMessage}</span>
            </div>
            <button 
              onClick={() => setErrorMessage('')} 
              className="text-red-700 hover:text-red-900 hover:bg-red-100 rounded-full p-1 transition-colors"
              title="Dismiss"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <ForumPostCreate
          post={creatingPost}
          categories={CATEGORIES}
          onSave={handleCreatePost}
          onCancel={() => {
            setViewMode('list')
            setCreatingPost({ title: '', description: '', category: '', is_anonymous: false })
            setBreadcrumbItems([{ label: 'Forum Management' }])
          }}
          actionLoading={actionLoading}
          onChange={setCreatingPost}
        />
      </div>
    )
  }

  // View Mode: View Post
  if (viewMode === 'view' && selectedPost) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        
        {successMessage && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800 px-5 py-4 rounded-lg flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-check-circle text-white"></i>
              </div>
              <span className="font-semibold">{successMessage}</span>
            </div>
            <button 
              onClick={() => setSuccessMessage('')} 
              className="text-green-700 hover:text-green-900 hover:bg-green-100 rounded-full p-1 transition-colors"
              title="Dismiss"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded-lg flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-exclamation-circle text-white"></i>
              </div>
              <span className="font-semibold">{errorMessage}</span>
            </div>
            <button 
              onClick={() => setErrorMessage('')} 
              className="text-red-700 hover:text-red-900 hover:bg-red-100 rounded-full p-1 transition-colors"
              title="Dismiss"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <ForumPostView
          post={selectedPost}
          comments={comments}
          loadingComments={loadingComments}
          onEdit={() => handleEditPost(selectedPost)}
          onDelete={() => setDeleteConfirm(selectedPost._id)}
          onToggleLike={() => handleToggleLike(selectedPost._id)}
          onBack={() => {
            setViewMode('list')
            setSelectedPost(null)
            setBreadcrumbItems([{ label: 'Forum Management' }])
          }}
          onEditComment={() => {}}
          onSaveComment={handleSaveComment}
          onDeleteComment={handleDeleteComment}
          onCreateComment={handleCreateComment}
          actionLoading={actionLoading}
          formatDate={formatDate}
        />
      </div>
    )
  }

  // View Mode: Edit Post
  if (viewMode === 'edit' && editingPost) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        
        {successMessage && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800 px-5 py-4 rounded-lg flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-check-circle text-white"></i>
              </div>
              <span className="font-semibold">{successMessage}</span>
            </div>
            <button 
              onClick={() => setSuccessMessage('')} 
              className="text-green-700 hover:text-green-900 hover:bg-green-100 rounded-full p-1 transition-colors"
              title="Dismiss"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded-lg flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-exclamation-circle text-white"></i>
              </div>
              <span className="font-semibold">{errorMessage}</span>
            </div>
            <button 
              onClick={() => setErrorMessage('')} 
              className="text-red-700 hover:text-red-900 hover:bg-red-100 rounded-full p-1 transition-colors"
              title="Dismiss"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <ForumPostEdit
          post={editingPost}
          categories={CATEGORIES}
          onSave={handleSavePost}
          onCancel={() => {
            setViewMode('list')
            setEditingPost(null)
            setBreadcrumbItems([{ label: 'Forum Management' }])
          }}
          actionLoading={actionLoading}
          onChange={setEditingPost}
        />
      </div>
    )
  }

  // View Mode: List Posts
  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />

      {/* Stats */}
      <ForumStats stats={stats} />

      {/* Messages */}
      {successMessage && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800 px-5 py-4 rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-check-circle text-white"></i>
            </div>
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button 
            onClick={() => setSuccessMessage('')} 
            className="text-green-700 hover:text-green-900 hover:bg-green-100 rounded-full p-1 transition-colors"
            title="Dismiss"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-exclamation-circle text-white"></i>
            </div>
            <span className="font-semibold">{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage('')} 
            className="text-red-700 hover:text-red-900 hover:bg-red-100 rounded-full p-1 transition-colors"
            title="Dismiss"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Create Post Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setViewMode('create')
            setBreadcrumbItems([{ label: 'Forum Management' }, { label: 'Create Post' }])
          }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center group"
        >
          <i className="fas fa-plus mr-2 group-hover:scale-110 transition-transform"></i>Create New Post
        </button>
      </div>

      {/* Filters */}
      <ForumFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        categories={CATEGORIES}
        onSearchChange={setSearchTerm}
        onCategoryChange={(cat) => {
          setCategoryFilter(cat)
          setCurrentPage(1)
        }}
        onReset={handleResetFilters}
      />

      {/* Posts List */}
      <ForumPostList
        posts={posts}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewPost={handleViewPost}
        onEditPost={handleEditPost}
        onDeletePost={(postId) => setDeleteConfirm(postId)}
        onToggleLike={handleToggleLike}
        actionLoading={actionLoading}
        formatDate={formatDate}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirm Delete</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this post? This action cannot be undone and will also delete all associated comments.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDeletePost(deleteConfirm)}
                disabled={actionLoading?.startsWith('delete-post')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50"
              >
                {actionLoading?.startsWith('delete-post') ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash mr-2"></i>Delete
                  </>
                )}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForumTable

import ForumPostCard from './ForumPostCard'

function ForumPostList({ 
  posts, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange,
  onViewPost,
  onEditPost,
  onDeletePost,
  onToggleLike,
  actionLoading,
  formatDate 
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-16 border border-gray-100">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-semibold text-lg">Loading posts...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the latest posts</p>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-16 border border-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-inbox text-4xl text-gray-300"></i>
          </div>
          <p className="text-gray-700 text-xl font-bold mb-2">No posts found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search criteria or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map((post) => (
          <ForumPostCard
            key={post._id}
            post={post}
            onView={() => onViewPost(post)}
            onEdit={() => onEditPost(post)}
            onDelete={() => onDeletePost(post._id)}
            onToggleLike={() => onToggleLike(post._id)}
            actionLoading={actionLoading}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-gray-600">
              Showing page <span className="font-bold text-gray-900">{currentPage}</span> of{' '}
              <span className="font-bold text-gray-900">{totalPages}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md disabled:hover:shadow-sm"
              >
                <i className="fas fa-chevron-left mr-2"></i>Previous
              </button>
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md disabled:hover:shadow-sm"
              >
                Next<i className="fas fa-chevron-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForumPostList

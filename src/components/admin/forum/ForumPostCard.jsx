function ForumPostCard({ post, onView, onEdit, onDelete, onToggleLike, actionLoading, formatDate }) {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <h3
              className="text-lg font-bold text-gray-900 mb-3 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2 group-hover:underline"
              onClick={onView}
            >
              {post.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
              {post.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {post.user && (
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {post.user.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <span className="text-gray-700 font-medium text-xs">
                      {post.user.first_name} {post.user.last_name}
                    </span>
                    {post.user.username && (
                      <span className="text-gray-500 text-xs font-normal">(@{post.user.username})</span>
                    )}
                  </div>
                  {post.admin_post && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs font-bold flex items-center shadow-sm">
                      <i className="fas fa-check-circle mr-1 text-xs"></i>Admin
                    </span>
                  )}
                </div>
              )}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <i className="far fa-calendar text-gray-500 text-xs"></i>
                <span className="text-gray-700 text-xs">{formatDate(post.created_at)}</span>
              </div>
              {post.category && (
                <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-lg font-semibold text-xs border border-blue-200">
                  <i className="fas fa-tag mr-1.5 text-xs"></i>
                  {post.category}
                </span>
              )}
              {post.is_anonymous && (
                <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-xs border border-gray-200">
                  <i className="fas fa-user-secret mr-1.5 text-xs"></i>
                  Anonymous
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-5 text-sm">
            <button
              onClick={onToggleLike}
              disabled={actionLoading === `like-post-${post._id}`}
              className={`flex items-center space-x-2 transition-all duration-200 rounded-lg px-2 py-1.5 ${
                post.is_liked
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-600 hover:bg-gray-50'
              } disabled:opacity-50`}
              title={post.is_liked ? 'Unlike this post' : 'Like this post'}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                post.is_liked ? 'bg-red-100' : 'bg-gray-50'
              }`}>
                {actionLoading === `like-post-${post._id}` ? (
                  <i className="fas fa-spinner fa-spin text-xs"></i>
                ) : (
                  <i className={`fas fa-heart text-xs ${post.is_liked ? 'text-red-500' : 'text-gray-500'}`}></i>
                )}
              </div>
              <span className={`font-semibold ${post.is_liked ? 'text-red-600' : 'text-gray-800'}`}>
                {post.likes_count || 0}
              </span>
            </button>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <i className="fas fa-comments text-blue-500 text-xs"></i>
              </div>
              <span className="font-semibold text-gray-800">{post.comments_count || 0}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                <i className="fas fa-eye text-purple-500 text-xs"></i>
              </div>
              <span className="font-semibold text-gray-800">{post.views || 0}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onView}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium text-xs shadow-sm hover:shadow-md group/btn"
              title="View post"
            >
              <i className="fas fa-eye mr-1.5 group-hover/btn:scale-110 transition-transform"></i>View
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-all duration-200 font-medium text-xs shadow-sm hover:shadow-md group/btn"
              title="Edit post"
            >
              <i className="fas fa-edit mr-1.5 group-hover/btn:scale-110 transition-transform"></i>Edit
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium text-xs shadow-sm hover:shadow-md group/btn"
              title="Delete post"
            >
              <i className="fas fa-trash mr-1.5 group-hover/btn:scale-110 transition-transform"></i>Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumPostCard

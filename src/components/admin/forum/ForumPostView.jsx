import ForumComments from './ForumComments'

function ForumPostView({ 
  post, 
  comments, 
  loadingComments,
  onEdit, 
  onDelete,
  onToggleLike,
  onBack,
  onEditComment,
  onSaveComment,
  onDeleteComment,
  onCreateComment,
  actionLoading,
  formatDate 
}) {
  return (
    <div className="space-y-6">
      {/* Post Header */}
      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 overflow-hidden relative">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="mt-2">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4 flex-wrap gap-2">
                {post.category && (
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-sm shadow-md">
                    <i className="fas fa-tag mr-2"></i>
                    {post.category}
                  </span>
                )}
                {post.is_anonymous && (
                  <span className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium text-sm border border-gray-300">
                    <i className="fas fa-user-secret mr-2"></i>Anonymous
                  </span>
                )}
                {post.admin_post && (
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-md">
                    <i className="fas fa-check-circle mr-2"></i>Verified Admin Post
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                {post.user && (
                  <div className="flex items-center space-x-3 px-4 py-2.5 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {post.user.first_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <p className="font-semibold text-gray-800">
                          {post.user.first_name} {post.user.last_name}
                        </p>
                        {post.user.username && (
                          <span className="text-gray-600 font-medium text-sm">@{post.user.username}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{post.user.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2 px-4 py-2.5 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                  <i className="far fa-calendar text-blue-600"></i>
                  <span className="text-gray-700 font-medium">{formatDate(post.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 mb-6 border border-gray-200">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
              {post.description}
            </p>
          </div>

          {/* Post Stats */}
          <div className="flex items-center space-x-8 pt-6 border-t border-gray-200">
            <button
              onClick={onToggleLike}
              disabled={actionLoading === `like-post-${post._id}`}
              className={`flex items-center space-x-3 transition-all duration-200 rounded-lg px-4 py-2 ${
                post.is_liked
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-700 hover:bg-gray-50'
              } disabled:opacity-50 group`}
              title={post.is_liked ? 'Unlike this post' : 'Like this post'}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                post.is_liked ? 'bg-red-100 group-hover:bg-red-200' : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
                {actionLoading === `like-post-${post._id}` ? (
                  <i className="fas fa-spinner fa-spin text-red-600"></i>
                ) : (
                  <i className={`fas fa-heart ${post.is_liked ? 'text-red-600' : 'text-gray-600'}`}></i>
                )}
              </div>
              <div>
                <p className={`font-bold text-xl ${post.is_liked ? 'text-red-600' : 'text-gray-900'}`}>
                  {post.likes_count || 0}
                </p>
                <p className="text-xs text-gray-500 font-medium">Likes</p>
              </div>
            </button>
            <div className="flex items-center space-x-3 text-gray-700 group">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <i className="fas fa-comments text-blue-600"></i>
              </div>
              <div>
                <p className="font-bold text-xl text-gray-900">{post.comments_count || 0}</p>
                <p className="text-xs text-gray-500 font-medium">Comments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 group">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <i className="fas fa-eye text-purple-600"></i>
              </div>
              <div>
                <p className="font-bold text-xl text-gray-900">{post.views || 0}</p>
                <p className="text-xs text-gray-500 font-medium">Views</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onEdit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <i className="fas fa-edit mr-2"></i>Edit Post
            </button>
            <button
              onClick={onDelete}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <i className="fas fa-trash mr-2"></i>Delete Post
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
            >
              <i className="fas fa-arrow-left mr-2"></i>Back
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <ForumComments
        comments={comments}
        loading={loadingComments}
        onEditComment={onEditComment}
        onSaveComment={onSaveComment}
        onDeleteComment={onDeleteComment}
        onCreateComment={onCreateComment}
        actionLoading={actionLoading}
        formatDate={formatDate}
      />
    </div>
  )
}

export default ForumPostView

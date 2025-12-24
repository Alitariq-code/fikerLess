function ForumPostEdit({ 
  post, 
  categories, 
  onSave, 
  onCancel, 
  actionLoading,
  onChange 
}) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 overflow-hidden relative">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="mt-2">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-edit text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Edit Post</h2>
              <p className="text-gray-600 mt-1">Update the post details below</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-heading mr-2 text-blue-600"></i>Title
            </label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => onChange({ ...post, title: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg bg-white hover:border-gray-300"
              placeholder="Enter post title..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-align-left mr-2 text-blue-600"></i>Description
            </label>
            <textarea
              value={post.description}
              onChange={(e) => onChange({ ...post, description: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-white hover:border-gray-300"
              rows="10"
              placeholder="Enter post description..."
            />
            <p className="mt-2 text-sm text-gray-500">
              <i className="fas fa-info-circle mr-1"></i>
              {post.description?.length || 0} characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-tag mr-2 text-blue-600"></i>Category
              </label>
              <div className="relative">
                <select
                  value={post.category || ''}
                  onChange={(e) => onChange({ ...post, category: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-gray-300 pr-10"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="mt-8">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={post.is_anonymous || false}
                    onChange={(e) => onChange({ ...post, is_anonymous: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                    <i className="fas fa-user-secret mr-2 text-gray-500"></i>
                    Anonymous Post
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onSave}
              disabled={actionLoading === 'save-post'}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {actionLoading === 'save-post' ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>Save Changes
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
            >
              <i className="fas fa-times mr-2"></i>Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumPostEdit

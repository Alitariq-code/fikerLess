function ForumFilters({ searchTerm, categoryFilter, categories, onSearchChange, onCategoryChange, onReset }) {
  const hasActiveFilters = searchTerm || categoryFilter !== 'all'

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-filter text-white"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-800">Filter & Search</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-search mr-2 text-blue-600"></i>Search Posts
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <i className="fas fa-times-circle"></i>
              </button>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-tag mr-2 text-blue-600"></i>Category
          </label>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-gray-300 pr-10"
            >
              <option value="all">All Categories</option>
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
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-5 pt-5 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                  <i className="fas fa-search mr-2 text-xs"></i>
                  "{searchTerm}"
                  <button
                    onClick={() => onSearchChange('')}
                    className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Remove search filter"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-800 rounded-full text-sm font-medium border border-green-200">
                  <i className="fas fa-tag mr-2 text-xs"></i>
                  {categoryFilter}
                  <button
                    onClick={() => onCategoryChange('all')}
                    className="ml-2 text-green-600 hover:text-green-800 transition-colors"
                    title="Remove category filter"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={onReset}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
            >
              <i className="fas fa-redo mr-2"></i>Reset All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForumFilters

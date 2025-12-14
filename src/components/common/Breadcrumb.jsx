function Breadcrumb({ items = [], onNavigate }) {
  if (!items || items.length === 0) {
    return null
  }

  const handleClick = (item, index) => {
    if (item.onClick) {
      item.onClick()
    } else if (onNavigate && index < items.length - 1) {
      onNavigate(index)
    }
  }

  const getIcon = (index, isLast) => {
    if (index === 0) return 'fa-home'
    if (isLast) return 'fa-map-marker-alt'
    return 'fa-folder'
  }

  return (
    <nav className="mb-8 animate-fade-in" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isClickable = !isLast && (item.onClick || onNavigate)
          const icon = getIcon(index, isLast)
          
          return (
            <li key={index} className="flex items-center group">
              {index > 0 && (
                <div className="mx-2.5 flex items-center">
                  <svg 
                    className="w-4 h-4 text-gray-600 group-hover:text-gray-700 transition-colors duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </div>
              )}
              
              {isLast ? (
                <div className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30 transform transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2.5 animate-pulse shadow-lg"></div>
                    <i className={`fas ${icon} mr-2 text-white/90`}></i>
                    <span className="relative">{item.label}</span>
                  </div>
                </div>
              ) : isClickable ? (
                <button
                  onClick={() => handleClick(item, index)}
                  className="flex items-center px-5 py-3 bg-white text-gray-700 rounded-xl font-medium text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-300 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transform hover:scale-105 group/item relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <i className={`fas ${icon} mr-2.5 text-gray-400 group-hover/item:text-blue-500 transition-colors duration-300`}></i>
                    <span className="relative">{item.label}</span>
                  </div>
                </button>
              ) : (
                <span className="flex items-center px-5 py-3 bg-gray-50 text-gray-500 rounded-xl font-medium text-sm border border-gray-200">
                  <i className={`fas ${icon} mr-2.5 text-gray-400`}></i>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb


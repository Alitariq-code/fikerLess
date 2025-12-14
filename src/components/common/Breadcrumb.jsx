function Breadcrumb({ items = [], onNavigate }) {
  if (!items || items.length === 0) {
    return null
  }

  const handleClick = (item, index) => {
    if (item.onClick) {
      item.onClick()
    } else if (onNavigate && index < items.length - 1) {
      // Navigate to the clicked breadcrumb level
      onNavigate(index)
    }
  }

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isClickable = !isLast && (item.onClick || onNavigate)
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <i className="fas fa-chevron-right text-gray-300 mx-3 text-xs"></i>
              )}
              {isLast ? (
                <span className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm shadow-lg">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {item.label}
                </span>
              ) : isClickable ? (
                <button
                  onClick={() => handleClick(item, index)}
                  className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm border border-blue-100 cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <span className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm">
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


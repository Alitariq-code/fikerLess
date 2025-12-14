import { Link } from 'react-router-dom'

function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <i className="fas fa-chevron-right text-gray-400 mx-2 text-xs"></i>
              )}
              {isLast ? (
                <span className="text-gray-700 font-medium">{item.label}</span>
              ) : item.to ? (
                <Link
                  to={item.to}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-500">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb


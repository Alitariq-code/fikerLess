import { useState, useMemo, useEffect } from 'react'

function DataTable({
  data = [],
  columns = [],
  onView,
  onEdit,
  onDelete,
  onPageChange,
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  loading = false,
  emptyMessage = 'No data available',
  showActions = true,
  actionsLabel = 'Actions',
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [localPage, setLocalPage] = useState(currentPage)

  // Sync localPage with currentPage prop
  useEffect(() => {
    setLocalPage(currentPage)
  }, [currentPage])

  // Reset to page 1 when data changes significantly
  useEffect(() => {
    if (localPage > 1 && data.length === 0) {
      setLocalPage(1)
    }
  }, [data.length, localPage])

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    // Reset to page 1 when sorting changes
    setLocalPage(1)
    if (onPageChange) {
      onPageChange(1)
    }
  }

  // Sort data locally (client-side sorting)
  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return data
    }

    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Handle nested values (e.g., for arrays or objects)
      if (Array.isArray(aValue)) {
        aValue = aValue.length
      }
      if (Array.isArray(bValue)) {
        bValue = bValue.length
      }

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      // Handle boolean values
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortConfig.direction === 'asc'
          ? (aValue === bValue ? 0 : aValue ? 1 : -1)
          : (aValue === bValue ? 0 : aValue ? -1 : 1)
      }

      // Handle string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' })
          : bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' })
      }

      // Handle numeric values
      const aNum = Number(aValue)
      const bNum = Number(bValue)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum
      }

      // Fallback to string comparison
      const aStr = String(aValue)
      const bStr = String(bValue)
      return sortConfig.direction === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr)
    })

    return sorted
  }, [data, sortConfig])

  // Calculate pagination - use local data length for client-side pagination
  const displayData = sortedData
  const totalPages = Math.ceil(displayData.length / pageSize)
  const startItem = (localPage - 1) * pageSize
  const endItem = Math.min(localPage * pageSize, displayData.length)
  const paginatedData = displayData.slice(startItem, endItem)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setLocalPage(newPage)
      if (onPageChange) {
        onPageChange(newPage)
      }
    }
  }

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <i className="fas fa-sort text-gray-400"></i>
    }
    return sortConfig.direction === 'asc' ? (
      <i className="fas fa-sort-up text-blue-600"></i>
    ) : (
      <i className="fas fa-sort-down text-blue-600"></i>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-200' : ''
                  } transition-colors`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {actionsLabel}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <i className="fas fa-inbox text-4xl text-gray-300 mb-3 block"></i>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || row._id || rowIndex}
                  className="hover:bg-blue-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? (
                        column.render(row[column.key], row)
                      ) : (
                        <div className="text-sm text-gray-900">{row[column.key] || '-'}</div>
                      )}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem + 1}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{displayData.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(localPage - 1)}
              disabled={localPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fas fa-chevron-left mr-1"></i> Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (localPage <= 3) {
                  pageNum = i + 1
                } else if (localPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = localPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      localPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => handlePageChange(localPage + 1)}
              disabled={localPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable


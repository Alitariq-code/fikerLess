import { useState, useRef, useEffect } from 'react'

function DateRangePicker({ 
  onDateChange, 
  defaultStartDate, 
  defaultEndDate,
  label = 'Date Range',
  showLabel = true,
  size = 'md',
  position = 'bottom'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState(defaultStartDate || getDefaultStartDate())
  const [endDate, setEndDate] = useState(defaultEndDate || new Date().toISOString().split('T')[0])
  const [preset, setPreset] = useState('custom')
  const pickerRef = useRef(null)

  function getDefaultStartDate() {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString().split('T')[0]
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const presets = [
    { label: 'Last 7 Days', value: '7d', days: 7 },
    { label: 'Last 30 Days', value: '30d', days: 30 },
    { label: 'Last 90 Days', value: '90d', days: 90 },
    { label: 'This Month', value: 'month', days: null },
    { label: 'Last Month', value: 'lastMonth', days: null },
    { label: 'This Year', value: 'year', days: null },
    { label: 'Custom', value: 'custom', days: null },
  ]

  const handlePresetClick = (presetValue) => {
    setPreset(presetValue)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const end = today.toISOString().split('T')[0]

    let start = new Date()

    if (presetValue === '7d' || presetValue === '30d' || presetValue === '90d') {
      const days = presets.find(p => p.value === presetValue)?.days || 7
      start.setDate(start.getDate() - days)
      start.setHours(0, 0, 0, 0)
    } else if (presetValue === 'month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1)
    } else if (presetValue === 'lastMonth') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 0)
      today.setTime(lastDay.getTime())
    } else if (presetValue === 'year') {
      start = new Date(today.getFullYear(), 0, 1)
    } else {
      return // Custom - don't change dates
    }

    const startStr = start.toISOString().split('T')[0]
    setStartDate(startStr)
    setEndDate(end)
    
    if (presetValue !== 'custom') {
      onDateChange(startStr, end)
    }
  }

  const handleApply = () => {
    setIsOpen(false)
    onDateChange(startDate, endDate)
  }

  const handleReset = () => {
    const defaultStart = getDefaultStartDate()
    const defaultEnd = new Date().toISOString().split('T')[0]
    setStartDate(defaultStart)
    setEndDate(defaultEnd)
    setPreset('7d')
    onDateChange(defaultStart, defaultEnd)
    setIsOpen(false)
  }

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'Select Date Range'
    const start = new Date(startDate)
    const end = new Date(endDate)
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${startStr} - ${endStr}`
  }

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2.5',
  }

  return (
    <div className="relative" ref={pickerRef}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${sizeClasses[size]}
          w-full bg-white border-2 border-gray-300 rounded-lg
          shadow-sm hover:shadow-md transition-all duration-200
          flex items-center justify-between
          hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          font-medium text-gray-700
        `}
      >
        <div className="flex items-center">
          <i className="fas fa-calendar-alt text-blue-600 mr-2"></i>
          <span>{formatDateRange()}</span>
        </div>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-gray-400 ml-2 transition-transform`}></i>
      </button>

      {isOpen && (
        <div className={`
          absolute z-50 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200
          ${position === 'top' ? 'bottom-full mb-2' : 'top-full'}
          animate-fade-in
        `}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-xl">
            <div className="flex items-center justify-between text-white">
              <h3 className="font-bold text-lg">Select Date Range</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="p-4 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Select</p>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((presetOption) => (
                <button
                  key={presetOption.value}
                  onClick={() => handlePresetClick(presetOption.value)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${preset === presetOption.value
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {presetOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Inputs */}
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  <i className="fas fa-calendar-plus text-blue-600 mr-1"></i>
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    setPreset('custom')
                  }}
                  max={endDate}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  <i className="fas fa-calendar-check text-purple-600 mr-1"></i>
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    setPreset('custom')
                  }}
                  min={startDate}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                  rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-redo mr-2"></i>
                Reset
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600
                  rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg
                  transition-all duration-200 flex items-center"
              >
                <i className="fas fa-check mr-2"></i>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker


import { useEffect } from 'react'

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type]

  const icon = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
  }[type]

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 min-w-[300px] max-w-md`}>
        <i className={`fas ${icon} text-xl`}></i>
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

export default Toast


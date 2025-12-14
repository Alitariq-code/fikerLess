import { useState, useEffect } from 'react'

function LoadingScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Hide loader after page loads
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div id="pageLoader" className={`page-loader ${!loading ? 'hidden' : ''}`}>
      <div className="loader-content">
        <div className="loader-logo">
          <img src="/images/logo.png" alt="FikrLess Logo" className="w-full h-full object-contain" />
        </div>
        <div className="loader-text">FIKRLESS</div>
        <div className="loader-subtitle">Let Your Mind Breathe</div>
      </div>
    </div>
  )
}

export default LoadingScreen


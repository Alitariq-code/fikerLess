import { useEffect, useState, useRef } from 'react'

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const trailRef = useRef([])
  const requestRef = useRef()

  useEffect(() => {
    // Only show on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) {
      setIsVisible(false)
      return
    }

    setIsVisible(true)
    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0

    const updateCursor = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      // More responsive cursor following - behaves like real cursor
      cursorX += (mouseX - cursorX) * 0.5
      cursorY += (mouseY - cursorY) * 0.5

      setPosition({ x: cursorX, y: cursorY })

      // Add to trail every few frames
      if (trailRef.current.length === 0 || 
          Math.abs(trailRef.current[trailRef.current.length - 1].x - cursorX) > 8 ||
          Math.abs(trailRef.current[trailRef.current.length - 1].y - cursorY) > 8) {
        trailRef.current.push({
          x: cursorX,
          y: cursorY,
          id: Date.now() + Math.random(),
        })
        
        // Keep only last 10 trail elements
        if (trailRef.current.length > 10) {
          trailRef.current.shift()
        }
        
        setTrail([...trailRef.current])
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', updateCursor)
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', updateCursor)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Remove old trail elements
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      trailRef.current = trailRef.current.filter((item) => {
        const itemTime = parseInt(item.id.toString().split('.')[0])
        return now - itemTime < 600
      })
      setTrail([...trailRef.current])
    }, 100)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <>
      {/* Main Cursor Heart */}
      <div
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#cursorGradient)" />
          <defs>
            <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Trail Hearts */}
      {trail.map((point, index) => {
        const gradientId = `trailGradient-${point.id.toString().replace('.', '-')}`
        return (
          <div
            key={point.id}
            className="cursor-trail"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              opacity: (index + 1) / trail.length * 0.6,
              transform: `translate(-50%, -50%) scale(${0.2 + (index / trail.length) * 0.7})`,
              animationDelay: `${index * 20}ms`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={`url(#${gradientId})`} />
            </svg>
          </div>
        )
      })}
    </>
  )
}

export default CustomCursor


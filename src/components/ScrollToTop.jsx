import { useState, useEffect } from 'react'

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top-button ${
        isVisible ? 'show' : 'hide'
      }`}
      aria-label="Scroll to top"
    >
      <div className="scroll-to-top-icon">
        <i className="fas fa-arrow-up"></i>
      </div>
      <div className="scroll-to-top-ripple"></div>
      <div className="scroll-to-top-glow"></div>
    </button>
  )
}

export default ScrollToTop


import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollTo = (sectionId) => {
    setMobileMenuOpen(false)
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } })
    } else {
      // We're on home page, scroll immediately
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          const offsetTop = element.offsetTop - 80
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          })
        }
      }, 50)
    }
  }

  // Handle scroll after navigation
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const sectionId = location.state.scrollTo
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          const offsetTop = element.offsetTop - 80
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          })
        }
        // Clear the state
        window.history.replaceState({}, document.title)
      }, 300)
    }
  }, [location])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 shadow-xl' : 'bg-white/90'
    } backdrop-blur-md border-b border-blue-100 shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <img src="/images/logo.png" alt="FikrLess" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              FikrLess
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleScrollTo('home')} className="nav-link text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
              Home
            </button>
            <button onClick={() => handleScrollTo('about')} className="nav-link text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
              About
            </button>
            <button onClick={() => handleScrollTo('founders')} className="nav-link text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
              Founders
            </button>
            <button onClick={() => handleScrollTo('services')} className="nav-link text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
              Services
            </button>
            <button onClick={() => handleScrollTo('internships')} className="nav-link text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
              Internships
            </button>
            <button onClick={() => handleScrollTo('faq')} className="nav-link text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
              FAQ
            </button>
            <button onClick={() => handleScrollTo('contact')} className="nav-link text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
              Contact
            </button>
            <Link 
              to="/privacy-policy"
              className="nav-link text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button 
              onClick={() => handleScrollTo('contact')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started ✨
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-2xl mt-2 p-4 shadow-xl border border-blue-100">
            <div className="flex flex-col space-y-3">
              <button onClick={() => handleScrollTo('home')} className="text-gray-600 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-left">
                🏠 Home
              </button>
              <button onClick={() => handleScrollTo('about')} className="text-gray-600 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-left">
                ℹ️ About
              </button>
              <button onClick={() => handleScrollTo('founders')} className="text-gray-600 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-left">
                👥 Founders
              </button>
              <button onClick={() => handleScrollTo('services')} className="text-gray-600 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-left">
                🛠️ Services
              </button>
              <button onClick={() => handleScrollTo('internships')} className="text-gray-600 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-left">
                🎓 Internships
              </button>
              <button onClick={() => handleScrollTo('faq')} className="text-gray-600 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-left">
                ❓ FAQ
              </button>
              <button onClick={() => handleScrollTo('contact')} className="text-gray-600 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-left">
                📞 Contact
              </button>
              <Link 
                to="/privacy-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-left"
              >
                🔒 Privacy Policy
              </Link>
              <div className="pt-2 border-t border-blue-100">
                <button 
                  onClick={() => handleScrollTo('contact')}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started ✨
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation


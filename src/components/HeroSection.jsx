import { useState } from 'react'

function HeroSection({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  const handleQuickSearch = (term) => {
    setSearchTerm(term)
    if (onSearch) {
      onSearch(term)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <header className="relative z-10 overflow-hidden pt-20" id="home">
      {/* Background Image with Professional Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full overflow-hidden">
          <img 
            src="/images/header.jpg" 
            alt="Medical Healthcare Background" 
            className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-[10s] ease-out"
            style={{ filter: 'brightness(0.75) contrast(1.15) saturate(1.1)' }}
          />
          
          {/* Soft, Calming Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400/80 via-cyan-400/75 to-teal-500/80"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Heart Emojis */}
            <div className="hero-heart hero-heart-1">❤️</div>
            <div className="hero-heart hero-heart-2">💙</div>
            <div className="hero-heart hero-heart-3">💚</div>
            <div className="hero-heart hero-heart-4">🧡</div>
            <div className="hero-heart hero-heart-5">💜</div>
            <div className="hero-heart hero-heart-6">🤍</div>
            <div className="hero-heart hero-heart-7">💛</div>
            <div className="hero-heart hero-heart-8">💗</div>
            <div className="hero-heart hero-heart-9">💕</div>
            <div className="hero-heart hero-heart-10">💖</div>
            
            {/* Floating Geometric Shapes */}
            <div className="hero-shape hero-shape-1"></div>
            <div className="hero-shape hero-shape-2"></div>
            <div className="hero-shape hero-shape-3"></div>
            
            {/* Animated Waves */}
            <div className="hero-wave hero-wave-1"></div>
            <div className="hero-wave hero-wave-2"></div>
            <div className="hero-wave hero-wave-3"></div>
            
            {/* Floating Particles */}
            <div className="hero-particle hero-particle-1"></div>
            <div className="hero-particle hero-particle-2"></div>
            <div className="hero-particle hero-particle-3"></div>
            <div className="hero-particle hero-particle-4"></div>
            <div className="hero-particle hero-particle-5"></div>
            <div className="hero-particle hero-particle-6"></div>
            <div className="hero-particle hero-particle-7"></div>
            <div className="hero-particle hero-particle-8"></div>
          </div>
          
          {/* Gentle shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50 hero-shimmer"></div>
          
          {/* Floating Light Rays */}
          <div className="hero-light-ray hero-light-ray-1"></div>
          <div className="hero-light-ray hero-light-ray-2"></div>
          <div className="hero-light-ray hero-light-ray-3"></div>
          
          {/* Breathing Circles */}
          <div className="hero-breath-circle hero-breath-circle-1"></div>
          <div className="hero-breath-circle hero-breath-circle-2"></div>
          <div className="hero-breath-circle hero-breath-circle-3"></div>
          
          {/* Subtle Pattern Overlay for Texture */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full" 
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}
            ></div>
          </div>
          
          {/* Bottom Fade for Content Transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
          
          {/* Subtle Vignette Effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>
        </div>
      </div>
      
      {/* Header Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 lg:py-16 header-content">
        <div className="max-w-7xl mx-auto">
          {/* Brand Section - Centered */}
          <div className="text-center mb-8 lg:mb-12 animate-slide-up">
            <div className="flex flex-col items-center space-y-4 lg:space-y-6">
              <div className="relative group logo-container">
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl group-hover:bg-white/30 transition-all duration-700"></div>
                <div className="relative bg-white/95 backdrop-blur-sm p-4 lg:p-6 rounded-3xl shadow-2xl border border-white/50 hover:border-white/70 transition-all duration-500">
                  <img 
                    src="/images/logo.png" 
                    alt="FikrLess Logo" 
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain drop-shadow-xl hover:scale-110 transition-all duration-500 hero-logo-breathe"
                  />
                </div>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white bg-[length:200%_auto] animate-gradient-text drop-shadow-2xl">
                  FIKRLESS
                </h1>
                <p className="text-white/95 text-sm sm:text-base lg:text-xl xl:text-2xl font-medium tracking-wide drop-shadow-lg">
                  Making mental-health care accessible, comfortable, and stigma-free
                </p>
                <div className="flex justify-center">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/80 to-transparent w-48 sm:w-64 lg:w-80"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search Section */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-lg group-hover:bg-white/30 transition-all duration-500"></div>
                <div className="relative flex flex-col sm:flex-row items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
                  <div className="flex-1 flex items-center p-4 lg:p-6">
                    <i className="fas fa-search text-gray-500 mr-4 text-lg"></i>
                    <input 
                      id="searchInput"
                      type="text" 
                      placeholder="Search internships, mentors, or specializations..." 
                      className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 text-base lg:text-lg focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <button 
                    id="searchButton" 
                    className="w-full sm:w-auto px-8 py-4 lg:py-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-base lg:text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden group/btn"
                    onClick={handleSearch}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></span>
                    <span className="relative z-10">
                      <i className="fas fa-search mr-2"></i>
                      Search
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Quick Search Tags */}
              <div className="flex flex-wrap justify-center gap-2 lg:gap-3 mt-4 lg:mt-6">
                <span 
                  className="quick-search-tag px-3 py-1 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs lg:text-sm font-medium hover:bg-white/30 cursor-pointer border border-white/20"
                  onClick={() => handleQuickSearch('Psychology')}
                >
                  🧠 Psychology
                </span>
                <span 
                  className="quick-search-tag px-3 py-1 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs lg:text-sm font-medium hover:bg-white/30 cursor-pointer border border-white/20"
                  onClick={() => handleQuickSearch('CBT')}
                >
                  💭 CBT Therapy
                </span>
                <span 
                  className="quick-search-tag px-3 py-1 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs lg:text-sm font-medium hover:bg-white/30 cursor-pointer border border-white/20"
                  onClick={() => handleQuickSearch('Free')}
                >
                  🆓 Free Training
                </span>
                <span 
                  className="quick-search-tag px-3 py-1 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs lg:text-sm font-medium hover:bg-white/30 cursor-pointer border border-white/20"
                  onClick={() => handleQuickSearch('Rawalpindi')}
                >
                  📍 Rawalpindi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeroSection


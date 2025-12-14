function WelcomeSection() {
  const handleScrollTo = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="relative px-4 sm:px-6 py-8 sm:py-12 lg:py-16 overflow-hidden gpu-accelerated therapeutic-gradient zen-pattern" id="home">
      {/* Ultra-relaxing floating elements */}
      <div className="floating-heart" style={{ left: '5%', animationDelay: '0s' }}>💖</div>
      <div className="floating-star" style={{ left: '15%', animationDelay: '3s' }}>⭐</div>
      <div className="floating-leaf" style={{ left: '25%', animationDelay: '6s' }}>🍃</div>
      <div className="floating-butterfly" style={{ left: '35%', animationDelay: '9s' }}>🦋</div>
      <div className="floating-heart" style={{ left: '65%', animationDelay: '12s' }}>💕</div>
      <div className="floating-star" style={{ left: '75%', animationDelay: '15s' }}>✨</div>
      <div className="floating-leaf" style={{ left: '85%', animationDelay: '18s' }}>🌿</div>
      <div className="floating-butterfly" style={{ left: '95%', animationDelay: '21s' }}>🦋</div>
      <div className="floating-heart" style={{ left: '50%', animationDelay: '24s' }}>💝</div>
      <div className="floating-star" style={{ left: '45%', animationDelay: '27s' }}>🌟</div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 sm:space-y-6 animate-slide-up">
          <div className="breathing">
            <h1 className="hero-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
              Welcome to
              <span className="bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-600 bg-clip-text text-transparent animate-pulse-glow">
                {' '}FikrLess
              </span>
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Making mental-health care accessible, comfortable, and stigma-free. We connect people with qualified professionals while training the next generation of compassionate psychologists.
          </p>
          
          {/* Ultra-relaxing CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <button 
              onClick={() => handleScrollTo('about')}
              className="cute-button soft-glow bg-gradient-to-r from-sky-400 to-cyan-400 text-white px-10 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 breathing"
            >
              Learn More 🌸
            </button>
            <button 
              onClick={() => handleScrollTo('contact')}
              className="cute-button soft-glow bg-gradient-to-r from-rose-400 to-pink-400 text-white px-10 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 breathing"
              style={{ animationDelay: '2s' }}
            >
              Get Started 🦋
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection


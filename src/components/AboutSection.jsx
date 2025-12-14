function AboutSection() {
  return (
    <section className="therapeutic-gradient zen-pattern px-4 sm:px-6 py-12 sm:py-16 lg:py-20" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
            About FikrLess
          </h2>
          <div className="max-w-4xl mx-auto space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed font-light">
            <p className="fade-in">
              FikrLess is a <strong className="text-blue-900 font-semibold">Mental Health and Psychology Training Platform</strong> bridging the gap between academic learning and real-world practice — making mental health support accessible, compassionate, and stigma-free.
            </p>
            <p className="fade-in-delay-1">
              We help people reach out for support without fear, connecting them with qualified professionals. Our structured internship programs link psychology students with experienced mentors across Pakistan to strengthen practical skills.
            </p>
            <div className="pt-4 fade-in-delay-2 bg-white/50 backdrop-blur-sm rounded-2xl p-6 mt-6 border-2 border-cyan-200">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">Our Goal</h3>
              <p className="text-base sm:text-lg text-gray-700">
                Building a community that values openness, empathy, and healing — where anyone can seek help confidently, and future psychologists serve with compassion and excellence.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Values Section */}
        <div className="mt-4 sm:mt-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center mb-6 sm:mb-8 animate-slide-up">
            Our Vision & Values
          </h3>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {/* Accessibility */}
            <div className="card-hover rounded-3xl p-6 sm:p-8 text-center bg-white/95 backdrop-blur-sm animate-slide-up soft-glow breathing">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-6 hover:scale-110 transition-all duration-500 soft-glow">
                <i className="fas fa-universal-access text-white text-4xl"></i>
              </div>
              <h4 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-3">Accessibility</h4>
              <p className="text-gray-600 text-base leading-relaxed font-light">
                Quality training to every corner of Pakistan
              </p>
            </div>

            {/* Empathy */}
            <div className="card-hover rounded-3xl p-6 sm:p-8 text-center bg-white/95 backdrop-blur-sm animate-slide-up soft-glow breathing" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-rose-400 to-pink-400 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-6 hover:scale-110 transition-all duration-500 soft-glow">
                <i className="fas fa-heart text-white text-4xl"></i>
              </div>
              <h4 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3">Empathy</h4>
              <p className="text-gray-600 text-base leading-relaxed font-light">
                Compassion, connection, and growth
              </p>
            </div>

            {/* Professionalism */}
            <div className="card-hover rounded-3xl p-6 sm:p-8 text-center bg-white/95 backdrop-blur-sm animate-slide-up soft-glow breathing" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-violet-400 to-purple-400 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-6 hover:scale-110 transition-all duration-500 soft-glow">
                <i className="fas fa-award text-white text-4xl"></i>
              </div>
              <h4 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">Professionalism</h4>
              <p className="text-gray-600 text-base leading-relaxed font-light">
                Ethical and evidence-based practice
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection


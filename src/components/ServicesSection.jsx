function ServicesSection() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-cyan-900 px-4 sm:px-6 py-16 sm:py-20 lg:py-24 overflow-hidden" id="services">
      {/* Animated background circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Services
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            FikrLess provides meaningful programs and initiatives designed to support both personal growth and professional development.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Mental Health App */}
          <div className="relative card-hover rounded-3xl p-8 sm:p-10 bg-white/95 backdrop-blur-sm shadow-2xl animate-slide-up border-2 border-emerald-100">
            <div className="text-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500">
                  <i className="fas fa-mobile-alt text-white text-5xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">Mental Health App</h3>
              <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-white text-sm font-bold rounded-full shadow-xl mb-4 animate-pulse">
                Coming Soon! 🌱
              </span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              A self-care and wellness mobile app that gamifies your mental-wellbeing journey. Users can track progress, complete goals, and grow their own virtual "plant" as they nurture their mental health. Stay tuned for updates!
            </p>
          </div>

          {/* Internships */}
          <div className="relative card-hover rounded-3xl p-8 sm:p-10 bg-white/95 backdrop-blur-sm shadow-2xl animate-slide-up border-2 border-sky-100" style={{ animationDelay: '0.2s' }}>
            <div className="text-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500">
                  <i className="fas fa-user-graduate text-white text-5xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-4">Internships</h3>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed font-light mb-4">
              Practical training programs under expert mentors — learn real-world therapy skills, diagnostic methods, and client interaction.
            </p>
            <p className="text-cyan-600 font-semibold text-base">
              👇 Explore current internships below
            </p>
          </div>

          {/* Counselling & Training */}
          <div className="relative card-hover rounded-3xl p-8 sm:p-10 bg-white/95 backdrop-blur-sm shadow-2xl animate-slide-up border-2 border-purple-100" style={{ animationDelay: '0.4s' }}>
            <div className="text-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500">
                  <i className="fas fa-brain text-white text-5xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-4">Counselling & Training</h3>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              Specialized workshops and structured training sessions for students and professionals. Topics include CBT, DBT, stress management, and psychological assessments — designed to enhance both skill and self-awareness.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection


function FoundersSection() {
  return (
    <section className="gradient-bg px-4 sm:px-6 py-8 sm:py-12 lg:py-16" id="founders">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
            Meet the Founders
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Behind FikrLess are two individuals driven by one vision — to make mental-health support accessible, compassionate, and stigma-free for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Hina Ahmad */}
          <div className="card-hover rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-pink-50 via-purple-50 to-white shadow-2xl animate-slide-left border-2 border-pink-100">
            <div className="text-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-500">
                  <i className="fas fa-lightbulb text-white text-6xl"></i>
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">Hina Ahmad</h3>
              <p className="text-xl text-purple-600 font-semibold mb-4">Co-Founder & CEO</p>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              Hina is the visionary behind FikrLess — leading the initiative to make mental health training and support accessible to everyone. With a strong background in psychology and project development, she oversees FikrLess' growth, partnerships, and strategic direction, ensuring the platform remains community-focused and impact-driven.
            </p>
          </div>

          {/* Ali Tariq */}
          <div className="card-hover rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-sky-50 via-cyan-50 to-white shadow-2xl animate-slide-right border-2 border-cyan-100">
            <div className="text-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-500">
                  <i className="fas fa-code text-white text-6xl"></i>
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2">Ali Tariq</h3>
              <p className="text-xl text-cyan-600 font-semibold mb-4">Co-Founder & CTO</p>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              Ali is responsible for the technical backbone of FikrLess. With expertise in full-stack development and system architecture, he ensures the platform remains secure, scalable, and user-friendly. His work enables students and mentors to connect seamlessly and access high-quality training resources.
            </p>
          </div>
        </div>

        <div className="text-center mt-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-xl text-gray-700 font-medium italic max-w-3xl mx-auto">
            Together, they strive to create a space where care, learning, and technology come together to make a lasting difference.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FoundersSection


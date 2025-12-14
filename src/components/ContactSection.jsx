function ContactSection() {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 px-6 py-16 sm:py-20" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 fade-in">
            Get In Touch
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 fade-in-delay-1">
            We'd love to hear from you! Reach out to us through any of these channels.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 max-w-5xl mx-auto">
          {/* Email */}
          <div className="card-hover rounded-3xl p-6 sm:p-8 bg-white/10 backdrop-blur-sm border border-white/20 text-center animate-slide-up">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
              <i className="fas fa-envelope text-white text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Email Us</h3>
            <a 
              href="mailto:fikrless01@gmail.com" 
              className="text-cyan-300 hover:text-cyan-200 text-lg underline transition-colors duration-300 break-all"
            >
              fikrless01@gmail.com
            </a>
          </div>

          {/* WhatsApp */}
          <div className="card-hover rounded-3xl p-6 sm:p-8 bg-white/10 backdrop-blur-sm border border-white/20 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
              <i className="fab fa-whatsapp text-white text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">WhatsApp</h3>
            <a 
              href="https://wa.me/923290045694" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-300 hover:text-green-200 text-lg underline transition-colors duration-300"
            >
              +92 329 004 5694
            </a>
          </div>

          {/* Phone */}
          <div className="card-hover rounded-3xl p-6 sm:p-8 bg-white/10 backdrop-blur-sm border border-white/20 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <i className="fas fa-phone text-white text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Call Us</h3>
            <a 
              href="tel:+923290045694" 
              className="text-purple-300 hover:text-purple-200 text-lg underline transition-colors duration-300"
            >
              +92 329 004 5694
            </a>
          </div>
        </div>
        
        {/* Social Media Icons */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6 fade-in">Follow Us On Social Media</h3>
          <div className="flex justify-center space-x-6 sm:space-x-8 fade-in-delay-1">
            <a 
              href="https://www.linkedin.com/company/fikrless/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon block group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
                <i className="fab fa-linkedin-in text-white text-2xl sm:text-3xl"></i>
              </div>
            </a>
            <a 
              href="https://instagram.com/fikrless01" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon block group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
                <i className="fab fa-instagram text-white text-2xl sm:text-3xl"></i>
              </div>
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61579763852926" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon block group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-700 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
                <i className="fab fa-facebook-f text-white text-2xl sm:text-3xl"></i>
              </div>
            </a>
            <a 
              href="https://wa.me/923290045694" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon block group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
                <i className="fab fa-whatsapp text-white text-2xl sm:text-3xl"></i>
              </div>
            </a>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-12 pt-8 border-t border-white/20">
          <p className="text-blue-200 text-base sm:text-lg">
            © 2025 FikrLess - Mental Health & Psychology Training Platform
          </p>
          <p className="text-blue-300 text-sm sm:text-base mt-2">
            Making mental-health care accessible, comfortable, and stigma-free for everyone.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ContactSection


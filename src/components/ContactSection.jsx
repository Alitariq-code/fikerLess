import { useState } from 'react'
import api from '../services/api'

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    enquiry: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
    // Clear submit status when user starts typing
    if (submitStatus) {
      setSubmitStatus(null)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.enquiry.trim()) {
      newErrors.enquiry = 'Enquiry is required'
    } else if (formData.enquiry.trim().length < 10) {
      newErrors.enquiry = 'Enquiry must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await api.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        number: formData.number.trim() || undefined,
        enquiry: formData.enquiry.trim(),
      })

      if (response.data.success) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          number: '',
          enquiry: '',
        })
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null)
        }, 5000)
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus('error')
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 px-6 py-16 sm:py-20" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 fade-in">
            Get In Touch
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 fade-in-delay-1">
            We'd love to hear from you! Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="animate-slide-up">
            <div className="rounded-3xl p-6 sm:p-8 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <i className="fas fa-paper-plane text-cyan-400 mr-3"></i>
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    <i className="fas fa-user text-cyan-300 mr-2"></i>
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 ${
                      errors.name
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-white/30 focus:border-cyan-400'
                    } text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-300 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    <i className="fas fa-envelope text-cyan-300 mr-2"></i>
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-white/30 focus:border-cyan-400'
                    } text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-300 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Number Field */}
                <div>
                  <label htmlFor="number" className="block text-white font-medium mb-2">
                    <i className="fas fa-phone text-cyan-300 mr-2"></i>
                    Phone Number <span className="text-blue-300 text-sm">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 focus:border-cyan-400 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
                    placeholder="+92 300 1234567"
                  />
                </div>

                {/* Enquiry Field */}
                <div>
                  <label htmlFor="enquiry" className="block text-white font-medium mb-2">
                    <i className="fas fa-comment-alt text-cyan-300 mr-2"></i>
                    Enquiry <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="enquiry"
                    name="enquiry"
                    value={formData.enquiry}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 ${
                      errors.enquiry
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-white/30 focus:border-cyan-400'
                    } text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 resize-none`}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.enquiry && (
                    <p className="mt-1 text-sm text-red-300 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      {errors.enquiry}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                    isSubmitting
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:scale-105 shadow-xl hover:shadow-2xl'
                  } text-white flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Send Message
                    </>
                  )}
                </button>

                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 rounded-xl bg-green-500/20 border-2 border-green-400 text-green-200 flex items-center animate-slide-up">
                    <i className="fas fa-check-circle mr-2 text-xl"></i>
                    <span>Your message has been sent successfully! We'll get back to you soon.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-red-500/20 border-2 border-red-400 text-red-200 flex items-center animate-slide-up">
                    <i className="fas fa-exclamation-triangle mr-2 text-xl"></i>
                    <span>Failed to send your message. Please try again later.</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Email */}
            <div className="card-hover rounded-3xl p-6 sm:p-8 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <i className="fas fa-envelope text-white text-2xl"></i>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                  <a
                    href="mailto:fikrless01@gmail.com"
                    className="text-cyan-300 hover:text-cyan-200 text-lg underline transition-colors duration-300 break-all"
                  >
                    fikrless01@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="card-hover rounded-3xl p-6 sm:p-8 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <i className="fab fa-whatsapp text-white text-2xl"></i>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                  <a
                    href="https://wa.me/923290045694"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-200 text-lg underline transition-colors duration-300"
                  >
                    +92 329 004 5694
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="card-hover rounded-3xl p-6 sm:p-8 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <i className="fas fa-phone text-white text-2xl"></i>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
                  <a
                    href="tel:+923290045694"
                    className="text-purple-300 hover:text-purple-200 text-lg underline transition-colors duration-300"
                  >
                    +92 329 004 5694
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white/10 backdrop-blur-sm border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Follow Us On Social Media</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/fikrless/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                >
                  <i className="fab fa-linkedin-in text-white"></i>
                </a>
                <a
                  href="https://instagram.com/fikrless01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                >
                  <i className="fab fa-instagram text-white"></i>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61579763852926"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                >
                  <i className="fab fa-facebook-f text-white"></i>
                </a>
                <a
                  href="https://wa.me/923290045694"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                >
                  <i className="fab fa-whatsapp text-white"></i>
                </a>
              </div>
            </div>
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

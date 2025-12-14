import { useState, useEffect } from 'react'
import api from '../services/api'

function MentorCardsSection({ searchTerm = '' }) {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInternships()
  }, [searchTerm])

  const loadInternships = async () => {
    setLoading(true)
    try {
      if (searchTerm && searchTerm.trim()) {
        const response = await api.get('/internships/search', { 
          params: { q: searchTerm.trim() } 
        })
        if (response.data.success) {
          setInternships(response.data.data || [])
        } else {
          setInternships([])
        }
      } else {
        const response = await api.get('/internships', { 
          params: { page: 1, limit: 50 } 
        })
        if (response.data.success) {
          setInternships(response.data.data || [])
        } else {
          setInternships([])
        }
      }
    } catch (error) {
      console.error('Error loading internships:', error)
      setInternships([])
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (fees) => {
    if (fees === 0) return 'Free'
    return `₨${fees.toLocaleString()}`
  }

  const getModeBadgeColor = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'online':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'in-person':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'hybrid':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getGradientColors = (index) => {
    const gradients = [
      'from-blue-500 via-cyan-500 to-teal-500',
      'from-purple-500 via-pink-500 to-rose-500',
      'from-indigo-500 via-blue-500 to-cyan-500',
      'from-emerald-500 via-teal-500 to-cyan-500',
      'from-violet-500 via-purple-500 to-fuchsia-500',
      'from-rose-500 via-pink-500 to-orange-500',
    ]
    return gradients[index % gradients.length]
  }

  return (
    <section className="gradient-bg px-4 sm:px-6 py-12 sm:py-16 relative overflow-hidden" id="internships">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Animation */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent animate-gradient">
            Meet Our Expert Mentors
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Discover incredible internship opportunities with industry professionals
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 font-medium text-lg animate-pulse">Loading amazing opportunities...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && internships.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">No internships found. Check back soon!</p>
          </div>
        )}

        {/* Internships Grid with Staggered Animation */}
        {!loading && internships.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {internships.map((internship, index) => {
              const gradient = getGradientColors(index)
              return (
                <div 
                  key={internship._id || index}
                  className="internship-card group relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Animated Background Glow */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  {/* Card Container */}
                  <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:scale-[1.02] h-full flex flex-col">
                    {/* Animated Header with Gradient */}
                    <div className={`relative bg-gradient-to-r ${gradient} p-6 text-white overflow-hidden`}>
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      {/* Floating Orbs */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
                      
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2 transform group-hover:scale-105 transition-transform duration-300">
                          {internship.mentorName}
                        </h3>
                        <p className="text-white/90 text-sm font-medium">
                          {internship.profession}
                          {internship.specialization && ` • ${internship.specialization}`}
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-6 flex-grow">
                      {/* Programs Section */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                          Programs
                        </h4>
                        <div className="space-y-3">
                          {internship.programs && internship.programs.map((program, pIndex) => (
                            <div 
                              key={pIndex}
                              className="program-card bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 group/program"
                            >
                              {program.title && (
                                <h5 className="font-bold text-gray-900 mb-3 text-base group-hover/program:text-blue-600 transition-colors">
                                  {program.title}
                                </h5>
                              )}
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="badge-animate inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                                  <span className="mr-1.5">⏱️</span> {program.duration}
                                </span>
                                <span className={`badge-animate inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 ${
                                  program.fees === 0 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                }`}>
                                  <span className="mr-1.5">💰</span> {formatPrice(program.fees)}
                                </span>
                                {program.mode && (
                                  <span className={`badge-animate inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 ${getModeBadgeColor(program.mode)}`}>
                                    <span className="mr-1.5">
                                      {program.mode === 'online' ? '🌐' : program.mode === 'in-person' ? '🏢' : '🔄'}
                                    </span> 
                                    {program.mode}
                                  </span>
                                )}
                              </div>
                              {program.description && (
                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 group-hover/program:line-clamp-none transition-all">
                                  {program.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Includes Section */}
                      {internship.includes && internship.includes.length > 0 && (
                        <div className="animate-fade-in">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            Includes
                          </h4>
                          <ul className="space-y-2.5">
                            {internship.includes.map((include, idx) => (
                              <li 
                                key={idx} 
                                className="flex items-start text-sm text-gray-700 group/item hover:text-blue-600 transition-colors"
                                style={{ animationDelay: `${idx * 50}ms` }}
                              >
                                <span className="text-green-500 mr-3 mt-0.5 text-lg group-hover/item:scale-125 transition-transform duration-300">✓</span>
                                <span className="flex-1">{include}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Location Section */}
                      <div className="pt-4 border-t border-gray-200 animate-fade-in">
                        <div className="flex items-start group/location">
                          <span className="text-2xl mr-3 group-hover/location:scale-125 transition-transform duration-300">📍</span>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-sm mb-1">
                              {internship.city}
                            </p>
                            {internship.cityNote && (
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {internship.cityNote}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {internship.additionalInfo && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-4 rounded-r-lg animate-fade-in hover:shadow-md transition-shadow">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {internship.additionalInfo}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Animated Footer */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-center space-x-2 group/footer">
                        <img 
                          src="/images/logo.png" 
                          alt="FikrLess" 
                          className="w-6 h-6 object-contain group-hover/footer:scale-125 transition-transform duration-300" 
                        />
                        <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          FIKRLESS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default MentorCardsSection

import { useState, useEffect } from 'react'
import api from '../../services/api'

function InternshipForm({ internship, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    mentorName: '',
    profession: '',
    specialization: '',
    city: '',
    programs: [],
    includes: [],
    cityNote: '',
    additionalInfo: '',
    is_active: true,
    sortOrder: 0,
  })
  const [loading, setLoading] = useState(false)
  const [programErrors, setProgramErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})

  useEffect(() => {
    if (internship) {
      const programs = internship.programs && internship.programs.length > 0 
        ? internship.programs.map(p => ({
            title: p.title || '',
            duration: p.duration || '',
            fees: p.fees || 0,
            mode: p.mode || '',
            description: p.description || '',
          }))
        : [{ title: '', duration: '', fees: 0, mode: '', description: '' }]
      
      const includes = internship.includes && internship.includes.length > 0
        ? internship.includes
        : ['']

      setFormData({
        mentorName: internship.mentorName || '',
        profession: internship.profession || '',
        specialization: internship.specialization || '',
        city: internship.city || '',
        programs: programs,
        includes: includes,
        cityNote: internship.cityNote || '',
        additionalInfo: internship.additionalInfo || '',
        is_active: internship.is_active !== false,
        sortOrder: internship.sortOrder || 0,
      })
      setProgramErrors({})
      setTouchedFields({})
    } else {
      setFormData({
        mentorName: '',
        profession: '',
        specialization: '',
        city: '',
        programs: [{ title: '', duration: '', fees: 0, mode: '', description: '' }],
        includes: [''],
        cityNote: '',
        additionalInfo: '',
        is_active: true,
        sortOrder: 0,
      })
      setProgramErrors({})
      setTouchedFields({})
    }
  }, [internship])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouchedFields((prev) => ({ ...prev, [field]: true }))
  }

  const handleProgramChange = (index, field, value) => {
    const newPrograms = [...formData.programs]
    if (!newPrograms[index]) {
      newPrograms[index] = { title: '', duration: '', fees: 0, mode: '', description: '' }
    }
    newPrograms[index] = { ...newPrograms[index], [field]: value }
    setFormData((prev) => ({ ...prev, programs: newPrograms }))
    
    if (field === 'title' || field === 'duration') {
      if (newPrograms[index].title && newPrograms[index].duration) {
        setProgramErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[index]
          return newErrors
        })
      }
    }
  }

  const addProgram = () => {
    setFormData((prev) => ({
      ...prev,
      programs: [...prev.programs, { title: '', duration: '', fees: 0, mode: '', description: '' }],
    }))
  }

  const removeProgram = (index) => {
    if (formData.programs.length <= 1) {
      alert('At least one program is required')
      return
    }
    const newPrograms = formData.programs.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, programs: newPrograms }))
    
    setProgramErrors((prev) => {
      const newErrors = {}
      Object.keys(prev).forEach((key) => {
        const keyNum = parseInt(key)
        if (keyNum > index) {
          newErrors[keyNum - 1] = prev[key]
        } else if (keyNum < index) {
          newErrors[keyNum] = prev[key]
        }
      })
      return newErrors
    })
  }

  const handleIncludeChange = (index, value) => {
    const newIncludes = [...formData.includes]
    newIncludes[index] = value
    setFormData((prev) => ({ ...prev, includes: newIncludes }))
  }

  const addInclude = () => {
    setFormData((prev) => ({ ...prev, includes: [...prev.includes, ''] }))
  }

  const removeInclude = (index) => {
    const newIncludes = formData.includes.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, includes: newIncludes.length > 0 ? newIncludes : [''] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setProgramErrors({})

    // Validate required fields
    if (!formData.mentorName.trim()) {
      alert('Mentor Name is required')
      setLoading(false)
      return
    }

    if (!formData.profession.trim()) {
      alert('Profession is required')
      setLoading(false)
      return
    }

    if (!formData.city.trim()) {
      alert('City is required')
      setLoading(false)
      return
    }

    // Validate programs
    const validPrograms = formData.programs.filter((p) => p.title?.trim() && p.duration?.trim())
    
    if (validPrograms.length === 0) {
      alert('At least one program with title and duration is required')
      setLoading(false)
      return
    }

    const errors = {}
    formData.programs.forEach((program, index) => {
      if (!program.title?.trim() || !program.duration?.trim()) {
        errors[index] = 'Title and duration are required'
      }
    })

    if (Object.keys(errors).length > 0) {
      setProgramErrors(errors)
      setLoading(false)
      const firstErrorIndex = parseInt(Object.keys(errors)[0])
      const errorElement = document.querySelector(`[data-program-index="${firstErrorIndex}"]`)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    try {
      const payload = {
        mentorName: formData.mentorName.trim(),
        profession: formData.profession.trim(),
        specialization: formData.specialization?.trim() || '',
        city: formData.city.trim(),
        programs: validPrograms.map(p => ({
          title: p.title.trim(),
          duration: p.duration.trim(),
          fees: Number(p.fees) || 0,
          mode: p.mode || '',
          description: p.description?.trim() || '',
        })),
        includes: formData.includes.filter((i) => i?.trim()).map(i => i.trim()),
        cityNote: formData.cityNote?.trim() || '',
        additionalInfo: formData.additionalInfo?.trim() || '',
        is_active: formData.is_active,
        sortOrder: Number(formData.sortOrder) || 0,
      }

      if (internship?._id) {
        await api.put(`/internships/${internship._id}`, payload)
      } else {
        await api.post('/internships', payload)
      }

      onSave()
    } catch (error) {
      console.error('Error saving internship:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save internship'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (field) => {
    if (!touchedFields[field]) return null
    if (field === 'mentorName' && !formData.mentorName.trim()) return 'Mentor Name is required'
    if (field === 'profession' && !formData.profession.trim()) return 'Profession is required'
    if (field === 'city' && !formData.city.trim()) return 'City is required'
    return null
  }

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <i className="fas fa-user-tie text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Basic Information</h3>
              <p className="text-sm text-gray-500 mt-1">Enter mentor and location details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mentor Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={formData.mentorName}
                  onChange={(e) => handleChange('mentorName', e.target.value)}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, mentorName: true }))}
                  required
                  placeholder="Enter mentor's full name"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    getFieldError('mentorName')
                      ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400 bg-white hover:border-gray-300'
                  }`}
                />
              </div>
              {getFieldError('mentorName') && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {getFieldError('mentorName')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profession <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-briefcase text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => handleChange('profession', e.target.value)}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, profession: true }))}
                  required
                  placeholder="e.g., Clinical Psychologist"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    getFieldError('profession')
                      ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400 bg-white hover:border-gray-300'
                  }`}
                />
              </div>
              {getFieldError('profession') && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {getFieldError('profession')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialization
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-star text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => handleChange('specialization', e.target.value)}
                  placeholder="e.g., CBT & DBT Specialist"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white hover:border-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-map-marker-alt text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, city: true }))}
                  required
                  placeholder="e.g., Lahore, Karachi"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    getFieldError('city')
                      ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400 bg-white hover:border-gray-300'
                  }`}
                />
              </div>
              {getFieldError('city') && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {getFieldError('city')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Programs</h3>
                <p className="text-sm text-gray-500 mt-1">Add internship programs and details</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addProgram}
              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Program
            </button>
          </div>

          <div className="space-y-5">
            {formData.programs.map((program, index) => (
              <div 
                key={index} 
                data-program-index={index}
                className={`relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border-2 transition-all duration-300 ${
                  programErrors[index] 
                    ? 'border-red-300 shadow-red-100 shadow-lg' 
                    : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
                }`}
              >
                {/* Program Header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      programErrors[index] 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      <i className="fas fa-graduation-cap"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Program {index + 1}</h4>
                      <p className="text-xs text-gray-500">Fill in the program details</p>
                    </div>
                  </div>
                  {formData.programs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProgram(index)}
                      className="px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 font-medium text-sm"
                    >
                      <i className="fas fa-trash mr-2"></i>Remove
                    </button>
                  )}
                </div>
                
                {/* Error Message */}
                {programErrors[index] && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-red-700 text-sm font-medium flex items-center">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      {programErrors[index]}
                    </p>
                  </div>
                )}
                
                {/* Program Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Program Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={program.title || ''}
                      onChange={(e) => handleProgramChange(index, 'title', e.target.value)}
                      placeholder="Enter program title"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                        programErrors[index] && !program.title
                          ? 'border-red-300 focus:ring-red-400 bg-red-50'
                          : 'border-gray-200 focus:ring-green-400 hover:border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={program.duration || ''}
                      onChange={(e) => handleProgramChange(index, 'duration', e.target.value)}
                      placeholder="e.g., 3 months, 6 weeks"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                        programErrors[index] && !program.duration
                          ? 'border-red-300 focus:ring-red-400 bg-red-50'
                          : 'border-gray-200 focus:ring-green-400 hover:border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fees (₨)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">₨</span>
                      </div>
                      <input
                        type="number"
                        value={program.fees || 0}
                        onChange={(e) => handleProgramChange(index, 'fees', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 hover:border-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Mode
                    </label>
                    <select
                      value={program.mode || ''}
                      onChange={(e) => handleProgramChange(index, 'mode', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 hover:border-gray-300 bg-white"
                    >
                      <option value="">Select Mode</option>
                      <option value="online">🌐 Online</option>
                      <option value="hybrid">🔄 Hybrid</option>
                      <option value="in-person">🏢 In-Person</option>
                    </select>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={program.description || ''}
                    onChange={(e) => handleProgramChange(index, 'description', e.target.value)}
                    rows="3"
                    placeholder="Describe the program, what students will learn, etc. (optional)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 hover:border-gray-300 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {formData.programs.length === 0 && (
            <div className="text-center py-12 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
              <i className="fas fa-exclamation-triangle text-yellow-600 text-4xl mb-3"></i>
              <p className="text-yellow-800 font-semibold">
                At least one program is required
              </p>
              <p className="text-yellow-600 text-sm mt-1">Click "Add Program" to get started</p>
            </div>
          )}
        </div>

        {/* Includes Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <i className="fas fa-list-check text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">What's Included</h3>
                <p className="text-sm text-gray-500 mt-1">List what students will receive</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addInclude}
              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {formData.includes.map((include, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-check-circle text-green-500"></i>
                  </div>
                  <input
                    type="text"
                    value={include || ''}
                    onChange={(e) => handleIncludeChange(index, e.target.value)}
                    placeholder="e.g., Certificate of Completion, Study Materials, etc."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-gray-300"
                  />
                </div>
                {formData.includes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="px-4 py-3 text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-200 font-medium"
                    title="Remove item"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            ))}
            {formData.includes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-info-circle text-2xl mb-2"></i>
                <p className="text-sm">No items added yet. Click "Add Item" to include benefits.</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <i className="fas fa-info-circle text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Additional Information</h3>
              <p className="text-sm text-gray-500 mt-1">Optional notes and special requirements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-map text-orange-500 mr-2"></i>
                City Note
              </label>
              <textarea
                value={formData.cityNote}
                onChange={(e) => handleChange('cityNote', e.target.value)}
                rows="4"
                placeholder="e.g., Students can be placed across multiple cities..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 hover:border-gray-300 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-sticky-note text-orange-500 mr-2"></i>
                Additional Info
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleChange('additionalInfo', e.target.value)}
                rows="4"
                placeholder="Any special notes, requirements, or important information..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 hover:border-gray-300 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <i className="fas fa-cogs text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Settings</h3>
              <p className="text-sm text-gray-500 mt-1">Configure visibility and display order</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="ml-4 text-gray-700 font-semibold cursor-pointer">
                  Active Status
                </label>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                formData.is_active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {formData.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-sort-numeric-down text-indigo-500 mr-2"></i>
                Sort Order
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-hashtag text-gray-400"></i>
                </div>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleChange('sortOrder', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="0 = First"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:border-gray-300"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">Lower numbers appear first in listings</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
          >
            <i className="fas fa-times mr-2"></i>Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>Save Internship
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InternshipForm

import { useState, useEffect } from 'react'
import api from '../../services/api'

function InternshipModal({ internship, onClose, onSave }) {
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

  useEffect(() => {
    if (internship) {
      setFormData({
        mentorName: internship.mentorName || '',
        profession: internship.profession || '',
        specialization: internship.specialization || '',
        city: internship.city || '',
        programs: internship.programs || [],
        includes: internship.includes || [],
        cityNote: internship.cityNote || '',
        additionalInfo: internship.additionalInfo || '',
        is_active: internship.is_active !== false,
        sortOrder: internship.sortOrder || 0,
      })
    } else {
      // Reset form for new internship
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
    }
  }, [internship])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProgramChange = (index, field, value) => {
    const newPrograms = [...formData.programs]
    newPrograms[index] = { ...newPrograms[index], [field]: value }
    setFormData((prev) => ({ ...prev, programs: newPrograms }))
  }

  const addProgram = () => {
    setFormData((prev) => ({
      ...prev,
      programs: [...prev.programs, { title: '', duration: '', fees: 0, mode: '', description: '' }],
    }))
  }

  const removeProgram = (index) => {
    const newPrograms = formData.programs.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, programs: newPrograms }))
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
    setFormData((prev) => ({ ...prev, includes: newIncludes }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate programs
    const errors = {}
    formData.programs.forEach((program, index) => {
      if (!program.title || !program.duration) {
        errors[index] = 'Title and duration are required'
      }
    })

    if (Object.keys(errors).length > 0) {
      setProgramErrors(errors)
      setLoading(false)
      return
    }

    try {
      const payload = {
        ...formData,
        programs: formData.programs.filter((p) => p.title && p.duration),
        includes: formData.includes.filter((i) => i.trim()),
      }

      if (internship?._id) {
        await api.put(`/internships/${internship._id}`, payload)
      } else {
        await api.post('/internships', payload)
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving internship:', error)
      alert(error.response?.data?.message || 'Failed to save internship')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {internship ? 'Edit Internship' : 'Add New Internship'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-user-tie text-blue-600 mr-2"></i>
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user text-blue-500 mr-1"></i>
                  Mentor Name *
                </label>
                <input
                  type="text"
                  value={formData.mentorName}
                  onChange={(e) => handleChange('mentorName', e.target.value)}
                  required
                  placeholder="Enter mentor's full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-briefcase text-blue-500 mr-1"></i>
                  Profession *
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => handleChange('profession', e.target.value)}
                  required
                  placeholder="e.g., Clinical Psychologist"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-star text-blue-500 mr-1"></i>
                  Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => handleChange('specialization', e.target.value)}
                  placeholder="e.g., CBT & DBT Specialist"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-map-marker-alt text-blue-500 mr-1"></i>
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                  placeholder="e.g., Lahore, Karachi"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Programs */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                <i className="fas fa-graduation-cap text-green-600 mr-2"></i>
                Programs *
              </h4>
              <button
                type="button"
                onClick={addProgram}
                className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <i className="fas fa-plus mr-2"></i>Add Program
              </button>
            </div>
            <div className="space-y-4">
              {formData.programs.map((program, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-200">
                  {programErrors[index] && (
                    <p className="text-red-500 text-sm mb-2">{programErrors[index]}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={program.title}
                        onChange={(e) => handleProgramChange(index, 'title', e.target.value)}
                        placeholder="Program title"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input
                        type="text"
                        value={program.duration}
                        onChange={(e) => handleProgramChange(index, 'duration', e.target.value)}
                        placeholder="e.g., 3 months"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
                      <input
                        type="number"
                        value={program.fees}
                        onChange={(e) => handleProgramChange(index, 'fees', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                      <select
                        value={program.mode}
                        onChange={(e) => handleProgramChange(index, 'mode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="">Select Mode</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="in-person">In-Person</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={program.description}
                      onChange={(e) => handleProgramChange(index, 'description', e.target.value)}
                      rows="2"
                      placeholder="Program description"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  {formData.programs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProgram(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <i className="fas fa-trash mr-1"></i>Remove Program
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                <i className="fas fa-list-check text-purple-600 mr-2"></i>
                Includes
              </h4>
              <button
                type="button"
                onClick={addInclude}
                className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <i className="fas fa-plus mr-2"></i>Add Item
              </button>
            </div>
            <div className="space-y-2">
              {formData.includes.map((include, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={include}
                    onChange={(e) => handleIncludeChange(index, e.target.value)}
                    placeholder="Include item"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  {formData.includes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInclude(index)}
                      className="text-red-500 hover:text-red-700 px-3"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-info-circle text-orange-600 mr-2"></i>
              Additional Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City Note</label>
                <textarea
                  value={formData.cityNote}
                  onChange={(e) => handleChange('cityNote', e.target.value)}
                  rows="3"
                  placeholder="Student can be debuted across multiple cities..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Info</label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleChange('additionalInfo', e.target.value)}
                  rows="3"
                  placeholder="Any special notes or requirements..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-cogs text-indigo-600 mr-2"></i>
              Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Status
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleChange('sortOrder', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="0 = First"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              <i className="fas fa-times mr-2"></i>Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
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
    </div>
  )
}

export default InternshipModal


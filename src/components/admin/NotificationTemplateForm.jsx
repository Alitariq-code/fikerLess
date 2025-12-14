import { useState, useEffect } from 'react'
import api from '../../services/api'

function NotificationTemplateForm({ template, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'general',
    cta_text: '',
    cta_url: '',
    is_active: true,
    schedule_at: '',
  })
  const [loading, setLoading] = useState(false)
  const [touchedFields, setTouchedFields] = useState({})
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || '',
        body: template.body || '',
        type: template.type || 'general',
        cta_text: template.cta_text || '',
        cta_url: template.cta_url || '',
        is_active: template.is_active !== undefined ? template.is_active : true,
        schedule_at: template.schedule_at ? new Date(template.schedule_at).toISOString().slice(0, 16) : '',
      })
      setTouchedFields({})
      setErrors({})
    } else {
      setFormData({
        title: '',
        body: '',
        type: 'general',
        cta_text: '',
        cta_url: '',
        is_active: true,
        schedule_at: '',
      })
      setTouchedFields({})
      setErrors({})
    }
  }, [template])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouchedFields((prev) => ({ ...prev, [field]: true }))
    
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    if (successMessage) {
      setSuccessMessage('')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Body is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    
    setTouchedFields({
      title: true,
      body: true,
    })

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: formData.title.trim(),
        body: formData.body.trim(),
        type: formData.type || 'general',
        cta_text: formData.cta_text?.trim() || undefined,
        cta_url: formData.cta_url?.trim() || undefined,
        is_active: formData.is_active,
        schedule_at: formData.schedule_at || undefined,
      }

      if (template?._id) {
        await api.put(`/notifications/admin/templates/${template._id}`, payload)
        setSuccessMessage('Template updated successfully!')
      } else {
        await api.post('/notifications/admin/templates', payload)
        setSuccessMessage('Template created successfully!')
      }

      setTimeout(() => {
        onSave()
      }, 1000)
    } catch (error) {
      console.error('Error saving template:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save template'
      setErrors({ submit: errorMessage })
      setLoading(false)
    }
  }

  const getFieldError = (field) => {
    if (errors[field]) return errors[field]
    if (!touchedFields[field]) return null
    
    if (field === 'title' && formData.title.trim()) {
      if (formData.title.trim().length === 0) {
        return 'Title is required'
      }
    }
    
    if (field === 'body' && formData.body.trim()) {
      if (formData.body.trim().length === 0) {
        return 'Body is required'
      }
    }
    
    return null
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center animate-slide-down shadow-lg">
          <div className="flex-shrink-0">
            <i className="fas fa-check-circle text-green-500 text-xl"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center animate-slide-down shadow-lg">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-semibold text-red-800">{errors.submit}</p>
          </div>
          <button
            onClick={() => setErrors((prev) => {
              const newErrors = { ...prev }
              delete newErrors.submit
              return newErrors
            })}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
              <i className="fas fa-bell text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Template Information</h3>
              <p className="text-sm text-gray-500 mt-1">Create a notification template for reuse</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-heading text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, title: true }))}
                  required
                  maxLength={100}
                  placeholder="Enter notification title..."
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    getFieldError('title')
                      ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400 bg-white hover:border-gray-300'
                  }`}
                />
              </div>
              {getFieldError('title') && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {getFieldError('title')}
                </p>
              )}
              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {formData.title.length}/100 characters
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Body <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <i className="fas fa-align-left text-gray-400"></i>
                </div>
                <textarea
                  value={formData.body}
                  onChange={(e) => handleChange('body', e.target.value)}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, body: true }))}
                  required
                  rows="5"
                  maxLength={200}
                  placeholder="Enter notification body/message..."
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                    getFieldError('body')
                      ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400 bg-white hover:border-gray-300'
                  }`}
                />
              </div>
              {getFieldError('body') && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {getFieldError('body')}
                </p>
              )}
              <div className="mt-1.5">
                <p className="text-xs text-gray-500">
                  {formData.body.length}/200 characters
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-tag text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    placeholder="e.g., general, forum, achievement..."
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                    className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="ml-4 text-gray-700 font-semibold cursor-pointer">
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CTA Text <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-hand-pointer text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => handleChange('cta_text', e.target.value)}
                    placeholder="e.g., View Details, Open App..."
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CTA URL <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-link text-gray-400"></i>
                  </div>
                  <input
                    type="url"
                    value={formData.cta_url}
                    onChange={(e) => handleChange('cta_url', e.target.value)}
                    placeholder="https://example.com/action"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Schedule At <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-calendar-alt text-gray-400"></i>
                </div>
                <input
                  type="datetime-local"
                  value={formData.schedule_at}
                  onChange={(e) => handleChange('schedule_at', e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <i className="fas fa-times mr-2"></i>Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  {template?._id ? 'Update Template' : 'Create Template'}
                </>
              )}
            </span>
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NotificationTemplateForm


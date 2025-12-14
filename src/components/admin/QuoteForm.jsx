import { useState, useEffect } from 'react'
import api from '../../services/api'

function QuoteForm({ quote, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    quote_english: '',
    quote_urdu: '',
    quranic_verse: '',
    is_today_quote: false,
  })
  const [loading, setLoading] = useState(false)
  const [touchedFields, setTouchedFields] = useState({})
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (quote) {
      setFormData({
        quote_english: quote.quote_english || '',
        quote_urdu: quote.quote_urdu || '',
        quranic_verse: quote.quranic_verse || '',
        is_today_quote: quote.is_today_quote || false,
      })
      setTouchedFields({})
      setErrors({})
    } else {
      setFormData({
        quote_english: '',
        quote_urdu: '',
        quranic_verse: '',
        is_today_quote: false,
      })
      setTouchedFields({})
      setErrors({})
    }
  }, [quote])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouchedFields((prev) => ({ ...prev, [field]: true }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.quote_english.trim()) {
      newErrors.quote_english = 'English quote is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    
    // Mark all fields as touched
    setTouchedFields({
      quote_english: true,
    })

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        quote_english: formData.quote_english.trim(),
        quote_urdu: formData.quote_urdu?.trim() || '',
        quranic_verse: formData.quranic_verse?.trim() || '',
        is_today_quote: formData.is_today_quote,
      }

      if (quote?._id) {
        await api.put(`/quote/admin/${quote._id}`, payload)
        setSuccessMessage('Quote updated successfully!')
      } else {
        await api.post('/quote/admin/create', payload)
        setSuccessMessage('Quote created successfully!')
      }

      // Wait a moment to show success message, then call onSave
      setTimeout(() => {
        onSave()
      }, 1000)
    } catch (error) {
      console.error('Error saving quote:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save quote'
      setErrors({ submit: errorMessage })
      setLoading(false)
    }
  }

  const getFieldError = (field) => {
    if (errors[field]) return errors[field]
    if (!touchedFields[field]) return null
    
    // Real-time validation
    if (field === 'quote_english' && formData.quote_english.trim()) {
      if (formData.quote_english.trim().length === 0) {
        return 'English quote is required'
      }
    }
    
    return null
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Success Message */}
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

      {/* Error Message */}
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
        {/* Quote Information Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
              <i className="fas fa-quote-left text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Quote Information</h3>
              <p className="text-sm text-gray-500 mt-1">Enter quote details in English, Urdu, and optional Quranic verse</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                English Quote <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-quote-right text-gray-400"></i>
                </div>
                <textarea
                  value={formData.quote_english}
                  onChange={(e) => handleChange('quote_english', e.target.value)}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, quote_english: true }))}
                  required
                  rows="4"
                  placeholder="Enter the quote in English..."
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                    getFieldError('quote_english')
                      ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-purple-400 focus:border-purple-400 bg-white hover:border-gray-300'
                  }`}
                />
              </div>
              {getFieldError('quote_english') && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {getFieldError('quote_english')}
                </p>
              )}
              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {formData.quote_english.length} characters
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Urdu Quote <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-language text-gray-400"></i>
                </div>
                <textarea
                  value={formData.quote_urdu}
                  onChange={(e) => handleChange('quote_urdu', e.target.value)}
                  rows="4"
                  placeholder="Enter the quote in Urdu..."
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-gray-300 resize-none"
                />
              </div>
              <div className="mt-1.5">
                <p className="text-xs text-gray-500">
                  {formData.quote_urdu.length} characters
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quranic Verse <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-book-quran text-gray-400"></i>
                </div>
                <textarea
                  value={formData.quranic_verse}
                  onChange={(e) => handleChange('quranic_verse', e.target.value)}
                  rows="3"
                  placeholder="Enter Quranic verse if applicable..."
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-gray-300 resize-none"
                />
              </div>
              <div className="mt-1.5">
                <p className="text-xs text-gray-500">
                  {formData.quranic_verse.length} characters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote of the Day Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 via-orange-600 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
              <i className="fas fa-star text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Quote of the Day</h3>
              <p className="text-sm text-gray-500 mt-1">Set this quote as today's featured quote</p>
            </div>
          </div>

          <div className="flex items-center p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex items-center flex-1">
              <input
                type="checkbox"
                id="isTodayQuote"
                checked={formData.is_today_quote}
                onChange={(e) => handleChange('is_today_quote', e.target.checked)}
                className="w-6 h-6 text-yellow-600 rounded focus:ring-yellow-500 cursor-pointer"
              />
              <label htmlFor="isTodayQuote" className="ml-4 text-gray-700 font-semibold cursor-pointer">
                Set as Quote of the Day
              </label>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              formData.is_today_quote
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}>
              {formData.is_today_quote ? (
                <span className="flex items-center">
                  <i className="fas fa-star mr-2"></i>Today's Quote
                </span>
              ) : (
                <span className="flex items-center">
                  <i className="fas fa-star-o mr-2"></i>Regular Quote
                </span>
              )}
            </div>
          </div>

          {formData.is_today_quote && (
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <p className="text-yellow-700 text-sm font-medium flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                This quote will be set as today's quote. Any previously selected quote of the day will be unset.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
            className="px-8 py-3.5 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  {quote?._id ? 'Update Quote' : 'Create Quote'}
                </>
              )}
            </span>
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default QuoteForm


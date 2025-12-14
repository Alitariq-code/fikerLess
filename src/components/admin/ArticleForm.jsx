import { useState, useEffect, useRef } from 'react'
import api from '../../services/api'
import ImageUpload from '../common/ImageUpload'

const ARTICLE_CATEGORIES = [
  'Sleep',
  'Exercise',
  'Meditation',
  'Mood Tracking',
  'Fitness',
  'Yoga',
  'Anxiety',
  'Depression',
  'Stress Management',
  'Self-Care',
  'Relationships',
  'Nutrition',
  'Mindfulness',
  'Therapy & Counseling',
  'Personal Growth',
  'Work-Life Balance',
  'Addiction Recovery',
  'Trauma Healing',
  'Parenting & Family',
  'Grief & Loss',
  'Cognitive Behavioral Therapy (CBT)',
  'Other',
]

const ARTICLE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
}

function ArticleForm({ article, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    featured_image_url: '',
    image_urls: [],
    status: ARTICLE_STATUS.DRAFT,
  })
  const [loading, setLoading] = useState(false)
  const [touchedFields, setTouchedFields] = useState({})
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [imageError, setImageError] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        category: article.category || '',
        content: article.content || '',
        featured_image_url: article.featured_image_url || '',
        image_urls: article.image_urls || [],
        status: article.status || ARTICLE_STATUS.DRAFT,
      })
      setTouchedFields({})
      setErrors({})
      setImageError(false)
    } else {
      setFormData({
        title: '',
        category: '',
        content: '',
        featured_image_url: '',
        image_urls: [],
        status: ARTICLE_STATUS.DRAFT,
      })
      setTouchedFields({})
      setErrors({})
      setImageError(false)
    }
  }, [article])

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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long'
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must not exceed 200 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (formData.content.trim().length < 50) {
      newErrors.content = 'Content must be at least 50 characters long'
    }

    if (formData.featured_image_url && formData.featured_image_url.trim()) {
      try {
        new URL(formData.featured_image_url.trim())
      } catch {
        newErrors.featured_image_url = 'Please enter a valid URL'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    
    // Mark all fields as touched
    setTouchedFields({
      title: true,
      category: true,
      content: true,
      featured_image_url: true,
    })

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField === 'content' && contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        content: formData.content.trim(),
        featured_image_url: formData.featured_image_url?.trim() || '',
        image_urls: formData.image_urls || [],
        status: formData.status,
      }

      if (article?._id) {
        await api.put(`/articles/admin/${article._id}`, payload)
        setSuccessMessage('Article updated successfully!')
      } else {
        await api.post('/articles/admin/create', payload)
        setSuccessMessage('Article created successfully!')
      }

      // Wait a moment to show success message, then call onSave
      setTimeout(() => {
        onSave()
      }, 1000)
    } catch (error) {
      console.error('Error saving article:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save article'
      setErrors({ submit: errorMessage })
      setLoading(false)
    }
  }

  const getFieldError = (field) => {
    if (errors[field]) return errors[field]
    if (!touchedFields[field]) return null
    
    // Real-time validation
    if (field === 'title' && formData.title.trim()) {
      if (formData.title.trim().length < 3) return 'Title must be at least 3 characters'
      if (formData.title.trim().length > 200) return 'Title must not exceed 200 characters'
    }
    if (field === 'content' && formData.content.trim()) {
      if (formData.content.trim().length < 50) return 'Content must be at least 50 characters'
    }
    if (field === 'featured_image_url' && formData.featured_image_url.trim()) {
      try {
        new URL(formData.featured_image_url.trim())
      } catch {
        return 'Please enter a valid URL'
      }
    }
    
    return null
  }

  const wordCount = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length
  const readTime = wordCount > 0 ? Math.ceil(wordCount / 200) : 0

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center animate-slide-down">
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
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center animate-slide-down">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-red-800">{errors.submit}</p>
          </div>
          <button
            onClick={() => setErrors((prev) => {
              const newErrors = { ...prev }
              delete newErrors.submit
              return newErrors
            })}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
              <i className="fas fa-newspaper text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Article Information</h3>
              <p className="text-sm text-gray-500 mt-1">Enter article details and metadata</p>
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
                  placeholder="Enter a compelling article title..."
                  maxLength={200}
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
                  {formData.title.length}/200 characters
                </p>
                {formData.title.length > 180 && (
                  <p className="text-xs text-yellow-600 font-medium">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    Approaching character limit
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-tag text-gray-400"></i>
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, category: true }))}
                    required
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 appearance-none bg-white ${
                      getFieldError('category')
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                        : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400 hover:border-gray-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {ARTICLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
                {getFieldError('category') && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {getFieldError('category')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Publication Status
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className={`fas ${formData.status === ARTICLE_STATUS.PUBLISHED ? 'fa-eye' : 'fa-eye-slash'} text-gray-400`}></i>
                  </div>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-300 bg-white appearance-none"
                  >
                    <option value={ARTICLE_STATUS.DRAFT}>Draft</option>
                    <option value={ARTICLE_STATUS.PUBLISHED}>Published</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
                <div className={`mt-3 px-4 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center space-x-2 transition-all ${
                  formData.status === ARTICLE_STATUS.PUBLISHED
                    ? 'bg-green-100 text-green-700 border-2 border-green-200'
                    : 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
                }`}>
                  <i className={`fas ${formData.status === ARTICLE_STATUS.PUBLISHED ? 'fa-check-circle' : 'fa-clock'}`}></i>
                  <span>{formData.status === ARTICLE_STATUS.PUBLISHED ? 'Will be Published' : 'Saved as Draft'}</span>
                </div>
              </div>
            </div>

            <div>
              <ImageUpload
                key={article?._id || 'new-article'}
                images={formData.image_urls || []}
                onChange={(urls) => handleChange('image_urls', urls)}
                maxImages={10}
                label={
                  <span>
                    <i className="fas fa-image text-blue-500 mr-2"></i>
                    Article Images
                    <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
                  </span>
                }
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
                <i className="fas fa-file-alt text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Article Content</h3>
                <p className="text-sm text-gray-500 mt-1">Write your article content (HTML supported)</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{wordCount}</div>
                <div className="text-xs text-gray-500">Words</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{readTime}</div>
                <div className="text-xs text-gray-500">Min Read</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              ref={contentRef}
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              onBlur={() => setTouchedFields(prev => ({ ...prev, content: true }))}
              required
              rows="25"
              placeholder="Write your article content here... You can use HTML for formatting."
              className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 resize-none font-mono text-sm ${
                getFieldError('content')
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                  : 'border-gray-200 focus:ring-green-400 hover:border-gray-300'
              }`}
            />
            {getFieldError('content') && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                <i className="fas fa-exclamation-circle mr-1.5"></i>
                {getFieldError('content')}
              </p>
            )}
            <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <i className="fas fa-font mr-1.5"></i>
                  {formData.content.trim().length} characters
                </span>
                <span className="flex items-center">
                  <i className="fas fa-align-left mr-1.5"></i>
                  {wordCount} words
                </span>
                {readTime > 0 && (
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-1.5"></i>
                    ~{readTime} min read
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {formData.content.trim().length > 0 && formData.content.trim().length < 50 && (
                  <p className="text-xs text-yellow-600 font-medium">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {50 - formData.content.trim().length} more characters needed
                  </p>
                )}
                {formData.content.trim().length >= 50 && (
                  <p className="text-xs text-green-600 font-medium">
                    <i className="fas fa-check-circle mr-1"></i>
                    Minimum requirement met
                  </p>
                )}
              </div>
            </div>
          </div>
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
                  {article?._id ? 'Update Article' : 'Create Article'}
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

export default ArticleForm


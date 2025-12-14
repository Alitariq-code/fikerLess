import { useState, useEffect, useRef } from 'react'
import api from '../../services/api'

const AUDIO_LANGUAGES = [
  { value: 'Urdu', label: 'Urdu', icon: 'fa-language' },
  { value: 'English', label: 'English', icon: 'fa-language' },
]

const AUDIO_CATEGORIES = [
  { value: 'Breathing', label: 'Breathing', icon: 'fa-wind' },
  { value: 'Meditation', label: 'Meditation', icon: 'fa-om' },
  { value: 'Sleep', label: 'Sleep', icon: 'fa-bed' },
  { value: 'Relaxation', label: 'Relaxation', icon: 'fa-spa' },
  { value: 'Mindfulness', label: 'Mindfulness', icon: 'fa-brain' },
]

function AudioForm({ audio, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'Urdu',
    category: 'Breathing',
    thumbnail_url: '',
    order: 0,
    is_active: true,
  })
  const [audioFile, setAudioFile] = useState(null)
  const [audioPreview, setAudioPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [touchedFields, setTouchedFields] = useState({})
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (audio) {
      setFormData({
        title: audio.title || '',
        description: audio.description || '',
        language: audio.language || 'Urdu',
        category: audio.category || 'Breathing',
        thumbnail_url: audio.thumbnail_url || '',
        order: audio.order || 0,
        is_active: audio.is_active !== undefined ? audio.is_active : true,
      })
      if (audio.stream_url) {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api/v1'
        const baseUrl = API_BASE_URL.replace('/api/v1', '')
        setAudioPreview(`${baseUrl}${audio.stream_url}`)
      }
      setTouchedFields({})
      setErrors({})
    } else {
      setFormData({
        title: '',
        description: '',
        language: 'Urdu',
        category: 'Breathing',
        thumbnail_url: '',
        order: 0,
        is_active: true,
      })
      setAudioFile(null)
      setAudioPreview(null)
      setTouchedFields({})
      setErrors({})
    }
  }, [audio])

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedExtensions = ['.mp3', '.m4a', '.wav', '.ogg']
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowedExtensions.includes(ext)) {
      setErrors({ file: `Invalid file type. Allowed: ${allowedExtensions.join(', ')}` })
      return
    }

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      setErrors({ file: 'File size must be less than 100MB' })
      return
    }

    setAudioFile(file)
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.file
      return newErrors
    })

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setAudioPreview(previewUrl)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!audio && !audioFile) {
      newErrors.file = 'Audio file is required for new audio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    
    setTouchedFields({
      title: true,
      file: true,
    })

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('language', formData.language)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('order', formData.order.toString())
      formDataToSend.append('is_active', formData.is_active.toString())
      
      if (formData.thumbnail_url) {
        formDataToSend.append('thumbnail_url', formData.thumbnail_url)
      }

      if (audioFile) {
        formDataToSend.append('audio_file', audioFile)
      }

      if (audio?._id) {
        await api.put(`/audio/admin/${audio._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        setSuccessMessage('Audio updated successfully!')
      } else {
        await api.post('/audio/admin/create', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        setSuccessMessage('Audio created successfully!')
      }

      setTimeout(() => {
        onSave()
      }, 1000)
    } catch (error) {
      console.error('Error saving audio:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save audio'
      setErrors({ submit: errorMessage })
      setLoading(false)
    }
  }

  const getFieldError = (field) => {
    if (errors[field]) return errors[field]
    if (!touchedFields[field]) return null
    return null
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const selectedLanguage = AUDIO_LANGUAGES.find(l => l.value === formData.language)
  const selectedCategory = AUDIO_CATEGORIES.find(c => c.value === formData.category)

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
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
              <i className="fas fa-music text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Audio Information</h3>
              <p className="text-sm text-gray-500 mt-1">Upload and manage audio files</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Audio File <span className="text-red-500">*</span>
                {!audio && <span className="text-gray-400 text-xs font-normal ml-2">(Required for new audio)</span>}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp3,.m4a,.wav,.ogg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="text-center">
                  {audioPreview ? (
                    <div className="space-y-4">
                      <audio controls className="w-full max-w-md mx-auto">
                        <source src={audioPreview} />
                        Your browser does not support the audio element.
                      </audio>
                      {audioFile && (
                        <div className="text-sm text-gray-600">
                          <p><strong>File:</strong> {audioFile.name}</p>
                          <p><strong>Size:</strong> {formatFileSize(audioFile.size)}</p>
                        </div>
                      )}
                      {audio && !audioFile && (
                        <div className="text-sm text-gray-600">
                          <p><strong>Current File:</strong> {audio.filename}</p>
                          {audio.duration && <p><strong>Duration:</strong> {formatDuration(audio.duration)}</p>}
                          {audio.file_size && <p><strong>Size:</strong> {formatFileSize(audio.file_size)}</p>}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setAudioFile(null)
                          setAudioPreview(audio?.stream_url ? (() => {
                            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api/v1'
                            const baseUrl = API_BASE_URL.replace('/api/v1', '')
                            return `${baseUrl}${audio.stream_url}`
                          })() : null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
                      >
                        <i className="fas fa-times mr-2"></i>Remove File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-600 mb-2">Click to upload audio file</p>
                      <p className="text-xs text-gray-500 mb-4">MP3, M4A, WAV, OGG (Max 100MB)</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <i className="fas fa-upload mr-2"></i>Choose File
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {getFieldError('file') && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {getFieldError('file')}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="e.g., Sukoon Bhari Saans, Grounding Breath..."
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thumbnail URL <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-image text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.thumbnail_url}
                    onChange={(e) => handleChange('thumbnail_url', e.target.value)}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <i className="fas fa-align-left text-gray-400"></i>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows="3"
                  placeholder="Describe the audio content..."
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-white hover:border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Language <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className={`fas ${selectedLanguage?.icon || 'fa-language'} text-gray-400`}></i>
                  </div>
                  <select
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
                  >
                    {AUDIO_LANGUAGES.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className={`fas ${selectedCategory?.icon || 'fa-folder'} text-gray-400`}></i>
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
                  >
                    {AUDIO_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-sort-numeric-down text-gray-400"></i>
                  </div>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white hover:border-gray-300"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
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
                    Active (Audio will be visible to users)
                  </label>
                </div>
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
            className="px-8 py-3.5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  {audio?._id ? 'Update Audio' : 'Create Audio'}
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

export default AudioForm


import { useState, useEffect } from 'react'
import api from '../../services/api'

const ACHIEVEMENT_CATEGORIES = [
  { value: 'streak', label: 'Streak', icon: 'fa-fire' },
  { value: 'community', label: 'Community', icon: 'fa-users' },
  { value: 'activity', label: 'Activity', icon: 'fa-running' },
  { value: 'milestone', label: 'Milestone', icon: 'fa-flag-checkered' },
]

const CONDITION_TYPES = [
  { value: 'streak_days', label: 'Streak Days', description: 'Consecutive days of activity' },
  { value: 'forum_helps', label: 'Forum Helps', description: 'Number of forum helps' },
  { value: 'steps_total', label: 'Total Steps', description: 'Total steps accumulated' },
  { value: 'mood_days', label: 'Mood Days', description: 'Days of mood tracking' },
  { value: 'journal_days', label: 'Journal Days', description: 'Days of journaling' },
]

function AchievementForm({ achievement, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🏆',
    category: 'streak',
    condition_type: 'streak_days',
    condition_value: 1,
    xp_reward: 0,
    is_active: true,
    order: 0,
  })
  const [loading, setLoading] = useState(false)
  const [touchedFields, setTouchedFields] = useState({})
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (achievement) {
      setFormData({
        name: achievement.name || '',
        description: achievement.description || '',
        icon: achievement.icon || '🏆',
        category: achievement.category || 'streak',
        condition_type: achievement.condition_type || 'streak_days',
        condition_value: achievement.condition_value || 1,
        xp_reward: achievement.xp_reward || 0,
        is_active: achievement.is_active !== undefined ? achievement.is_active : true,
        order: achievement.order || 0,
      })
      setTouchedFields({})
      setErrors({})
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '🏆',
        category: 'streak',
        condition_type: 'streak_days',
        condition_value: 1,
        xp_reward: 0,
        is_active: true,
        order: 0,
      })
      setTouchedFields({})
      setErrors({})
    }
  }, [achievement])

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.icon.trim()) {
      newErrors.icon = 'Icon is required'
    }

    if (!formData.condition_value || formData.condition_value < 1) {
      newErrors.condition_value = 'Condition value must be at least 1'
    }

    if (formData.xp_reward < 0) {
      newErrors.xp_reward = 'XP reward cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    
    setTouchedFields({
      name: true,
      description: true,
      icon: true,
      condition_value: true,
    })

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        category: formData.category,
        condition_type: formData.condition_type,
        condition_value: parseInt(formData.condition_value),
        xp_reward: parseInt(formData.xp_reward) || 0,
        is_active: formData.is_active,
        order: parseInt(formData.order) || 0,
      }

      if (achievement?._id) {
        await api.put(`/achievements/admin/${achievement._id}`, payload)
        setSuccessMessage('Achievement updated successfully!')
      } else {
        await api.post('/achievements/admin/create', payload)
        setSuccessMessage('Achievement created successfully!')
      }

      setTimeout(() => {
        onSave()
      }, 1000)
    } catch (error) {
      console.error('Error saving achievement:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save achievement'
      setErrors({ submit: errorMessage })
      setLoading(false)
    }
  }

  const getFieldError = (field) => {
    if (errors[field]) return errors[field]
    if (!touchedFields[field]) return null
    return null
  }

  const selectedCategory = ACHIEVEMENT_CATEGORIES.find(c => c.value === formData.category)
  const selectedConditionType = CONDITION_TYPES.find(c => c.value === formData.condition_type)

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
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 via-orange-600 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
              <i className="fas fa-trophy text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Achievement Information</h3>
              <p className="text-sm text-gray-500 mt-1">Create or edit achievement details</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-tag text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, name: true }))}
                    required
                    placeholder="e.g., Month Warrior, Community Helper..."
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                      getFieldError('name')
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                        : 'border-gray-200 focus:ring-yellow-400 focus:border-yellow-400 bg-white hover:border-gray-300'
                    }`}
                  />
                </div>
                {getFieldError('name') && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {getFieldError('name')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icon <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-xl">{formData.icon || '🏆'}</span>
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => handleChange('icon', e.target.value)}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, icon: true }))}
                    required
                    placeholder="🏆 or emoji"
                    maxLength={2}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                      getFieldError('icon')
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                        : 'border-gray-200 focus:ring-yellow-400 focus:border-yellow-400 bg-white hover:border-gray-300'
                    }`}
                  />
                </div>
                {getFieldError('icon') && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {getFieldError('icon')}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Use emoji like 🏆, ⭐, 🎯, 🏅, 👑</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <i className="fas fa-align-left text-gray-400"></i>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, description: true }))}
                  required
                  rows="3"
                  placeholder="Describe what users need to do to unlock this achievement..."
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                    getFieldError('description')
                      ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-yellow-400 focus:border-yellow-400 bg-white hover:border-gray-300'
                  }`}
                />
              </div>
              {getFieldError('description') && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {getFieldError('description')}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none bg-white"
                  >
                    {ACHIEVEMENT_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-cog text-gray-400"></i>
                  </div>
                  <select
                    value={formData.condition_type}
                    onChange={(e) => handleChange('condition_type', e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none bg-white"
                  >
                    {CONDITION_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedConditionType && (
                  <p className="mt-1 text-xs text-gray-500">{selectedConditionType.description}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition Value <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-bullseye text-gray-400"></i>
                  </div>
                  <input
                    type="number"
                    value={formData.condition_value}
                    onChange={(e) => handleChange('condition_value', parseInt(e.target.value) || 0)}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, condition_value: true }))}
                    required
                    min="1"
                    placeholder="e.g., 30, 100, 1000..."
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                      getFieldError('condition_value')
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                        : 'border-gray-200 focus:ring-yellow-400 focus:border-yellow-400 bg-white hover:border-gray-300'
                    }`}
                  />
                </div>
                {getFieldError('condition_value') && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {getFieldError('condition_value')}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Target value to unlock</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  XP Reward <span className="text-gray-400 text-xs font-normal ml-2">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-star text-gray-400"></i>
                  </div>
                  <input
                    type="number"
                    value={formData.xp_reward}
                    onChange={(e) => handleChange('xp_reward', parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="0"
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                      getFieldError('xp_reward')
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                        : 'border-gray-200 focus:ring-yellow-400 focus:border-yellow-400 bg-white hover:border-gray-300'
                    }`}
                  />
                </div>
                {getFieldError('xp_reward') && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {getFieldError('xp_reward')}
                  </p>
                )}
              </div>

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
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white hover:border-gray-300"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
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
                  className="w-6 h-6 text-yellow-600 rounded focus:ring-yellow-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="ml-4 text-gray-700 font-semibold cursor-pointer">
                  Active (Achievement will be checked automatically)
                </label>
              </div>
              {!formData.is_active && (
                <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <p className="text-yellow-700 text-sm font-medium flex items-center">
                    <i className="fas fa-info-circle mr-2"></i>
                    Inactive achievements will not be checked or unlocked automatically.
                  </p>
                </div>
              )}
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
            className="px-8 py-3.5 bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  {achievement?._id ? 'Update Achievement' : 'Create Achievement'}
                </>
              )}
            </span>
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AchievementForm


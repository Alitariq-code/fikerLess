import { useState, useEffect, useRef } from 'react'
import api from '../../services/api'

const USER_TYPES = ['user', 'specialist', 'admin']

function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    username: '',
    user_type: 'user',
    is_email_verified: false,
    is_disabled: false,
  })
  const [loading, setLoading] = useState(false)
  const [touchedFields, setTouchedFields] = useState({})
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        username: user.username || '',
        user_type: user.user_type || 'user',
        is_email_verified: user.is_email_verified || false,
        is_disabled: user.is_disabled || false,
      })
      setTouchedFields({})
      setErrors({})
    } else {
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        username: '',
        user_type: 'user',
        is_email_verified: false,
        is_disabled: false,
      })
      setTouchedFields({})
      setErrors({})
    }
  }, [user])

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.user_type) {
      newErrors.user_type = 'User type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    
    // Mark all fields as touched
    setTouchedFields({
      email: true,
      user_type: true,
    })

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        email: formData.email.trim(),
        first_name: formData.first_name?.trim() || '',
        last_name: formData.last_name?.trim() || '',
        phone_number: formData.phone_number?.trim() || '',
        username: formData.username?.trim() || '',
        user_type: formData.user_type,
        is_email_verified: formData.is_email_verified,
        is_disabled: formData.is_disabled,
      }

      if (!user?._id) {
        setErrors({ submit: 'User ID is required' })
        setLoading(false)
        return
      }

      await api.put(`/users/admin/${user._id}`, payload)
      setSuccessMessage('User updated successfully!')

      // Wait a moment to show success message, then call onSave
      setTimeout(() => {
        onSave()
      }, 1000)
    } catch (error) {
      console.error('Error saving user:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save user'
      setErrors({ submit: errorMessage })
      setLoading(false)
    }
  }

  const getFieldError = (field) => {
    if (errors[field]) return errors[field]
    if (!touchedFields[field]) return null
    
    // Real-time validation
    if (field === 'email' && formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        return 'Please enter a valid email address'
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
        {/* Basic Information Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
              <i className="fas fa-user text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">User Information</h3>
              <p className="text-sm text-gray-500 mt-1">Edit user details and settings</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
                  required
                  placeholder="user@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    getFieldError('email')
                      ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400 bg-white hover:border-gray-300'
                  }`}
                />
              </div>
              {getFieldError('email') && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {getFieldError('email')}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder="First name"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder="Last name"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-phone text-gray-400"></i>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    placeholder="+1234567890"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-at text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="username"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  User Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-user-tag text-gray-400"></i>
                  </div>
                  <select
                    value={formData.user_type}
                    onChange={(e) => handleChange('user_type', e.target.value)}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, user_type: true }))}
                    required
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 appearance-none bg-white ${
                      getFieldError('user_type')
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                        : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400 hover:border-gray-300'
                    }`}
                  >
                    {USER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
                {getFieldError('user_type') && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center animate-fade-in">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {getFieldError('user_type')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Settings Section */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
              <i className="fas fa-cogs text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Status & Settings</h3>
              <p className="text-sm text-gray-500 mt-1">Manage user account status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  id="isEmailVerified"
                  checked={formData.is_email_verified}
                  onChange={(e) => handleChange('is_email_verified', e.target.checked)}
                  className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isEmailVerified" className="ml-4 text-gray-700 font-semibold cursor-pointer">
                  Email Verified
                </label>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                formData.is_email_verified
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
                {formData.is_email_verified ? 'Verified' : 'Not Verified'}
              </div>
            </div>

            <div className="flex items-center p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  id="isDisabled"
                  checked={formData.is_disabled}
                  onChange={(e) => handleChange('is_disabled', e.target.checked)}
                  className="w-6 h-6 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="isDisabled" className="ml-4 text-gray-700 font-semibold cursor-pointer">
                  Disable Account
                </label>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                formData.is_disabled
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {formData.is_disabled ? 'Disabled' : 'Active'}
              </div>
            </div>
          </div>

          {formData.is_disabled && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-sm font-medium flex items-center">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Disabled users will not be able to log in to the system.
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
            className="px-8 py-3.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>Update User
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

export default UserForm


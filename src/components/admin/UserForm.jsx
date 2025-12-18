import { useState, useEffect } from 'react'
import api from '../../services/api'

const USER_TYPES = ['user', 'specialist', 'admin']
const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other']
const RELATIONSHIP_STATUSES = ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed', 'Prefer not to say']
const YES_NO_OPTIONS = ['Yes', 'No', 'Prefer not to say']
const SEEING_PROFESSIONAL_OPTIONS = ['Yes, currently', 'Yes, previously', 'No', 'Prefer not to say']
const SUICIDAL_THOUGHTS_OPTIONS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Prefer not to say']
const EXERCISE_FREQUENCIES = ['Daily', 'Several times a week', 'Once a week', 'Rarely', 'Never', '3-4 times per week', '1-2 times per week', '5+ times per week', '2-3 times per week']
const SUBSTANCE_USE_OPTIONS = ['Never', 'Occasionally', 'Regularly', 'In recovery', 'Prefer not to say']
const SUPPORT_SYSTEMS = ['Family', 'Friends', 'Partner', 'Colleagues', 'No support system', 'Family and friends', 'Partner and close friends', 'Spouse', 'Therapist and support group', 'Online communities', 'Recovery group and sponsor', 'Other']
const THERAPIST_GENDER_OPTIONS = ['Male', 'Female', 'No preference', 'Prefer not to say']
const LANGUAGES = ['English', 'Urdu', 'Hindi', 'Other']
const WHAT_BRINGS_YOU_HERE_OPTIONS = [
  'Anxiety', 'Depression', 'Stress Management', 'Personal Growth', 'Trauma Healing',
  'Self-Care', 'Work-Life Balance', 'Social Anxiety', 'Parenting & Family',
  'Addiction Recovery', 'Relationship Issues', 'Grief & Loss', 'Career Counseling',
  'Sleep Issues', 'Eating Disorders', 'OCD', 'PTSD', 'Bipolar Disorder', 'Other'
]
const GOALS_OPTIONS = [
  'Manage anxiety', 'Improve mood', 'Reduce stress', 'Process trauma', 'Overcome social anxiety',
  'Build confidence', 'Develop coping strategies', 'Improve sleep', 'Build healthy habits',
  'Better work-life balance', 'Improve relationships', 'Self-care routine', 'Maintain sobriety',
  'Repair relationships', 'Parenting support', 'Manage family stress', 'Self-discovery',
  'Build resilience', 'Make friends', 'Other'
]
const DIAGNOSED_CONDITIONS_OPTIONS = [
  'Generalized Anxiety Disorder', 'Major Depressive Disorder', 'Social Anxiety Disorder',
  'Post-Traumatic Stress Disorder', 'Obsessive-Compulsive Disorder', 'Bipolar Disorder',
  'Panic Disorder', 'Eating Disorders', 'Substance Use Disorder', 'Alcohol Use Disorder',
  'Attention Deficit Hyperactivity Disorder (ADHD)', 'Borderline Personality Disorder',
  'Schizophrenia', 'Other'
]
const PREFERRED_SUPPORT_TYPE_OPTIONS = [
  'Individual Therapy', 'Group Therapy', 'Support Groups', 'Family Therapy',
  'Couples Therapy', 'Online Therapy', 'Mindfulness', 'Meditation', 'Self-help resources',
  'Trauma-focused therapy', 'Cognitive Behavioral Therapy (CBT)', 'Dialectical Behavior Therapy (DBT)',
  'Other'
]

// Specialist Profile Options
const SPECIALIZATIONS = [
  'Clinical Psychology', 'Counseling Psychology', 'Psychiatry', 'Social Work',
  'Marriage & Family Therapy', 'Addiction Counseling', 'Trauma Therapy', 'Child Psychology',
  'Adolescent Psychology', 'Geriatric Psychology', 'Cognitive Behavioral Therapy',
  'Dialectical Behavior Therapy', 'EMDR Therapy', 'Art Therapy', 'Music Therapy',
  'Occupational Therapy', 'Speech Therapy', 'Nutrition Counseling', 'Life Coaching', 'Other'
]

const SPECIALIST_CATEGORIES = [
  'Anxiety', 'Depression', 'Stress Management', 'Trauma Healing', 'Addiction Recovery',
  'Relationship Counseling', 'Family Therapy', 'Child & Adolescent', 'Grief & Loss',
  'Career Counseling', 'Eating Disorders', 'OCD', 'PTSD', 'Bipolar Disorder',
  'ADHD', 'Autism Spectrum', 'Sleep Disorders', 'Anger Management', 'Other'
]

const CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP', 'AED', 'SAR', 'INR', 'Other']

function UserForm({ user, onSave, onCancel }) {
  const isCreating = !user
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    username: '',
    user_type: 'user',
    is_email_verified: true,
    is_disabled: false,
    demographics: {
      age_range: '',
      gender_identity: '',
      country_of_residence: '',
      relationship_status: '',
      what_brings_you_here: [],
      other_reason: '',
      goals_for_using_app: [],
      mental_health_diagnosis: '',
      diagnosed_conditions: [],
      seeing_professional: '',
      suicidal_thoughts: '',
      exercise_frequency: '',
      substance_use: '',
      support_system: '',
      preferred_support_type: [],
      preferred_therapist_gender: '',
      preferred_language: '',
      understands_emergency_disclaimer: false,
    },
  })
  const [loading, setLoading] = useState(false)
  const [touchedFields, setTouchedFields] = useState({})
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [showDemographics, setShowDemographics] = useState(false)
  const [showSpecialistProfile, setShowSpecialistProfile] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordData, setPasswordData] = useState({
    new_password: '',
    confirm_password: '',
  })
  const [specialistProfile, setSpecialistProfile] = useState({
    full_name: '',
    designation: '',
    location: '',
    hourly_rate: '',
    currency: 'PKR',
    specializations: [],
    languages: [],
    categories: [],
    experience_years: '',
    profile_photo: '',
    education: [{ degree: '', institute_name: '' }],
    certifications: [{ certificate_title: '', provider: '' }],
    is_verified: false,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        username: user.username || '',
        user_type: user.user_type || 'user',
        is_email_verified: user.is_email_verified !== undefined ? user.is_email_verified : true,
        is_disabled: user.is_disabled || false,
        demographics: user.demographics || {
          age_range: '',
          gender_identity: '',
          country_of_residence: '',
          relationship_status: '',
          what_brings_you_here: [],
          other_reason: '',
          goals_for_using_app: [],
          mental_health_diagnosis: '',
          diagnosed_conditions: [],
          seeing_professional: '',
          suicidal_thoughts: '',
          exercise_frequency: '',
          substance_use: '',
          support_system: '',
          preferred_support_type: [],
          preferred_therapist_gender: '',
          preferred_language: '',
          understands_emergency_disclaimer: false,
        },
      })
      // Show demographics when editing if user is not specialist
      setShowDemographics(user.user_type !== 'specialist')
      setShowSpecialistProfile(user.user_type === 'specialist')
      setShowPasswordChange(false)
      setPasswordData({ new_password: '', confirm_password: '' })
    } else {
      // Reset when creating
      setShowDemographics(false)
      setShowSpecialistProfile(false)
      setShowPasswordChange(false)
      setPasswordData({ new_password: '', confirm_password: '' })
    }
  }, [user])

  useEffect(() => {
    // Auto-show specialist profile section when user type is specialist
    if (formData.user_type === 'specialist') {
      setShowSpecialistProfile(true)
    } else {
      setShowSpecialistProfile(false)
    }
  }, [formData.user_type])

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
    setFormData((prev) => ({ ...prev, [field]: value }))
    }
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

  const handleArrayChange = (field, value, checked) => {
    setFormData((prev) => {
      const currentArray = prev.demographics[field] || []
      const newArray = checked
        ? [...currentArray, value]
        : currentArray.filter((item) => item !== value)
      return {
        ...prev,
        demographics: {
          ...prev.demographics,
          [field]: newArray,
        },
      }
    })
  }

  const handleSpecialistArrayChange = (field, value, checked) => {
    setSpecialistProfile((prev) => {
      const currentArray = prev[field] || []
      const newArray = checked
        ? [...currentArray, value]
        : currentArray.filter((item) => item !== value)
      return {
        ...prev,
        [field]: newArray,
      }
    })
  }

  const handleSpecialistChange = (field, value) => {
    setSpecialistProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addEducation = () => {
    setSpecialistProfile((prev) => ({
      ...prev,
      education: [...prev.education, { degree: '', institute_name: '' }],
    }))
  }

  const removeEducation = (index) => {
    setSpecialistProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const updateEducation = (index, field, value) => {
    setSpecialistProfile((prev) => {
      const newEducation = [...prev.education]
      newEducation[index] = { ...newEducation[index], [field]: value }
      return { ...prev, education: newEducation }
    })
  }

  const addCertification = () => {
    setSpecialistProfile((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { certificate_title: '', provider: '' }],
    }))
  }

  const removeCertification = (index) => {
    setSpecialistProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const updateCertification = (index, field, value) => {
    setSpecialistProfile((prev) => {
      const newCertifications = [...prev.certifications]
      newCertifications[index] = { ...newCertifications[index], [field]: value }
      return { ...prev, certifications: newCertifications }
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (isCreating && !formData.password) {
      newErrors.password = 'Password is required'
    } else if (isCreating && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    // Password change validation
    if (!isCreating && showPasswordChange) {
      if (!passwordData.new_password) {
        newErrors.new_password = 'New password is required'
      } else if (passwordData.new_password.length < 6) {
        newErrors.new_password = 'Password must be at least 6 characters long'
      } else if (passwordData.new_password !== passwordData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match'
      }
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
    
    setTouchedFields({
      email: true,
      password: isCreating,
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

      if (isCreating) {
        payload.password = formData.password
        if (formData.user_type === 'specialist' && showSpecialistProfile) {
          payload.specialist_profile = {
            full_name: specialistProfile.full_name || `${formData.first_name} ${formData.last_name}`.trim() || formData.email,
            designation: specialistProfile.designation,
            location: specialistProfile.location,
            hourly_rate: specialistProfile.hourly_rate ? parseFloat(specialistProfile.hourly_rate) : 0,
            currency: specialistProfile.currency,
            specializations: specialistProfile.specializations,
            languages: specialistProfile.languages,
            categories: specialistProfile.categories,
            experience_years: specialistProfile.experience_years ? parseInt(specialistProfile.experience_years) : 0,
            profile_photo: specialistProfile.profile_photo,
            education: specialistProfile.education.filter(edu => edu.degree && edu.institute_name),
            certifications: specialistProfile.certifications.filter(cert => cert.certificate_title && cert.provider),
            is_verified: specialistProfile.is_verified,
          }
        } else if (formData.user_type !== 'specialist' && showDemographics) {
          payload.demographics = formData.demographics
        }
        await api.post('/users/admin', payload)
        setSuccessMessage('User created successfully!')
      } else {
        // Update mode - include password if changed
        if (showPasswordChange && passwordData.new_password) {
          payload.password = passwordData.new_password
        }
        // Include demographics if shown and user is not specialist
        if (formData.user_type !== 'specialist' && showDemographics) {
          payload.demographics = formData.demographics
        }
      await api.put(`/users/admin/${user._id}`, payload)
      setSuccessMessage('User updated successfully!')
      }

      setTimeout(() => {
        onSave()
      }, 1000)
    } catch (error) {
      console.error('Error saving user:', error)
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${isCreating ? 'create' : 'update'} user`
      setErrors({ submit: errorMessage })
      setLoading(false)
    }
  }

  const getFieldError = (field) => {
    if (errors[field]) return errors[field]
    if (!touchedFields[field]) return null
    
    if (field === 'email' && formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        return 'Please enter a valid email address'
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
        {/* Basic Information Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <i className="fas fa-user text-white text-lg sm:text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                {isCreating ? 'Create New User' : 'User Information'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {isCreating ? 'Add a new user to the system' : 'Edit user details and settings'}
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400 text-sm sm:text-base"></i>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
                  required
                    disabled={!isCreating}
                  placeholder="user@example.com"
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 text-sm sm:text-base ${
                    getFieldError('email')
                      ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400 bg-white hover:border-gray-300'
                    } ${!isCreating ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>
              {getFieldError('email') && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center animate-fade-in">
                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {getFieldError('email')}
                </p>
              )}
            </div>

              {isCreating && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400 text-sm sm:text-base"></i>
                    </div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))}
                      required
                      placeholder="Minimum 6 characters"
                      className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 text-sm sm:text-base ${
                        errors.password
                          ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                          : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400 bg-white hover:border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center animate-fade-in">
                      <i className="fas fa-exclamation-circle mr-1.5"></i>
                      {errors.password}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400 text-sm sm:text-base"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder="First name"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400 text-sm sm:text-base"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder="Last name"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-phone text-gray-400 text-sm sm:text-base"></i>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    placeholder="+1234567890"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-at text-gray-400 text-sm sm:text-base"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="username (auto-generated if empty)"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  User Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-user-tag text-gray-400 text-sm sm:text-base"></i>
                  </div>
                  <select
                    value={formData.user_type}
                    onChange={(e) => handleChange('user_type', e.target.value)}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, user_type: true }))}
                    required
                  className={`w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 appearance-none bg-white text-sm sm:text-base ${
                    errors.user_type
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
                <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              {errors.user_type && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center animate-fade-in">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                  {errors.user_type}
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Status Settings Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <i className="fas fa-cogs text-white text-lg sm:text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Status & Settings</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage user account status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-center p-4 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  id="isEmailVerified"
                  checked={formData.is_email_verified}
                  onChange={(e) => handleChange('is_email_verified', e.target.checked)}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isEmailVerified" className="ml-3 sm:ml-4 text-sm sm:text-base text-gray-700 font-semibold cursor-pointer">
                  Email Verified
                </label>
              </div>
              <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm ${
                formData.is_email_verified
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
                {formData.is_email_verified ? 'Verified' : 'Not Verified'}
              </div>
            </div>

            <div className="flex items-center p-4 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  id="isDisabled"
                  checked={formData.is_disabled}
                  onChange={(e) => handleChange('is_disabled', e.target.checked)}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="isDisabled" className="ml-3 sm:ml-4 text-sm sm:text-base text-gray-700 font-semibold cursor-pointer">
                  Disable Account
                </label>
              </div>
              <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm ${
                formData.is_disabled
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {formData.is_disabled ? 'Disabled' : 'Active'}
              </div>
            </div>
          </div>

          {formData.is_disabled && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-xs sm:text-sm font-medium flex items-center">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Disabled users will not be able to log in to the system.
              </p>
            </div>
          )}
        </div>

        {/* Password Change Section - Only for editing */}
        {!isCreating && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 via-red-600 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <i className="fas fa-key text-white text-lg sm:text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Change Password</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Update user password</p>
                </div>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPasswordChange}
                  onChange={(e) => {
                    setShowPasswordChange(e.target.checked)
                    if (!e.target.checked) {
                      setPasswordData({ new_password: '', confirm_password: '' })
                      setErrors((prev) => {
                        const newErrors = { ...prev }
                        delete newErrors.new_password
                        delete newErrors.confirm_password
                        return newErrors
                      })
                    }
                  }}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 rounded focus:ring-red-500"
                />
                <span className="ml-3 text-sm sm:text-base text-gray-700 font-semibold">Change Password</span>
              </label>
            </div>

            {showPasswordChange && (
              <div className="space-y-4 sm:space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-gray-400 text-sm sm:text-base"></i>
                      </div>
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => {
                          setPasswordData((prev) => ({ ...prev, new_password: e.target.value }))
                          if (errors.new_password) {
                            setErrors((prev) => {
                              const newErrors = { ...prev }
                              delete newErrors.new_password
                              return newErrors
                            })
                          }
                        }}
                        onBlur={() => {
                          setTouchedFields((prev) => ({ ...prev, new_password: true }))
                          if (passwordData.new_password && passwordData.new_password !== passwordData.confirm_password) {
                            setErrors((prev) => ({ ...prev, confirm_password: 'Passwords do not match' }))
                          }
                        }}
                        placeholder="Minimum 6 characters"
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 text-sm sm:text-base ${
                          errors.new_password
                            ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                            : 'border-gray-200 focus:ring-red-400 focus:border-red-400 bg-white hover:border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.new_password && (
                      <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center animate-fade-in">
                        <i className="fas fa-exclamation-circle mr-1.5"></i>
                        {errors.new_password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-gray-400 text-sm sm:text-base"></i>
                      </div>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => {
                          setPasswordData((prev) => ({ ...prev, confirm_password: e.target.value }))
                          if (errors.confirm_password) {
                            setErrors((prev) => {
                              const newErrors = { ...prev }
                              delete newErrors.confirm_password
                              return newErrors
                            })
                          }
                          // Check match in real-time
                          if (passwordData.new_password && e.target.value !== passwordData.new_password) {
                            setErrors((prev) => ({ ...prev, confirm_password: 'Passwords do not match' }))
                          } else if (passwordData.new_password && e.target.value === passwordData.new_password) {
                            setErrors((prev) => {
                              const newErrors = { ...prev }
                              delete newErrors.confirm_password
                              return newErrors
                            })
                          }
                        }}
                        onBlur={() => setTouchedFields((prev) => ({ ...prev, confirm_password: true }))}
                        placeholder="Confirm new password"
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 text-sm sm:text-base ${
                          errors.confirm_password
                            ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50'
                            : 'border-gray-200 focus:ring-red-400 focus:border-red-400 bg-white hover:border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.confirm_password && (
                      <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center animate-fade-in">
                        <i className="fas fa-exclamation-circle mr-1.5"></i>
                        {errors.confirm_password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <p className="text-yellow-800 text-xs sm:text-sm font-medium flex items-center">
                    <i className="fas fa-info-circle mr-2"></i>
                    Password will only be updated if both fields are filled and match.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Specialist Profile Section - Only for specialists */}
        {isCreating && formData.user_type === 'specialist' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <i className="fas fa-user-md text-white text-lg sm:text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Specialist Profile</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Add specialist profile information</p>
              </div>
            </div>

            {/* Completion Requirements Info */}
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-blue-600 mt-0.5 mr-3"></i>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Profile Completion Requirements:</p>
                  <ul className="text-xs sm:text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Full Name, Designation, and Location are required</li>
                    <li>At least <strong>1 Education entry</strong> (Degree + Institute Name) is required</li>
                    <li>At least <strong>1 Certification entry</strong> (Title + Provider) is required</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">
                    Profile will be marked as <strong>"Incomplete"</strong> if any of these are missing.
                  </p>
                </div>
              </div>
            </div>

            {showSpecialistProfile && (
              <div className="space-y-6 animate-fade-in">
                {/* Basic Information */}
                <div className="bg-indigo-50 rounded-xl p-4 sm:p-5 border-2 border-indigo-200">
                  <h4 className="text-lg font-bold text-indigo-800 mb-4 flex items-center">
                    <i className="fas fa-info-circle mr-2"></i>Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={specialistProfile.full_name}
                        onChange={(e) => handleSpecialistChange('full_name', e.target.value)}
                        placeholder="Full name"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Designation <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={specialistProfile.designation}
                        onChange={(e) => handleSpecialistChange('designation', e.target.value)}
                        placeholder="e.g., Clinical Psychologist, Counselor"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={specialistProfile.location}
                        onChange={(e) => handleSpecialistChange('location', e.target.value)}
                        placeholder="e.g., Karachi, Pakistan"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years)</label>
                      <input
                        type="number"
                        value={specialistProfile.experience_years}
                        onChange={(e) => handleSpecialistChange('experience_years', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        value={specialistProfile.hourly_rate}
                        onChange={(e) => handleSpecialistChange('hourly_rate', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Currency <span className="text-red-500">*</span></label>
                      <select
                        value={specialistProfile.currency}
                        onChange={(e) => handleSpecialistChange('currency', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr} value={curr}>{curr}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo URL</label>
                      <input
                        type="url"
                        value={specialistProfile.profile_photo}
                        onChange={(e) => handleSpecialistChange('profile_photo', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                      />
                    </div>

                    <div className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200">
                      <input
                        type="checkbox"
                        id="isVerified"
                        checked={specialistProfile.is_verified}
                        onChange={(e) => handleSpecialistChange('is_verified', e.target.checked)}
                        className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="isVerified" className="ml-3 text-sm sm:text-base text-gray-700 font-semibold cursor-pointer">
                        Verified Specialist
                      </label>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border-2 border-blue-200">
                  <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                    <i className="fas fa-star mr-2"></i>Specializations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {SPECIALIZATIONS.map((spec) => (
                      <label key={spec} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={specialistProfile.specializations.includes(spec)}
                          onChange={(e) => handleSpecialistArrayChange('specializations', spec, e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-green-50 rounded-xl p-4 sm:p-5 border-2 border-green-200">
                  <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                    <i className="fas fa-tags mr-2"></i>Categories
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {SPECIALIST_CATEGORIES.map((cat) => (
                      <label key={cat} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-green-400 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={specialistProfile.categories.includes(cat)}
                          onChange={(e) => handleSpecialistArrayChange('categories', cat, e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-yellow-50 rounded-xl p-4 sm:p-5 border-2 border-yellow-200">
                  <h4 className="text-lg font-bold text-yellow-800 mb-4 flex items-center">
                    <i className="fas fa-language mr-2"></i>Languages
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {LANGUAGES.map((lang) => (
                      <label key={lang} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-yellow-400 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={specialistProfile.languages.includes(lang)}
                          onChange={(e) => handleSpecialistArrayChange('languages', lang, e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 rounded focus:ring-yellow-500"
                        />
                        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="bg-purple-50 rounded-xl p-4 sm:p-5 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-purple-800 flex items-center">
                      <i className="fas fa-graduation-cap mr-2"></i>Education <span className="text-red-500 ml-2">*</span>
                      {specialistProfile.education.filter(edu => edu.degree && edu.institute_name).length === 0 && (
                        <span className="ml-2 text-xs text-red-600 font-normal">(Required - At least 1 entry needed)</span>
                      )}
                    </h4>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                    >
                      <i className="fas fa-plus mr-1"></i>Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {specialistProfile.education.map((edu, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-700">Education #{index + 1}</span>
                          {specialistProfile.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            placeholder="Degree (e.g., PhD, Masters)"
                            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                          />
                          <input
                            type="text"
                            value={edu.institute_name}
                            onChange={(e) => updateEducation(index, 'institute_name', e.target.value)}
                            placeholder="Institute Name"
                            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-teal-50 rounded-xl p-4 sm:p-5 border-2 border-teal-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-teal-800 flex items-center">
                      <i className="fas fa-certificate mr-2"></i>Certifications <span className="text-red-500 ml-2">*</span>
                      {specialistProfile.certifications.filter(cert => cert.certificate_title && cert.provider).length === 0 && (
                        <span className="ml-2 text-xs text-red-600 font-normal">(Required - At least 1 entry needed)</span>
                      )}
                    </h4>
                    <button
                      type="button"
                      onClick={addCertification}
                      className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
                    >
                      <i className="fas fa-plus mr-1"></i>Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {specialistProfile.certifications.map((cert, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-700">Certification #{index + 1}</span>
                          {specialistProfile.certifications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCertification(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={cert.certificate_title}
                            onChange={(e) => updateCertification(index, 'certificate_title', e.target.value)}
                            placeholder="Certificate Title"
                            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                          />
                          <input
                            type="text"
                            value={cert.provider}
                            onChange={(e) => updateCertification(index, 'provider', e.target.value)}
                            placeholder="Provider/Issuing Organization"
                            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Demographics Section - For regular users (create and edit) */}
        {formData.user_type !== 'specialist' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <i className="fas fa-user-circle text-white text-lg sm:text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {isCreating ? 'Demographics (Optional)' : 'Demographics'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {isCreating ? 'Add comprehensive demographic information' : 'Edit demographic information'}
                  </p>
                </div>
              </div>
              {isCreating && (
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDemographics}
                    onChange={(e) => setShowDemographics(e.target.checked)}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm sm:text-base text-gray-700 font-semibold">Add Demographics</span>
                </label>
              )}
            </div>

            {(showDemographics || !isCreating) && (
              <div className="space-y-6 animate-fade-in">
                {/* Basic Demographics */}
                <div className="bg-purple-50 rounded-xl p-4 sm:p-5 border-2 border-purple-200">
                  <h4 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                    <i className="fas fa-user mr-2"></i>Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Age Range</label>
                      <select
                        value={formData.demographics.age_range}
                        onChange={(e) => handleChange('demographics.age_range', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base"
                      >
                        <option value="">Select age range</option>
                        {AGE_RANGES.map((age) => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gender Identity</label>
                      <select
                        value={formData.demographics.gender_identity}
                        onChange={(e) => handleChange('demographics.gender_identity', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base"
                      >
                        <option value="">Select gender</option>
                        {GENDERS.map((gender) => (
                          <option key={gender} value={gender}>{gender}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country of Residence</label>
                      <input
                        type="text"
                        value={formData.demographics.country_of_residence}
                        onChange={(e) => handleChange('demographics.country_of_residence', e.target.value)}
                        placeholder="e.g., Pakistan, USA"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship Status</label>
                      <select
                        value={formData.demographics.relationship_status}
                        onChange={(e) => handleChange('demographics.relationship_status', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base"
                      >
                        <option value="">Select status</option>
                        {RELATIONSHIP_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Language</label>
                      <select
                        value={formData.demographics.preferred_language}
                        onChange={(e) => handleChange('demographics.preferred_language', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base"
                      >
                        <option value="">Select language</option>
                        {LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* What Brings You Here */}
                <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border-2 border-blue-200">
                  <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                    <i className="fas fa-question-circle mr-2"></i>What Brings You Here?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {WHAT_BRINGS_YOU_HERE_OPTIONS.map((option) => (
                      <label key={option} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.demographics.what_brings_you_here.includes(option)}
                          onChange={(e) => handleArrayChange('what_brings_you_here', option, e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Other Reason</label>
                    <input
                      type="text"
                      value={formData.demographics.other_reason}
                      onChange={(e) => handleChange('demographics.other_reason', e.target.value)}
                      placeholder="If other, please specify"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Goals */}
                <div className="bg-green-50 rounded-xl p-4 sm:p-5 border-2 border-green-200">
                  <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                    <i className="fas fa-bullseye mr-2"></i>Goals for Using App
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {GOALS_OPTIONS.map((goal) => (
                      <label key={goal} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-green-400 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.demographics.goals_for_using_app.includes(goal)}
                          onChange={(e) => handleArrayChange('goals_for_using_app', goal, e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mental Health Information */}
                <div className="bg-orange-50 rounded-xl p-4 sm:p-5 border-2 border-orange-200">
                  <h4 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
                    <i className="fas fa-heart mr-2"></i>Mental Health Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mental Health Diagnosis</label>
                      <input
                        type="text"
                        value={formData.demographics.mental_health_diagnosis}
                        onChange={(e) => handleChange('demographics.mental_health_diagnosis', e.target.value)}
                        placeholder="e.g., Anxiety Disorder, None"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Seeing Professional</label>
                      <select
                        value={formData.demographics.seeing_professional}
                        onChange={(e) => handleChange('demographics.seeing_professional', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                      >
                        <option value="">Select option</option>
                        {SEEING_PROFESSIONAL_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Suicidal Thoughts</label>
                      <select
                        value={formData.demographics.suicidal_thoughts}
                        onChange={(e) => handleChange('demographics.suicidal_thoughts', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                      >
                        <option value="">Select option</option>
                        {SUICIDAL_THOUGHTS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnosed Conditions</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {DIAGNOSED_CONDITIONS_OPTIONS.map((condition) => (
                        <label key={condition} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-400 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.demographics.diagnosed_conditions.includes(condition)}
                            onChange={(e) => handleArrayChange('diagnosed_conditions', condition, e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 rounded focus:ring-orange-500"
                          />
                          <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lifestyle & Support */}
                <div className="bg-teal-50 rounded-xl p-4 sm:p-5 border-2 border-teal-200">
                  <h4 className="text-lg font-bold text-teal-800 mb-4 flex items-center">
                    <i className="fas fa-running mr-2"></i>Lifestyle & Support
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Exercise Frequency</label>
                      <select
                        value={formData.demographics.exercise_frequency}
                        onChange={(e) => handleChange('demographics.exercise_frequency', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                      >
                        <option value="">Select frequency</option>
                        {EXERCISE_FREQUENCIES.map((freq) => (
                          <option key={freq} value={freq}>{freq}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Substance Use</label>
                      <select
                        value={formData.demographics.substance_use}
                        onChange={(e) => handleChange('demographics.substance_use', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                      >
                        <option value="">Select option</option>
                        {SUBSTANCE_USE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Support System</label>
                      <select
                        value={formData.demographics.support_system}
                        onChange={(e) => handleChange('demographics.support_system', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                      >
                        <option value="">Select option</option>
                        {SUPPORT_SYSTEMS.map((system) => (
                          <option key={system} value={system}>{system}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Therapist Gender</label>
                      <select
                        value={formData.demographics.preferred_therapist_gender}
                        onChange={(e) => handleChange('demographics.preferred_therapist_gender', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                      >
                        <option value="">Select preference</option>
                        {THERAPIST_GENDER_OPTIONS.map((gender) => (
                          <option key={gender} value={gender}>{gender}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Support Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {PREFERRED_SUPPORT_TYPE_OPTIONS.map((type) => (
                        <label key={type} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-teal-400 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.demographics.preferred_support_type.includes(type)}
                            onChange={(e) => handleArrayChange('preferred_support_type', type, e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 rounded focus:ring-teal-500"
                          />
                          <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Emergency Disclaimer */}
                <div className="p-4 sm:p-5 bg-red-50 rounded-xl border-2 border-red-200">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.demographics.understands_emergency_disclaimer}
                      onChange={(e) => handleChange('demographics.understands_emergency_disclaimer', e.target.checked)}
                      className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 rounded focus:ring-red-500 mt-0.5"
                    />
                    <div className="ml-3">
                      <span className="text-sm sm:text-base text-gray-700 font-semibold block">
                        User understands emergency disclaimer
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 mt-1 block">
                        User acknowledges understanding of emergency procedures and disclaimers
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
          >
            <i className="fas fa-times mr-2"></i>Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group text-sm sm:text-base"
          >
            <span className="relative z-10 flex items-center">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>{isCreating ? 'Creating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <i className={`fas ${isCreating ? 'fa-plus' : 'fa-save'} mr-2`}></i>
                  {isCreating ? 'Create User' : 'Update User'}
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

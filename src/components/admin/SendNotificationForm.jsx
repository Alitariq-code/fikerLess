import { useState, useEffect } from 'react'
import api from '../../services/api'

function SendNotificationForm({ onSend, onCancel }) {
  const [formData, setFormData] = useState({
    template_id: '',
    title: '',
    body: '',
    type: 'general',
    cta_text: '',
    cta_url: '',
    send_mode: 'single', // 'single' or 'broadcast'
    user_id: '',
    send_to_all: false,
    user_ids: [],
  })
  const [templates, setTemplates] = useState([])
  const [users, setUsers] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loading, setLoading] = useState(false)
  const [touchedFields, setTouchedFields] = useState({})
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)

  useEffect(() => {
    fetchTemplates()
    fetchUsers()
  }, [])

  const fetchTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const response = await api.get('/notifications/admin/templates/all', {
        params: { page: 1, limit: 1000, is_active: 'true' },
      })
      if (response.data.success) {
        setTemplates(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoadingTemplates(false)
    }
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await api.get('/users/admin/all', {
        params: { page: 1, limit: 1000 },
      })
      if (response.data.success) {
        setUsers(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      template_id: template._id,
      title: template.title || '',
      body: template.body || '',
      type: template.type || 'general',
      cta_text: template.cta_text || '',
      cta_url: template.cta_url || '',
    }))
    setShowTemplateDropdown(false)
    setTouchedFields(prev => ({ ...prev, template_id: true }))
  }

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

  const handleUserSelect = (user) => {
    if (formData.send_mode === 'single') {
      handleChange('user_id', user._id)
      setUserSearch(`${user.email} (${user.first_name} ${user.last_name})`)
      setShowUserDropdown(false)
    } else {
      const currentIds = formData.user_ids || []
      if (!currentIds.includes(user._id)) {
        handleChange('user_ids', [...currentIds, user._id])
      }
      setUserSearch('')
    }
  }

  const handleRemoveUser = (userId) => {
    handleChange('user_ids', formData.user_ids.filter(id => id !== userId))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Body is required'
    }

    if (formData.send_mode === 'single' && !formData.user_id) {
      newErrors.user_id = 'Please select a user'
    }

    if (formData.send_mode === 'broadcast' && !formData.send_to_all && (!formData.user_ids || formData.user_ids.length === 0)) {
      newErrors.user_ids = 'Please select at least one user or select "Send to All"'
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
      user_id: true,
      user_ids: true,
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
      }

      if (formData.send_mode === 'single') {
        payload.user_id = formData.user_id
      } else {
        if (formData.send_to_all) {
          payload.send_to_all = true
        } else {
          payload.user_ids = formData.user_ids
        }
      }

      const response = await api.post('/notifications/admin/send', payload)
      setSuccessMessage(response.data.message || 'Notification sent successfully!')
      
      setTimeout(() => {
        onSend()
      }, 1500)
    } catch (error) {
      console.error('Error sending notification:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send notification'
      setErrors({ submit: errorMessage })
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    // Filter out disabled users
    if (user.is_disabled) return false
    
    // If no search term, show all users (when dropdown is open)
    if (!userSearch || userSearch.trim() === '') {
      return true
    }
    
    // Filter by search term
    const searchLower = userSearch.toLowerCase().trim()
    const email = (user.email || '').toLowerCase()
    const firstName = (user.first_name || '').toLowerCase()
    const lastName = (user.last_name || '').toLowerCase()
    const username = (user.username || '').toLowerCase()
    return email.includes(searchLower) || 
           firstName.includes(searchLower) || 
           lastName.includes(searchLower) ||
           username.includes(searchLower)
  })

  const selectedUsers = users.filter(user => 
    formData.send_mode === 'single' 
      ? user._id === formData.user_id
      : formData.user_ids.includes(user._id)
  )

  const selectedTemplate = templates.find(t => t._id === formData.template_id)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowTemplateDropdown(false)
        setShowUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <i className="fas fa-paper-plane text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Send Notification</h3>
              <p className="text-sm text-gray-500 mt-1">Send a notification to one user or broadcast to multiple users</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Template Selection */}
            <div className="dropdown-container">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-file-alt mr-2 text-blue-500"></i>
                Select Template <span className="text-gray-400 text-xs font-normal ml-2">(Optional - will auto-fill fields)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-bell text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={selectedTemplate ? selectedTemplate.title : ''}
                  onChange={(e) => {
                    if (!e.target.value) {
                      handleChange('template_id', '')
                      handleChange('title', '')
                      handleChange('body', '')
                      handleChange('type', 'general')
                      handleChange('cta_text', '')
                      handleChange('cta_url', '')
                    }
                    setShowTemplateDropdown(true)
                  }}
                  onFocus={() => setShowTemplateDropdown(true)}
                  placeholder="Search and select a template..."
                  className="w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
                {formData.template_id && (
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('template_id', '')
                      handleChange('title', '')
                      handleChange('body', '')
                      handleChange('type', 'general')
                      handleChange('cta_text', '')
                      handleChange('cta_url', '')
                      setShowTemplateDropdown(false)
                    }}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
                {showTemplateDropdown && (
                  <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {loadingTemplates ? (
                      <div className="p-4 text-center text-gray-500">
                        <i className="fas fa-spinner fa-spin mr-2"></i>Loading templates...
                      </div>
                    ) : templates.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No templates available</div>
                    ) : (
                      templates.map(template => (
                        <button
                          key={template._id}
                          type="button"
                          onClick={() => handleTemplateSelect(template)}
                          className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="font-semibold text-gray-900">{template.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1 mt-1">{template.body}</div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              {template.type || 'general'}
                            </span>
                            {template.is_active && (
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded ml-2">
                                Active
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {selectedTemplate && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{selectedTemplate.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{selectedTemplate.body}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleChange('template_id', '')
                        handleChange('title', '')
                        handleChange('body', '')
                        handleChange('type', 'general')
                        handleChange('cta_text', '')
                        handleChange('cta_url', '')
                      }}
                      className="ml-3 text-red-600 hover:text-red-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                maxLength={100}
                placeholder="Enter notification title..."
                className={`w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
                }`}
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Body <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => handleChange('body', e.target.value)}
                required
                rows="4"
                maxLength={200}
                placeholder="Enter notification message..."
                className={`w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                  errors.body ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
                }`}
              />
              {errors.body && (
                <p className="mt-1.5 text-sm text-red-600">{errors.body}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{formData.body.length}/200 characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  placeholder="e.g., general, forum..."
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Send Mode <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    handleChange('send_mode', 'single')
                    handleChange('user_id', '')
                    handleChange('user_ids', [])
                    handleChange('send_to_all', false)
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.send_mode === 'single'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="fas fa-user mr-2"></i>
                  Single User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleChange('send_mode', 'broadcast')
                    handleChange('user_id', '')
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.send_mode === 'broadcast'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="fas fa-bullhorn mr-2"></i>
                  Broadcast
                </button>
              </div>
            </div>

            {formData.send_mode === 'single' && (
              <div className="dropdown-container">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-user mr-2 text-green-500"></i>
                  Select User <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value)
                      setShowUserDropdown(true)
                    }}
                    onFocus={() => {
                      setShowUserDropdown(true)
                      if (!userSearch && !formData.user_id) {
                        setUserSearch('')
                      }
                    }}
                    placeholder="Search users by email, name, or username..."
                    className={`w-full pl-12 pr-10 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.user_id ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
                    }`}
                  />
                  {formData.user_id && (
                    <button
                      type="button"
                      onClick={() => {
                        handleChange('user_id', '')
                        setUserSearch('')
                        setShowUserDropdown(false)
                      }}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                  {showUserDropdown && (
                    <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {loadingUsers ? (
                        <div className="p-4 text-center text-gray-500">
                          <i className="fas fa-spinner fa-spin mr-2"></i>Loading users...
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          {userSearch ? 'No users found matching your search' : 'No users available'}
                        </div>
                      ) : (
                        <>
                          {!userSearch && (
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-semibold">
                              {filteredUsers.length} users available - Start typing to search
                            </div>
                          )}
                          {filteredUsers.slice(0, 20).map(user => (
                            <button
                              key={user._id}
                              type="button"
                              onClick={() => handleUserSelect(user)}
                              className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="font-semibold text-gray-900">{user.email}</div>
                              <div className="text-sm text-gray-500">
                                {user.first_name} {user.last_name}
                                {user.username && ` (@${user.username})`}
                              </div>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
                {selectedUsers.length > 0 && (
                  <div className="mt-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 flex items-center">
                          <i className="fas fa-check-circle text-green-600 mr-2"></i>
                          {selectedUsers[0].email}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {selectedUsers[0].first_name} {selectedUsers[0].last_name}
                          {selectedUsers[0].username && ` (@${selectedUsers[0].username})`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleChange('user_id', '')
                          setUserSearch('')
                        }}
                        className="ml-3 text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                )}
                {errors.user_id && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {errors.user_id}
                  </p>
                )}
              </div>
            )}

            {formData.send_mode === 'broadcast' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-users mr-2 text-green-500"></i>
                  Recipients <span className="text-red-500">*</span>
                </label>
                <div className="mb-4">
                  <label className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.send_to_all}
                      onChange={(e) => {
                        handleChange('send_to_all', e.target.checked)
                        if (e.target.checked) {
                          handleChange('user_ids', [])
                          setUserSearch('')
                        }
                      }}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <span className="ml-3 font-semibold text-gray-700 flex items-center">
                      <i className="fas fa-bullhorn mr-2 text-blue-600"></i>
                      Send to All Users
                      {formData.send_to_all && (
                        <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          {users.filter(u => !u.is_disabled).length} users
                        </span>
                      )}
                    </span>
                  </label>
                </div>
                {!formData.send_to_all && (
                  <div className="dropdown-container">
                    <div className="relative mb-3">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => {
                          setUserSearch(e.target.value)
                          setShowUserDropdown(true)
                        }}
                        onFocus={() => setShowUserDropdown(true)}
                        placeholder="Search and select users..."
                        className={`w-full pl-12 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.user_ids ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
                        }`}
                      />
                      {showUserDropdown && (
                        <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {loadingUsers ? (
                            <div className="p-4 text-center text-gray-500">
                              <i className="fas fa-spinner fa-spin mr-2"></i>Loading users...
                            </div>
                          ) : filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              {userSearch ? 'No users found matching your search' : 'No users available'}
                            </div>
                          ) : (
                            <>
                              {!userSearch && (
                                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-semibold">
                                  {filteredUsers.length} users available - Start typing to search
                                </div>
                              )}
                              {filteredUsers.slice(0, 20).map(user => (
                                <button
                                  key={user._id}
                                  type="button"
                                  onClick={() => handleUserSelect(user)}
                                  disabled={formData.user_ids.includes(user._id)}
                                  className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <div className="font-semibold text-gray-900">{user.email}</div>
                                  <div className="text-sm text-gray-500">
                                    {user.first_name} {user.last_name}
                                    {user.username && ` (@${user.username})`}
                                  </div>
                                  {formData.user_ids.includes(user._id) && (
                                    <div className="text-xs text-green-600 mt-1">
                                      <i className="fas fa-check-circle mr-1"></i>Already selected
                                    </div>
                                  )}
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedUsers.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        <div className="text-sm text-gray-600 mb-2 font-semibold">
                          Selected Users ({selectedUsers.length}):
                        </div>
                        {selectedUsers.map(user => (
                          <div key={user._id} className="flex items-center justify-between p-3 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{user.email}</div>
                              <div className="text-sm text-gray-600">
                                {user.first_name} {user.last_name}
                                {user.username && ` (@${user.username})`}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveUser(user._id)}
                              className="ml-3 text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.user_ids && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <i className="fas fa-exclamation-circle mr-1.5"></i>
                        {errors.user_ids}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CTA Text <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.cta_text}
                  onChange={(e) => handleChange('cta_text', e.target.value)}
                  placeholder="e.g., View Details..."
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CTA URL <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.cta_url}
                  onChange={(e) => handleChange('cta_url', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
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
            className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <i className="fas fa-times mr-2"></i>Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                Send Notification
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SendNotificationForm


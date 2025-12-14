import { useState, useRef, useEffect } from 'react'

function ImageUpload({ images = [], onChange, maxImages = 10, label = 'Upload Images' }) {
  const [uploading, setUploading] = useState(false)
  const [previewImages, setPreviewImages] = useState(() => {
    // Initialize with images prop
    return Array.isArray(images) ? [...images] : []
  })
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // Sync previewImages with images prop when it changes (for edit mode)
  // Use a ref to track if this is the initial mount to avoid calling onChange on mount
  const isInitialMount = useRef(true)
  const previousImagesRef = useRef(JSON.stringify(images))
  
  useEffect(() => {
    const currentImagesStr = JSON.stringify(images)
    const previousImagesStr = previousImagesRef.current
    
    // Only update if images actually changed
    if (currentImagesStr !== previousImagesStr) {
      if (Array.isArray(images)) {
        setPreviewImages([...images])
      } else {
        setPreviewImages([])
      }
      previousImagesRef.current = currentImagesStr
    }
    
    // Mark initial mount as complete after first render
    if (isInitialMount.current) {
      isInitialMount.current = false
    }
  }, [images])

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api/v1'

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Check max images limit
    if (previewImages.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images. You currently have ${previewImages.length} images.`)
      return
    }

    // Validate file types and sizes
    const validFiles = []
    const invalidFiles = []

    files.forEach((file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name}: Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.`)
      } else if (file.size > maxSize) {
        invalidFiles.push(`${file.name}: File size exceeds 5MB limit.`)
      } else {
        validFiles.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      setError(invalidFiles.join('\n'))
      return
    }

    if (validFiles.length === 0) return

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      validFiles.forEach((file) => {
        formData.append('images', file)
      })

      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/upload/images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload images')
      }

      if (data.success && data.files) {
        const newImageUrls = data.files.map((file) => file.url)
        const updatedImages = [...previewImages, ...newImageUrls]
        setPreviewImages(updatedImages)
        onChange(updatedImages)
      }
    } catch (err) {
      console.error('Error uploading images:', err)
      setError(err.message || 'Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index) => {
    const updatedImages = previewImages.filter((_, i) => i !== index)
    setPreviewImages(updatedImages)
    onChange(updatedImages)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const fakeEvent = { target: { files } }
      handleFileSelect(fakeEvent)
    }
  }

  const getImageUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    // If it's a relative URL, prepend the API base URL
    const baseUrl = API_BASE_URL.replace('/api/v1', '')
    return `${baseUrl}${url}`
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {maxImages > 1 && <span className="text-gray-500 font-normal">(Max {maxImages})</span>}
      </label>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          uploading
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          disabled={uploading || previewImages.length >= maxImages}
          className="hidden"
          id="image-upload-input"
        />
        <label
          htmlFor="image-upload-input"
          className={`cursor-pointer flex flex-col items-center justify-center ${
            uploading || previewImages.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <>
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700 font-medium">Uploading images...</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <i className="fas fa-cloud-upload-alt text-white text-2xl"></i>
              </div>
              <p className="text-gray-700 font-semibold mb-2">
                {previewImages.length >= maxImages
                  ? `Maximum ${maxImages} images reached`
                  : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, GIF, WebP up to 5MB each
              </p>
              {previewImages.length > 0 && (
                <p className="text-sm text-blue-600 mt-2">
                  {previewImages.length} of {maxImages} images uploaded
                </p>
              )}
            </>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-down">
          <div className="flex items-start">
            <i className="fas fa-exclamation-circle text-red-500 mt-0.5 mr-3"></i>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">Upload Error</p>
              <p className="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previewImages.map((url, index) => (
            <div
              key={index}
              className="relative group bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-200"
            >
              <img
                src={getImageUrl(url)}
                alt={`Preview ${index + 1}`}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'
                }}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-110 shadow-lg z-10"
                title="Remove image"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {previewImages.length === 0 && !uploading && (
        <p className="text-sm text-gray-500 text-center">
          <i className="fas fa-info-circle mr-1"></i>
          You can upload multiple images at once. Images will be saved to the server.
        </p>
      )}
    </div>
  )
}

export default ImageUpload


import { useState } from 'react'

function CommentCreate({ 
  onSave, 
  onCancel, 
  actionLoading,
  parentCommentId = null,
  parentCommentAuthor = null,
  placeholder = null
}) {
  const [content, setContent] = useState('')

  const handleSubmit = async () => {
    if (content.trim().length >= 1) {
      await onSave(content.trim())
      setContent('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-blue-200 shadow-sm ${parentCommentId ? 'ml-8 mt-4' : ''}`}>
      {parentCommentId && parentCommentAuthor && (
        <div className="mb-3 px-3 py-2 bg-white rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 flex items-center">
            <i className="fas fa-reply mr-2 text-blue-600"></i>
            Replying to <span className="font-semibold text-gray-900 ml-1">{parentCommentAuthor}</span>
          </p>
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
          <i className="fas fa-user-shield"></i>
        </div>
        <div className="flex-1">
          <div className="mb-3 flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs font-bold shadow-sm">
              <i className="fas fa-check-circle mr-1.5"></i>Admin
            </span>
            <span className="text-xs text-gray-600">Your comment will be marked as verified</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || (parentCommentId ? "Write a reply to this comment..." : "Write a comment... Share your thoughts, ask questions, or provide support.")}
            className="w-full p-4 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-white shadow-sm"
            rows="4"
            maxLength={1000}
          />
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center">
                <i className="fas fa-info-circle mr-1"></i>
                {content.length} / 1000 characters
              </span>
              <span className="flex items-center">
                <i className="fas fa-keyboard mr-1"></i>
                Press Ctrl+Enter to submit
              </span>
            </div>
            <div className="flex items-center justify-end space-x-2">
              {parentCommentId && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
                >
                  <i className="fas fa-times mr-1.5"></i>Cancel
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={actionLoading === 'create-comment' || content.trim().length < 1}
                className="px-5 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
              >
                {actionLoading === 'create-comment' ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Posting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    {parentCommentId ? 'Post Reply' : 'Post Comment'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentCreate

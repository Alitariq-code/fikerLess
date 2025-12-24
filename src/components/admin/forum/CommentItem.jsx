import { useState } from 'react'
import CommentCreate from './CommentCreate'

// Helper function to count all nested replies recursively
const countAllReplies = (comment) => {
  if (!comment.replies || comment.replies.length === 0) return 0
  return comment.replies.length + comment.replies.reduce((sum, reply) => sum + countAllReplies(reply), 0)
}

function CommentItem({ 
  comment, 
  isEditing, 
  editingContent, 
  onEditStart, 
  onEditCancel, 
  onEditSave, 
  onDelete,
  onCreateReply,
  actionLoading,
  formatDate,
  depth = 0,
  isLastChild = false,
  hasSiblingAfter = false
}) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  // Only root level comments (depth 0) are expanded by default
  // Nested replies are collapsed by default to show only immediate children
  const [isRepliesExpanded, setIsRepliesExpanded] = useState(depth === 0) 
  const isReply = depth > 0
  const hasReplies = comment.replies && comment.replies.length > 0
  const totalRepliesCount = hasReplies ? countAllReplies(comment) : 0

  return (
    <div className="relative">
      <div className="flex items-start">
        {/* Tree Structure - Visual Connectors (Like Facebook) */}
        {isReply && (
          <div className="relative flex-shrink-0" style={{ width: '2.5rem' }}>
            {/* Vertical line going up to parent */}
            <div 
              className="absolute top-0 w-0.5 bg-gray-300"
              style={{ 
                height: '1.5rem',
                left: '1rem'
              }}
            />
            {/* Horizontal line connecting to comment */}
            <div 
              className="absolute top-6 w-5 h-0.5 bg-gray-300"
              style={{ 
                left: '1rem'
              }}
            />
            {/* Vertical line going down through siblings (if has sibling after) */}
            {hasSiblingAfter && (
              <div 
                className="absolute w-0.5 bg-gray-300"
                style={{ 
                  top: '1.5rem',
                  bottom: '-2rem',
                  left: '1rem'
                }}
              />
            )}
          </div>
        )}

        {/* Main Comment Card */}
        <div className="flex-1 min-w-0">
          <div
            className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 ${
              !isReply ? 'shadow-sm' : ''
            }`}
          >
            <div className="p-4">
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editingContent}
                    onChange={(e) => onEditStart({ ...comment, content: e.target.value })}
                    className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows="4"
                    placeholder="Edit your comment..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={onEditSave}
                      disabled={actionLoading === `save-comment-${comment._id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium text-sm shadow-sm"
                    >
                      {actionLoading === `save-comment-${comment._id}` ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check mr-2"></i>Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={onEditCancel}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                    >
                      <i className="fas fa-times mr-2"></i>Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {comment.user && (
                        <>
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {comment.user.first_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <p className="font-semibold text-gray-900 text-sm">
                                {comment.user.first_name || comment.user.last_name 
                                  ? `${comment.user.first_name} ${comment.user.last_name}`.trim()
                                  : comment.user.username 
                                    ? `@${comment.user.username}`
                                    : 'User'
                                }
                              </p>
                              {comment.user.username && (comment.user.first_name || comment.user.last_name) && (
                                <span className="text-gray-500 text-xs font-normal">(@{comment.user.username})</span>
                              )}
                              {comment.admin_comment && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs font-bold flex items-center shadow-sm" title="Verified Admin Comment">
                                  <i className="fas fa-check-circle mr-1 text-xs"></i>Admin
                                </span>
                              )}
                              {isReply && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                  <i className="fas fa-reply mr-1 text-xs"></i>Reply
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatDate(comment.created_at)}
                              {comment.likes_count > 0 && (
                                <span className="ml-2">
                                  <i className="fas fa-heart text-red-500 mr-1"></i>
                                  {comment.likes_count}
                                </span>
                              )}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-1 ml-3 flex-shrink-0">
                      {onCreateReply && (
                        <button
                          onClick={() => setShowReplyForm(!showReplyForm)}
                          className={`px-3 py-1.5 rounded-md transition-all duration-200 text-xs font-medium ${
                            showReplyForm 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          title="Reply to this comment"
                        >
                          <i className={`fas ${showReplyForm ? 'fa-times' : 'fa-reply'} mr-1`}></i>
                          {showReplyForm ? 'Cancel' : 'Reply'}
                        </button>
                      )}
                      <button
                        onClick={() => onEditStart(comment)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs font-medium"
                        title="Edit comment"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => onDelete(comment._id)}
                        disabled={actionLoading === `delete-comment-${comment._id}`}
                        className="px-3 py-1.5 bg-gray-100 text-red-600 rounded-md hover:bg-red-50 transition-colors text-xs font-medium disabled:opacity-50"
                        title="Delete comment"
                      >
                        {actionLoading === `delete-comment-${comment._id}` ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Comment Content */}
                  <div className="mb-3">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  
                  {/* Facebook-Style Replies Toggle Button */}
                  {hasReplies && (
                    <div className="mt-2">
                      <button
                        onClick={() => setIsRepliesExpanded(!isRepliesExpanded)}
                        className="group flex items-center space-x-1.5 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200 py-1 px-2 -ml-2 rounded-md hover:bg-gray-50 active:bg-gray-100"
                      >
                        <div className="flex items-center justify-center w-5 h-5 rounded-full transition-colors">
                          <i 
                            className={`fas fa-chevron-${isRepliesExpanded ? 'down' : 'right'} text-xs transition-all duration-300 ${
                              isRepliesExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                            }`}
                            style={{
                              transform: isRepliesExpanded ? 'rotate(0deg)' : 'rotate(0deg)',
                              fontSize: '10px'
                            }}
                          ></i>
                        </div>
                        <span className="flex items-center space-x-1">
                          <span className="text-blue-600 font-semibold">{totalRepliesCount}</span>
                          <span className="text-gray-600 font-normal">{totalRepliesCount === 1 ? 'reply' : 'replies'}</span>
                        </span>
                        {isRepliesExpanded && (
                          <>
                            <span className="text-gray-300 mx-0.5 font-light">·</span>
                            <span className="text-gray-500 text-xs font-normal">Hide replies</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Reply Form */}
                  {showReplyForm && onCreateReply && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <CommentCreate
                        onSave={async (content) => {
                          await onCreateReply(content, comment._id)
                          setShowReplyForm(false)
                        }}
                        onCancel={() => setShowReplyForm(false)}
                        actionLoading={actionLoading}
                        parentCommentId={comment._id}
                        parentCommentAuthor={comment.user 
                          ? (comment.user.first_name || comment.user.last_name 
                              ? `${comment.user.first_name} ${comment.user.last_name}`.trim()
                              : comment.user.username 
                                ? `@${comment.user.username}`
                                : 'User')
                          : 'User'}
                        placeholder={`Reply to ${comment.user 
                          ? (comment.user.first_name || comment.user.last_name 
                              ? `${comment.user.first_name} ${comment.user.last_name}`.trim()
                              : comment.user.username 
                                ? `@${comment.user.username}`
                                : 'this comment')
                          : 'this comment'}...`}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Render nested replies - Tree Structure with Collapsible */}
          {hasReplies && (
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isRepliesExpanded ? 'max-h-[50000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="relative mt-2">
                {/* Vertical connector line for replies */}
                {isRepliesExpanded && comment.replies.length > 0 && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"
                    style={{ 
                      left: '1.25rem'
                    }}
                  />
                )}
                <div className="space-y-2 pl-10">
                  {comment.replies.map((reply, index) => {
                    const isLastReply = index === comment.replies.length - 1
                    const hasSiblingAfterReply = !isLastReply
                    
                    return (
                      <div key={reply._id} className="relative">
                        <CommentItem
                          comment={reply}
                          isEditing={isEditing && editingContent?._id === reply._id}
                          editingContent={editingContent?.content}
                          onEditStart={onEditStart}
                          onEditCancel={onEditCancel}
                          onEditSave={onEditSave}
                          onDelete={onDelete}
                          onCreateReply={onCreateReply}
                          actionLoading={actionLoading}
                          formatDate={formatDate}
                          depth={depth + 1}
                          isLastChild={isLastReply}
                          hasSiblingAfter={hasSiblingAfterReply}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentItem

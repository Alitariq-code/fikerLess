import { useState, useMemo } from 'react'
import CommentItem from './CommentItem'
import CommentCreate from './CommentCreate'

function ForumComments({ 
  comments, 
  loading, 
  onEditComment, 
  onSaveComment, 
  onDeleteComment,
  onCreateComment,
  actionLoading,
  formatDate 
}) {
  const [editingComment, setEditingComment] = useState(null)

  // Organize comments into nested structure (supports unlimited nesting)
  const organizedComments = useMemo(() => {
    if (!comments || comments.length === 0) return []
    
    const commentMap = new Map()
    const rootComments = []
    
    // Helper function to extract parent_comment_id as a string
    const extractParentId = (parentCommentId) => {
      if (!parentCommentId) return null
      if (typeof parentCommentId === 'string') {
        // Check if it's a malformed stringified object (contains "ObjectId" or "{")
        if (parentCommentId.includes('ObjectId') || parentCommentId.startsWith('{')) {
          // Try to extract the ObjectId from the string
          const match = parentCommentId.match(/ObjectId\("([^"]+)"\)/)
          if (match && match[1]) {
            return match[1]
          }
          // Try to extract from JSON-like string
          const jsonMatch = parentCommentId.match(/"_id":\s*"([^"]+)"/)
          if (jsonMatch && jsonMatch[1]) {
            return jsonMatch[1]
          }
          return null // Invalid format
        }
        return parentCommentId
      }
      // If it's an object, try to get _id
      if (parentCommentId._id) {
        return typeof parentCommentId._id === 'string' ? parentCommentId._id : parentCommentId._id.toString()
      }
      // If it has toString method, use it
      if (typeof parentCommentId.toString === 'function') {
        return parentCommentId.toString()
      }
      return null
    }
    
    // First pass: create map of all comments with empty replies array
    comments.forEach(comment => {
      // Convert _id to string for consistent comparison
      const commentId = typeof comment._id === 'string' ? comment._id : comment._id.toString()
      const parentId = extractParentId(comment.parent_comment_id)
      
      commentMap.set(commentId, { 
        ...comment, 
        _id: commentId,
        parent_comment_id: parentId,
        replies: [] 
      })
    })
    
    // Second pass: organize into tree structure (handles unlimited nesting)
    comments.forEach(comment => {
      const commentId = typeof comment._id === 'string' ? comment._id : comment._id.toString()
      const commentObj = commentMap.get(commentId)
      
      if (!commentObj) return // Skip if not in map (shouldn't happen)
      
      const parentId = extractParentId(comment.parent_comment_id)
      
      if (parentId) {
        // This is a reply - find parent and add to its replies
        const parent = commentMap.get(parentId)
        if (parent) {
          parent.replies = parent.replies || []
          // Avoid duplicates
          if (!parent.replies.find(r => r._id === commentId)) {
            parent.replies.push(commentObj)
          }
        } else {
          // Parent not found in current batch, treat as root (shouldn't happen but handle gracefully)
          if (!rootComments.find(r => r._id === commentId)) {
            rootComments.push(commentObj)
          }
        }
      } else {
        // This is a root comment
        if (!rootComments.find(r => r._id === commentId)) {
          rootComments.push(commentObj)
        }
      }
    })
    
    // Sort replies by creation date (oldest first for conversation flow)
    const sortReplies = (commentList) => {
      commentList.forEach(comment => {
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.sort((a, b) => {
            const dateA = new Date(a.created_at || a.createdAt || 0)
            const dateB = new Date(b.created_at || b.createdAt || 0)
            return dateA - dateB // Oldest first
          })
          sortReplies(comment.replies) // Recursively sort nested replies
        }
      })
    }
    
    // Sort root comments (newest first)
    rootComments.sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || 0)
      const dateB = new Date(b.created_at || b.createdAt || 0)
      return dateB - dateA // Newest first
    })
    
    // Sort all nested replies
    sortReplies(rootComments)
    
    return rootComments
  }, [comments])

  const handleEditStart = (comment) => {
    setEditingComment({ ...comment })
  }

  const handleEditCancel = () => {
    setEditingComment(null)
  }

  const handleEditSave = async () => {
    if (editingComment) {
      await onSaveComment(editingComment)
      setEditingComment(null)
    }
  }


  const handleCreateComment = async (content, parentCommentId = null) => {
    if (onCreateComment) {
      await onCreateComment(content, parentCommentId)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 overflow-hidden relative">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="mt-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <i className="fas fa-comments text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                Comments
                {comments.length > 0 && (
                  <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                    {comments.length}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Engage with the community</p>
            </div>
          </div>
        </div>

        {/* Create Comment Form - Always visible at top */}
        {onCreateComment && (
          <div className="mb-8 pb-6 border-b border-gray-200">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                <i className="fas fa-comment-dots text-blue-600 mr-2"></i>
                Add a Comment
              </h4>
              <p className="text-sm text-gray-600">Share your thoughts, provide support, or ask questions</p>
            </div>
            <CommentCreate
              onSave={async (content) => await handleCreateComment(content)}
              onCancel={() => {}}
              actionLoading={actionLoading}
              placeholder="Write a comment... Share your thoughts, ask questions, or provide support to the community."
            />
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading comments...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait</p>
          </div>
        ) : organizedComments.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-comments text-3xl text-gray-300"></i>
            </div>
            <p className="text-gray-600 font-semibold text-lg mb-1">No comments yet</p>
            <p className="text-gray-400 text-sm">Be the first to comment on this post!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {organizedComments.map((comment, index) => {
              const isLastComment = index === organizedComments.length - 1
              const hasSiblingAfter = !isLastComment
              
              return (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  isEditing={editingComment?._id === comment._id}
                  editingContent={editingComment?.content}
                  onEditStart={handleEditStart}
                  onEditCancel={handleEditCancel}
                  onEditSave={handleEditSave}
                  onDelete={onDeleteComment}
                  onCreateReply={(content, parentId) => handleCreateComment(content, parentId)}
                  actionLoading={actionLoading}
                  formatDate={formatDate}
                  depth={0}
                  isLastChild={isLastComment}
                  hasSiblingAfter={hasSiblingAfter}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ForumComments


import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useComments } from '../../hooks/useCommunity'
import { useAuth } from '../../lib/auth'

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth()
  const { comments, loading, addComment, deleteComment } = useComments(postId)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return
    setSubmitting(true)
    const ok = await addComment(newComment)
    if (ok) setNewComment('')
    setSubmitting(false)
  }

  if (loading) {
    return <div className="text-sm text-ash py-2">Loading comments...</div>
  }

  return (
    <div className="mt-3">
      {comments.length > 0 && (
        <div className="space-y-2 mb-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2 text-sm">
              <Link
                to={'/@' + (comment.profiles?.username || '')}
                className="font-medium text-char hover:text-crust shrink-0"
              >
                {comment.profiles?.username || 'baker'}
              </Link>
              <p className="text-ash flex-1">{comment.content}</p>
              {user?.id === comment.user_id && (
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="text-xs text-ash/50 hover:text-red-500 shrink-0"
                  aria-label="Delete comment"
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Nice bake!"
          maxLength={500}
          className="flex-1 rounded-lg border border-dough bg-steam px-3 py-1.5 text-sm text-char placeholder:text-ash/50 focus:outline-none focus:ring-2 focus:ring-wheat/50"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="px-3 py-1.5 bg-crust text-steam rounded-lg text-sm font-medium hover:bg-crust/90 transition-colors disabled:opacity-50"
        >
          Post
        </button>
      </form>
    </div>
  )
}

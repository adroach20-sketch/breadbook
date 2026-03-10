import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CommentSection } from './CommentSection'
import type { FeedPost } from '../../data/community-types'

interface FeedPostCardProps {
  post: FeedPost
}

export function FeedPostCard({ post }: FeedPostCardProps) {
  const [showComments, setShowComments] = useState(false)

  const username = post.profiles?.username || 'baker'
  const bakeLog = post.bake_logs
  const photos = bakeLog?.photo_urls || []
  const recipeTitle = bakeLog?.recipes?.title || 'Unknown Recipe'
  const recipeId = bakeLog?.recipes?.id
  const rating = bakeLog?.rating || 0

  const timeAgo = formatTimeAgo(post.created_at)

  return (
    <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough overflow-hidden">
      {/* Photo */}
      {photos.length > 0 && (
        <div className="aspect-square bg-dough">
          <img
            src={photos[0]}
            alt="Bake photo"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        {/* Baker info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-wheat/30 flex items-center justify-center text-sm font-medium text-crust">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              to={'/@' + username}
              className="font-medium text-char text-sm hover:text-crust"
            >
              @{username}
            </Link>
            <span className="text-xs text-ash ml-2">{timeAgo}</span>
          </div>
        </div>

        {/* Recipe link + rating */}
        <div className="flex items-center gap-2 mb-2">
          {recipeId ? (
            <Link to={'/recipes/' + recipeId} className="text-sm text-crust hover:underline font-medium">
              {recipeTitle}
            </Link>
          ) : (
            <span className="text-sm text-char font-medium">{recipeTitle}</span>
          )}
          {rating > 0 && (
            <span className="text-xs text-crust">
              {'*'.repeat(rating)}
            </span>
          )}
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-ash mb-2">{post.caption}</p>
        )}

        {/* Bake notes (condensed) */}
        {bakeLog?.what_went_well && (
          <p className="text-xs text-ash-muted mb-2 italic">
            What went well: {bakeLog.what_went_well}
          </p>
        )}

        {/* Comment toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-xs text-ash hover:text-crust transition-colors"
        >
          {showComments ? 'Hide comments' : 'Comments'}
        </button>

        {showComments && <CommentSection postId={post.id} />}
      </div>
    </div>
  )
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return diffMins + 'm ago'

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return diffHours + 'h ago'

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return diffDays + 'd ago'

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

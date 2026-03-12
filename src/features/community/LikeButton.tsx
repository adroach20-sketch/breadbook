import { useRecipeLike } from '../../hooks/useCommunity'
import { useAuthGate } from '../../hooks/useAuthGate'

interface LikeButtonProps {
  recipeId: string
  className?: string
}

export function LikeButton({ recipeId, className = '' }: LikeButtonProps) {
  const { liked, likeCount, toggleLike, loading } = useRecipeLike(recipeId)
  const { requireAuth, modal } = useAuthGate()

  if (loading) return <span className="text-xs text-ash">...</span>

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          requireAuth(toggleLike, {
            title: 'Like Recipes',
            message: 'Sign up to like recipes and help surface the best bakes in the community.',
          })
        }}
        className={`flex items-center gap-1 text-sm transition-colors ${
          liked ? 'text-red-500' : 'text-ash hover:text-red-400'
        } ${className}`}
        aria-label={liked ? 'Unlike recipe' : 'Like recipe'}
      >
        <span>{liked ? '\u2764\uFE0F' : '\u2661'}</span>
        {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
      </button>
      {modal}
    </>
  )
}

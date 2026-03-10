import { useRecipeLike } from '../../hooks/useCommunity'

interface LikeButtonProps {
  recipeId: string
  className?: string
}

export function LikeButton({ recipeId, className = '' }: LikeButtonProps) {
  const { liked, likeCount, toggleLike, loading } = useRecipeLike(recipeId)

  if (loading) return <span className="text-xs text-ash">...</span>

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike() }}
      className={`flex items-center gap-1 text-sm transition-colors ${
        liked ? 'text-red-500' : 'text-ash hover:text-red-400'
      } ${className}`}
      aria-label={liked ? 'Unlike recipe' : 'Like recipe'}
    >
      <span>{liked ? '\u2764\uFE0F' : '\u2661'}</span>
      {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
    </button>
  )
}

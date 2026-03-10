import { useAuth } from '../lib/auth'
import { useFavorites } from '../store/favorites'

interface FavoriteButtonProps {
  recipeId: string
  /** Render size variant */
  size?: 'sm' | 'md'
  /** Show the save count next to the heart */
  showCount?: boolean
}

// Outlined heart (not saved)
function HeartOutline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

// Filled heart (saved)
function HeartFilled({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export function FavoriteButton({ recipeId, size = 'sm', showCount = false }: FavoriteButtonProps) {
  const { user } = useAuth()
  const { isFavorited, toggleFavorite, getSaveCount } = useFavorites()

  const saved = isFavorited(recipeId)
  const count = getSaveCount(recipeId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    toggleFavorite(user.id, recipeId)
  }

  const iconSize = size === 'md' ? 'w-6 h-6' : 'w-4 h-4'
  const buttonSize = size === 'md' ? 'w-10 h-10' : 'w-8 h-8'

  return (
    <button
      onClick={handleClick}
      className={`${buttonSize} flex items-center justify-center rounded-full transition-all duration-200 ${
        saved
          ? 'text-red-500'
          : 'text-ash/40 hover:text-ash-muted'
      } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-125'}`}
      aria-label={saved ? 'Remove from favorites' : 'Add to favorites'}
      title={saved ? 'Remove from favorites' : 'Save to favorites'}
      disabled={!user}
    >
      {saved ? <HeartFilled className={iconSize} /> : <HeartOutline className={iconSize} />}
      {showCount && count > 0 && (
        <span className="text-xs text-ash ml-0.5">{count}</span>
      )}
    </button>
  )
}

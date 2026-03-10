import { useFollow } from '../../hooks/useCommunity'

interface FollowButtonProps {
  targetUserId: string
  className?: string
}

export function FollowButton({ targetUserId, className = '' }: FollowButtonProps) {
  const { following, toggleFollow, loading } = useFollow(targetUserId)

  if (loading) return null

  return (
    <button
      onClick={toggleFollow}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        following
          ? 'bg-dough text-ash hover:bg-dough/70'
          : 'bg-crust text-steam hover:bg-crust/90'
      } ${className}`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  )
}

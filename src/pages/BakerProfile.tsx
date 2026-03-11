import { useParams, Link } from 'react-router-dom'
import { useBakerProfile } from '../hooks/useCommunity'
import { useAuth } from '../lib/auth'
import { FollowButton } from '../features/community/FollowButton'
import { FeedPostCard } from '../features/community/FeedPostCard'

const categoryEmojis: Record<string, string> = {
  sourdough_loaf: '\uD83C\uDF5E',
  focaccia: '\uD83E\uDED3',
  bagels: '\uD83E\uDD6F',
  pizza: '\uD83C\uDF55',
  enriched: '\uD83E\uDDC1',
  sandwich: '\uD83E\uDD6A',
  flatbread: '\uD83E\uDED3',
  pancakes_waffles: '\uD83E\uDD5E',
  crackers: '\uD83C\uDF58',
  quick_bread: '\uD83C\uDF4C',
  pasta: '\uD83C\uDF5D',
  other_discard: '\u267B\uFE0F',
}

export function BakerProfile() {
  const { username } = useParams<{ username: string }>()
  const { user } = useAuth()
  const { data, loading, notFound } = useBakerProfile(username || '')

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-dough" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-dough rounded w-32" />
            <div className="h-4 bg-dough rounded w-48" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <span className="text-4xl mb-3 block">\uD83E\uDD14</span>
        <p className="text-ash mb-4">Baker not found.</p>
        <Link to="/community" className="text-crust font-medium hover:underline">
          Back to Community
        </Link>
      </div>
    )
  }

  const { profile, bake_count, bakes_this_month, favorite_recipe, avg_rating, bake_streak, public_recipes, recent_posts } = data
  const isOwnProfile = user?.id === profile.id

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-wheat/30 flex items-center justify-center text-2xl font-bold text-crust shrink-0">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            profile.username?.charAt(0).toUpperCase() || '?'
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-xl font-bold text-char">@{profile.username}</h1>
          {profile.bio && <p className="text-sm text-ash mt-1">{profile.bio}</p>}
          {profile.starter_name && (
            <p className="text-xs text-ash-muted mt-1">
              Starter: {profile.starter_name}
            </p>
          )}
        </div>
        {isOwnProfile ? (
          <Link
            to="/profile/edit"
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-dough text-ash hover:bg-dough/70 transition-colors"
          >
            Edit
          </Link>
        ) : (
          <FollowButton targetUserId={profile.id} />
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 py-3 border-y border-dough">
        <div className="text-center">
          <p className="font-heading text-lg font-bold text-char">{bake_count}</p>
          <p className="text-xs text-ash">Total Bakes</p>
        </div>
        <div className="text-center">
          <p className="font-heading text-lg font-bold text-char">{bakes_this_month}</p>
          <p className="text-xs text-ash">This Month</p>
        </div>
        {bake_streak > 0 && (
          <div className="text-center">
            <p className="font-heading text-lg font-bold text-char">{bake_streak}</p>
            <p className="text-xs text-ash">Day Streak</p>
          </div>
        )}
        {avg_rating !== null && (
          <div className="text-center">
            <p className="font-heading text-lg font-bold text-char">{avg_rating}</p>
            <p className="text-xs text-ash">Avg Rating</p>
          </div>
        )}
      </div>

      {/* Favorite recipe */}
      {favorite_recipe && (
        <div className="mb-6 px-3 py-2 bg-wheat/10 rounded-lg">
          <p className="text-xs text-ash">
            Favorite: <span className="font-medium text-char">{favorite_recipe.title}</span>
            <span className="text-ash-muted"> ({favorite_recipe.count} bakes)</span>
          </p>
        </div>
      )}

      {/* Public recipes */}
      {public_recipes.length > 0 && (
        <div className="mb-8">
          <h2 className="font-heading text-lg font-semibold text-char mb-3">Recipes</h2>
          <div className="space-y-2">
            {public_recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={'/recipes/' + recipe.id}
                className="flex items-center gap-3 p-3 bg-steam rounded-lg border border-dough hover:shadow-sm transition-shadow"
              >
                <span className="text-xl">{categoryEmojis[recipe.category] || '\uD83C\uDF5E'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-char text-sm truncate">{recipe.title}</p>
                  <p className="text-xs text-ash">
                    {recipe.hydration_pct > 0 ? recipe.hydration_pct + '% hydration' : recipe.ferment_type}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent bakes */}
      {recent_posts.length > 0 && (
        <div>
          <h2 className="font-heading text-lg font-semibold text-char mb-3">Recent Bakes</h2>
          <div className="space-y-4">
            {recent_posts.map((post) => (
              <FeedPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {public_recipes.length === 0 && recent_posts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-ash">
            {isOwnProfile
              ? 'Share some recipes and bakes to fill your profile!'
              : 'This baker hasn\'t shared anything yet.'}
          </p>
        </div>
      )}
    </div>
  )
}

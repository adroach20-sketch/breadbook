import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFeed } from '../hooks/useCommunity'
import { FeedPostCard } from '../features/community/FeedPostCard'

const feedTabs = [
  { key: 'discover' as const, label: 'Discover' },
  { key: 'following' as const, label: 'Following' },
]

export function Feed() {
  const [activeTab, setActiveTab] = useState<'following' | 'discover'>('discover')
  const { posts, loading, hasMore, loadMore } = useFeed(activeTab)

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-2xl font-bold text-char">Community</h1>
        <Link
          to="/community/recipes"
          className="text-sm text-crust font-medium hover:underline"
        >
          Browse Recipes
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {feedTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-crust text-steam'
                : 'bg-dough text-ash hover:bg-wheat/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-steam rounded-xl border border-dough animate-pulse">
              <div className="aspect-square bg-dough/50" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-dough rounded w-32" />
                <div className="h-3 bg-dough rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyFeed mode={activeTab} onSwitchToDiscover={() => setActiveTab('discover')} />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
          {hasMore && (
            <button
              onClick={loadMore}
              className="w-full py-3 text-sm text-crust font-medium hover:underline"
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyFeed({ mode, onSwitchToDiscover }: { mode: 'following' | 'discover'; onSwitchToDiscover: () => void }) {
  if (mode === 'following') {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">👋</span>
        <h2 className="font-heading text-lg font-semibold text-char mb-2">
          No bakes to see yet
        </h2>
        <p className="text-ash mb-4">
          Follow some bakers to see their bakes here.
        </p>
        <button
          onClick={onSwitchToDiscover}
          className="text-crust font-medium hover:underline"
        >
          Discover bakers in the community
        </button>
      </div>
    )
  }

  return (
    <div className="text-center py-16">
      <span className="text-5xl block mb-4">🍞</span>
      <h2 className="font-heading text-lg font-semibold text-char mb-2">
        No bakes shared yet
      </h2>
      <p className="text-ash mb-4">
        Be the first to share a bake! Your community is just getting started.
      </p>
      <Link
        to="/journal"
        className="text-crust font-medium hover:underline"
      >
        Go to your journal to share a bake
      </Link>
    </div>
  )
}

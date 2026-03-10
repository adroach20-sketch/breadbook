import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCommunityRecipes } from '../hooks/useCommunity'
import { LikeButton } from '../features/community/LikeButton'
import { RecipeCardSkeleton } from '../components/RecipeCardSkeleton'

const fermentLabels: Record<string, string> = {
  long_ferment: 'Long Ferment',
  overnight: 'Overnight',
  same_day_discard: 'Same-Day Discard',
}

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

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'sourdough_loaf', label: 'Loaves' },
  { key: 'focaccia', label: 'Focaccia' },
  { key: 'pizza', label: 'Pizza' },
  { key: 'enriched', label: 'Enriched' },
  { key: 'same_day', label: 'Discard' },
]

export function CommunityRecipes() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const effectiveCategory = category === 'same_day' ? undefined : category
  const { recipes, loading } = useCommunityRecipes({
    category: effectiveCategory,
    search: search || undefined,
  })

  // Filter same-day discard recipes client-side
  const filtered = category === 'same_day'
    ? recipes.filter((r) => r.ferment_type === 'same_day_discard')
    : recipes

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-heading text-2xl font-bold text-char">Community Recipes</h1>
        <Link to="/community" className="text-sm text-crust font-medium hover:underline">
          Bake Feed
        </Link>
      </div>
      <p className="text-sm text-ash mb-4">Recipes shared by bakers like you.</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search recipes..."
            className="flex-1 rounded-lg border border-dough bg-steam px-3 py-2 text-sm text-char placeholder:text-ash-muted focus:outline-none focus:ring-2 focus:ring-wheat/50"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-crust text-steam rounded-lg text-sm font-medium hover:bg-crust/90 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCategory(tab.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === tab.key
                ? 'bg-crust text-steam'
                : 'bg-dough text-ash hover:bg-wheat/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl mb-3 block">\uD83C\uDF5E</span>
          <p className="text-ash mb-2">No community recipes found.</p>
          <p className="text-xs text-ash-muted">
            Share your own recipes by making them public!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((recipe) => {
            const emoji = categoryEmojis[recipe.category] || '\uD83C\uDF5E'
            return (
              <div
                key={recipe.id}
                className="bg-steam rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-dough"
              >
                <Link to={'/recipes/' + recipe.id} className="block">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{emoji}</span>
                    <span className="text-xs bg-dough text-ash px-2 py-0.5 rounded-full">
                      {fermentLabels[recipe.ferment_type] || recipe.ferment_type}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-char text-lg leading-tight mb-1">
                    {recipe.title}
                  </h3>
                  {recipe.is_breadbook_original && (
                    <p className="text-xs text-ash mb-1">\uD83C\uDF5E @BreadBook Original</p>
                  )}
                  {recipe.profiles?.username && !recipe.is_breadbook_original && (
                    <p className="text-xs text-ash mb-1">
                      by @{recipe.profiles.username}
                    </p>
                  )}
                  <p className="text-sm text-ash line-clamp-2 mb-3">
                    {recipe.description}
                  </p>
                </Link>
                <div className="flex items-center justify-between text-xs text-ash">
                  <div className="flex gap-3">
                    {recipe.hydration_pct > 0 && <span>{recipe.hydration_pct}% hydration</span>}
                    <span>{recipe.yield_amount}</span>
                  </div>
                  <LikeButton recipeId={recipe.id} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

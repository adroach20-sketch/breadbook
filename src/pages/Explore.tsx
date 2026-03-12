import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { FilterPanel } from '../components/FilterPanel'
import { RecipeSection } from '../components/RecipeSection'
import { RecipeCard } from '../components/RecipeCard'
import { RecipeCardSkeleton } from '../components/RecipeCardSkeleton'
import { useRecipeSearch } from '../hooks/useRecipeSearch'
import { useFavorites } from '../store/favorites'
import { useAuth } from '../lib/auth'
import { breadbookOriginals } from '../data/originals'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../data/types'

// ─────────────────────────────────────────────
// Explore page — discovery-first recipe browsing
// ─────────────────────────────────────────────

export function Explore() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>(breadbookOriginals)
  const [loading, setLoading] = useState(true)
  const { savedRecipeIds, loaded: favoritesLoaded } = useFavorites()
  const [isStarterActive, setIsStarterActive] = useState(false)
  const [activeTab, setActiveTab] = useState<'explore' | 'mine'>('explore')
  const [myVersions, setMyVersions] = useState<Recipe[]>([])
  const [myVersionsLoading, setMyVersionsLoading] = useState(true)

  // Check if user has an active starter (fed within last 6 hours)
  useEffect(() => {
    if (!user) return
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    supabase
      .from('starter_logs')
      .select('fed_at, starter_id')
      .eq('user_id', user.id)
      .gte('fed_at', sixHoursAgo)
      .limit(1)
      .then(({ data }) => {
        setIsStarterActive(!!data && data.length > 0)
      })
    return () => { setIsStarterActive(false) }
  }, [user])

  // Load recipes (same merge logic as Recipes page)
  useEffect(() => {
    async function loadRecipes() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true)

      if (error) {
        console.warn('Failed to load recipes from Supabase:', error.message)
      } else if (data && data.length > 0) {
        const supabaseByTitle = new Map<string, Recipe>()
        for (const r of data as Recipe[]) {
          supabaseByTitle.set(r.title, r)
        }
        const merged: Recipe[] = breadbookOriginals.map(
          (local) => supabaseByTitle.get(local.title) ?? local
        )
        const localTitles = new Set(breadbookOriginals.map((r) => r.title))
        for (const r of data as Recipe[]) {
          if (!localTitles.has(r.title)) merged.push(r)
        }
        setRecipes(merged)
      }
      setLoading(false)
    }
    loadRecipes()
  }, [])

  // Load user's own recipes when Mine tab is opened
  useEffect(() => {
    if (!user || activeTab !== 'mine') return
    setMyVersionsLoading(true)
    supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(
        ({ data }) => {
          setMyVersions((data as Recipe[]) ?? [])
          setMyVersionsLoading(false)
        },
        () => setMyVersionsLoading(false)
      )
  }, [user, activeTab])

  // Search + filter hook
  const {
    query,
    setQuery,
    filters,
    setFilter,
    resetFilters,
    results,
    isFiltered,
    activeFilterCount,
  } = useRecipeSearch({ recipes })

  // ─────────────────────────────────────────────
  // Editorial sections (computed from loaded recipes)
  // ─────────────────────────────────────────────

  const originals = useMemo(
    () => recipes.filter((r) => r.is_breadbook_original),
    [recipes]
  )

  const beginnerFriendly = useMemo(
    () => recipes.filter((r) => r.tags?.includes('beginner')),
    [recipes]
  )

  const quickBakes = useMemo(
    () =>
      recipes.filter((r) => {
        const active = r.steps.reduce((sum, s) => sum + (s.timer_minutes || 0), 0)
        return active <= 30 && active > 0
      }),
    [recipes]
  )

  const weekendProjects = useMemo(
    () =>
      recipes.filter(
        (r) =>
          r.tags?.includes('weekend project') ||
          r.ferment_type === 'long_ferment'
      ),
    [recipes]
  )

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  const savedByYouFull = useMemo(
    () => (favoritesLoaded ? recipes.filter((r) => savedRecipeIds.has(r.id)) : []),
    [recipes, savedRecipeIds, favoritesLoaded]
  )
  const myRecipesCount = myVersions.length + savedByYouFull.length

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="px-4 md:px-0 mb-4">
        <h1 className="font-heading text-2xl font-bold text-char mb-1">Recipes</h1>

        {/* Tab bar */}
        {user && (
          <div className="flex gap-1 mb-4 border-b border-dough">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'explore'
                  ? 'border-crust text-crust'
                  : 'border-transparent text-ash hover:text-char'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'mine'
                  ? 'border-crust text-crust'
                  : 'border-transparent text-ash hover:text-char'
              }`}
            >
              My Recipes
              {myRecipesCount > 0 && (
                <span className="ml-1 text-xs text-ash-muted">({myRecipesCount})</span>
              )}
            </button>
          </div>
        )}

        {activeTab === 'explore' && (
          <>
            <p className="text-sm text-ash mb-4">
              Discover your next bake — search, filter, or browse our curated collections.
            </p>
            {/* Search bar — sticky on scroll */}
            <div className="sticky top-0 z-30 bg-crumb pb-3 -mx-4 px-4 md:mx-0 md:px-0">
              <SearchBar value={query} onChange={setQuery} />
            </div>
            {/* Filter panel */}
            <FilterPanel
              filters={filters}
              onFilterChange={setFilter}
              onReset={resetFilters}
              activeFilterCount={activeFilterCount}
            />
          </>
        )}
      </div>

      {/* ─── My Recipes tab ─── */}
      {activeTab === 'mine' && user && (
        <div className="px-4 md:px-0">
          {/* My Versions */}
          <div className="mb-8">
            <h2 className="font-heading text-lg font-semibold text-char mb-3">My Versions</h2>
            {myVersionsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 2 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
              </div>
            ) : myVersions.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myVersions.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="py-6 text-center bg-steam rounded-xl border border-dough">
                <p className="text-sm text-ash mb-2">Made a recipe your own? It'll live here.</p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="text-sm text-crust font-medium hover:underline"
                >
                  Browse recipes →
                </button>
              </div>
            )}
          </div>

          {/* Saved */}
          <div className="mb-8">
            <h2 className="font-heading text-lg font-semibold text-char mb-3">Saved</h2>
            {!favoritesLoaded ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
              </div>
            ) : savedByYouFull.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedByYouFull.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="py-6 text-center bg-steam rounded-xl border border-dough">
                <p className="text-sm text-ash mb-2">Tap the ♡ on any recipe to save it.</p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="text-sm text-crust font-medium hover:underline"
                >
                  Browse recipes →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Explore tab ─── */}
      {activeTab === 'explore' && (
      <>
      {/* Loading state */}
      {loading ? (
        <div className="px-4 md:px-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : isFiltered ? (
        /* ─── Search / filter results ─── */
        <div className="px-4 md:px-0">
          <p className="text-sm text-ash mb-4">
            {results.length === 0
              ? ''
              : results.length === 1
              ? '1 recipe found'
              : `${results.length} recipes found`}
          </p>

          {results.length === 0 ? (
            <EmptySearch onReset={() => { setQuery(''); resetFilters() }} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ─── Editorial sections (default browse mode) ─── */
        <>
          {originals.length > 0 && (
            <RecipeSection
              title="BreadBook Originals"
              emoji={'\u{1F35E}'}
              recipes={originals}
            />
          )}

          {beginnerFriendly.length > 0 && (
            <RecipeSection
              title="Great for Beginners"
              emoji={'\u{1F331}'}
              recipes={beginnerFriendly}
            />
          )}

          {quickBakes.length > 0 && (
            <RecipeSection
              title="Under 30 Minutes Active"
              emoji={'\u26A1'}
              recipes={quickBakes}
            />
          )}

          {weekendProjects.length > 0 && (
            <RecipeSection
              title="Weekend Projects"
              emoji={'\u{1F3D6}\uFE0F'}
              recipes={weekendProjects}
            />
          )}

          {user && savedByYouFull.length > 0 && (
            <RecipeSection
              title="Saved by You"
              emoji={'\u2764\uFE0F'}
              recipes={savedByYouFull}
            />
          )}

          {/* Starter-aware suggestion — show when starter was fed in last 6 hours */}
          {isStarterActive && weekendProjects.length > 0 && (
            <div className="mx-4 md:mx-0 mb-8 bg-wheat/10 border border-wheat/40 rounded-xl p-4">
              <p className="font-heading font-semibold text-char text-sm mb-1">
                🌾 Your starter is active — ready to bake!
              </p>
              <p className="text-sm text-ash mb-3">
                You fed recently. Now's a great time to start a long-ferment bake.
              </p>
              <div className="flex flex-wrap gap-2">
                {weekendProjects.slice(0, 3).map((r) => (
                  <Link
                    key={r.id}
                    to={`/recipes/${r.id}`}
                    className="text-xs bg-steam border border-dough rounded-full px-3 py-1.5 text-char hover:border-wheat/60 transition-colors"
                  >
                    {r.title}
                  </Link>
                ))}
                {weekendProjects.length > 3 && (
                  <Link
                    to="/recipes"
                    className="text-xs text-crust font-medium px-3 py-1.5 hover:underline"
                  >
                    See all →
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* All recipes grid */}
          <div className="px-4 md:px-0">
            <h2 className="font-heading text-lg font-semibold text-char mb-3">All Recipes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </>
      )}
      </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Empty search / filter state
// ─────────────────────────────────────────────

function EmptySearch({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-12">
      <span className="text-4xl mb-3 block">{'\u{1F50D}'}</span>
      <p className="text-ash mb-1 font-heading font-medium">No recipes match your search</p>
      <p className="text-sm text-ash-muted mb-4">
        Try broadening your filters or searching for something different.
      </p>
      <button
        onClick={onReset}
        className="text-crust font-medium text-sm hover:underline transition-colors min-h-[44px] px-4"
      >
        Clear search and filters
      </button>
    </div>
  )
}

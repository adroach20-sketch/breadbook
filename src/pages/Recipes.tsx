import { useState, useEffect } from 'react'
import { RecipeCard } from '../components/RecipeCard'
import { RecipeCardSkeleton } from '../components/RecipeCardSkeleton'
import { breadbookOriginals } from '../data/originals'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../data/types'

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'loaves', label: 'Loaves' },
  { key: 'flatbreads', label: 'Flatbreads' },
  { key: 'discard', label: 'Discard' },
  { key: 'enriched', label: 'Enriched' },
]

const categoryGroups: Record<string, string[]> = {
  loaves: ['sourdough_loaf'],
  flatbreads: ['focaccia', 'pizza', 'flatbread', 'bagels'],
  discard: ['pancakes_waffles', 'crackers', 'quick_bread', 'other_discard', 'pasta'],
  enriched: ['enriched', 'sandwich'],
}

export function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(breadbookOriginals)
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)

  // Merge Supabase recipes with local originals (local always included)
  useEffect(() => {
    async function loadRecipes() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: true })

      if (error) {
        console.warn('Failed to load recipes from Supabase:', error.message)
      } else if (data && data.length > 0) {
        // Supabase recipes take priority; add any local originals not in Supabase
        const supabaseIds = new Set(data.map((r: Recipe) => r.id))
        const supabaseTitles = new Set(data.map((r: Recipe) => r.title))
        const missingLocals = breadbookOriginals.filter(
          (r) => !supabaseIds.has(r.id) && !supabaseTitles.has(r.title)
        )
        setRecipes([...missingLocals, ...(data as Recipe[])])
      }
      setLoading(false)
    }
    loadRecipes()
  }, [])

  const filtered =
    activeTab === 'all'
      ? recipes
      : recipes.filter((r) => categoryGroups[activeTab]?.includes(r.category))

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-char mb-1">Recipes</h1>
      <p className="text-sm text-ash mb-4">BreadBook Originals — tested recipes for every bake.</p>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
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
          {Array.from({ length: 4 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl mb-3 block">🍞</span>
          <p className="text-ash">No recipes in this category yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

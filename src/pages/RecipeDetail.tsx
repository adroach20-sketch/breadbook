import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { IngredientList } from '../components/IngredientList'
import { StepList } from '../components/StepList'
import { breadbookOriginals } from '../data/originals'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../data/types'

const fermentLabels: Record<string, string> = {
  long_ferment: 'Long Ferment',
  overnight: 'Overnight',
  same_day_discard: 'Same-Day Discard',
}

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipe() {
      // Try Supabase first
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {
        setRecipe(data as Recipe)
      } else {
        if (error) console.warn('Failed to load recipe from Supabase:', error.message)
        const local = breadbookOriginals.find((r) => r.id === id)
        setRecipe(local || null)
      }
      setLoading(false)
    }
    loadRecipe()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse">
        <div className="h-4 bg-dough rounded w-24 mb-4" />
        <div className="h-7 bg-dough rounded w-3/4 mb-3" />
        <div className="flex gap-2 mb-3">
          <div className="h-5 bg-dough rounded-full w-28" />
          <div className="h-5 bg-dough rounded-full w-20" />
          <div className="h-5 bg-dough rounded-full w-16" />
        </div>
        <div className="h-4 bg-dough rounded w-full mb-2" />
        <div className="h-4 bg-dough rounded w-2/3 mb-6" />
        <div className="bg-steam rounded-xl p-4 border border-dough/50 mb-6">
          <div className="h-5 bg-dough rounded w-24 mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-dough rounded w-full" />
            <div className="h-4 bg-dough rounded w-full" />
            <div className="h-4 bg-dough rounded w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <span className="text-4xl mb-3 block">🤔</span>
        <p className="text-ash mb-4">Recipe not found.</p>
        <Link to="/recipes" className="text-crust font-medium hover:underline">
          Back to recipes
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link to="/recipes" className="text-sm text-crust hover:underline mb-4 inline-block">
        ← All Recipes
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-char mb-2">{recipe.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {recipe.is_breadbook_original && (
            <span className="text-xs bg-crust/10 text-crust px-2 py-0.5 rounded-full font-medium">
              🍞 BreadBook Original
            </span>
          )}
          <span className="text-xs bg-dough text-ash px-2 py-0.5 rounded-full">
            {fermentLabels[recipe.ferment_type]}
          </span>
          {recipe.hydration_pct > 0 && (
            <span className="text-xs bg-dough text-ash px-2 py-0.5 rounded-full">
              {recipe.hydration_pct}% hydration
            </span>
          )}
          <span className="text-xs bg-dough text-ash px-2 py-0.5 rounded-full">
            {recipe.yield_amount}
          </span>
        </div>
        <p className="text-ash leading-relaxed">{recipe.description}</p>
        {recipe.source_credit && (
          <p className="text-xs text-ash/60 mt-2">Inspired by {recipe.source_credit}</p>
        )}
      </div>

      {/* Ingredients */}
      <div className="bg-steam rounded-xl p-4 mb-6 border border-dough/50">
        <IngredientList ingredients={recipe.ingredients} />
      </div>

      {/* Steps */}
      <div className="bg-steam rounded-xl p-4 mb-6 border border-dough/50">
        <StepList steps={recipe.steps} />
      </div>

      {/* Start Bake CTA */}
      <div className="sticky bottom-20 md:bottom-4 z-40">
        <button
          onClick={() => navigate(`/bake/${recipe.id}`)}
          className="w-full bg-crust text-steam py-3.5 rounded-xl font-heading font-semibold text-lg hover:bg-crust-dark transition-colors shadow-lg"
        >
          Start Bake
        </button>
      </div>
    </div>
  )
}

import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { IngredientList } from '../components/IngredientList'
import { StepList } from '../components/StepList'
import { FavoriteButton } from '../components/FavoriteButton'
import { breadbookOriginals } from '../data/originals'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../data/types'
import { fermentLabels } from '../data/types'
import { LikeButton } from '../features/community/LikeButton'
import { useAuthGate } from '../hooks/useAuthGate'

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [bakeCount, setBakeCount] = useState<number | null>(null)
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const { requireAuth, modal } = useAuthGate()

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

      // Load bake stats separately (non-blocking)
      supabase
        .from('bake_logs')
        .select('rating')
        .eq('recipe_id', id)
        .then(({ data }) => {
          if (!data || data.length === 0) return
          setBakeCount(data.length)
          const rated = data.filter((b) => b.rating > 0)
          if (rated.length > 0) {
            const avg = rated.reduce((sum, b) => sum + b.rating, 0) / rated.length
            setAvgRating(Math.round(avg * 10) / 10)
          }
        })
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
        <div className="bg-steam rounded-xl p-4 shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough mb-6">
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
        <span className="text-4xl mb-3 block">{'\u{1F914}'}</span>
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
        {'\u2190'} All Recipes
      </Link>

      {/* Hero image */}
      {recipe.image_url && (
        <div className="rounded-xl overflow-hidden mb-6 aspect-video">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-2">
          <h1 className="font-heading text-2xl font-bold text-char mb-2">{recipe.title}</h1>
          <FavoriteButton recipeId={recipe.id} size="md" showCount />
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {recipe.is_breadbook_original && (
            <span className="text-xs bg-crust/10 text-crust px-2 py-0.5 rounded-full font-medium">
              {'\u{1F35E}'} BreadBook Original
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
          <LikeButton recipeId={recipe.id} />
        </div>
        {bakeCount !== null && bakeCount > 0 && (
          <p className="text-xs text-ash-muted mb-2">
            {bakeCount === 1 ? '1 baker has made this' : `${bakeCount} bakers have made this`}
            {avgRating !== null && ` · ★ ${avgRating}`}
          </p>
        )}
        <p className="text-ash leading-relaxed">{recipe.description}</p>
        {recipe.source_credit && (
          <p className="text-xs text-ash-muted mt-2">Inspired by {recipe.source_credit}</p>
        )}
      </div>

      {/* Ingredients */}
      <div className="bg-steam rounded-xl p-4 mb-6 shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough">
        <IngredientList ingredients={recipe.ingredients} />
      </div>

      {/* Steps */}
      <div className="bg-steam rounded-xl p-4 mb-6 shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough">
        <StepList steps={recipe.steps} />
      </div>

      {/* Plan This Bake — secondary link */}
      <div className="text-center mb-3">
        <button
          onClick={() => requireAuth(
            () => navigate(`/schedule/new?recipe=${recipe.id}`),
            { title: 'Plan This Bake', message: 'Sign up to plan your bake — tell us when you want to eat and we\'ll work out when to start.' }
          )}
          className="text-crust text-sm font-medium hover:underline"
        >
          Plan This Bake
        </button>
      </div>

      {/* Start Bake CTA */}
      <div className="sticky bottom-20 md:bottom-4 z-40">
        <button
          onClick={() => requireAuth(
            () => navigate(`/bake/${recipe.id}`),
            { title: 'Start Baking', message: 'Sign up to use Guided Bake Mode — step-by-step instructions, timers, and in-bake logging.' }
          )}
          className="w-full bg-crust text-steam py-3.5 rounded-xl font-heading font-semibold text-lg hover:bg-crust-dark transition-colors shadow-lg"
        >
          Start Bake
        </button>
      </div>

      {modal}
    </div>
  )
}

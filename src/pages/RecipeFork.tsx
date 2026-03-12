import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { breadbookOriginals } from '../data/originals'
import type { Recipe, Ingredient } from '../data/types'

export function RecipeFork() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [source, setSource] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(false)

  // Editable fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  // Steps preview collapsed
  const [stepsOpen, setStepsOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      const recipe: Recipe | undefined = (!error && data)
        ? (data as Recipe)
        : breadbookOriginals.find((r) => r.id === id)

      if (!recipe) {
        setLoading(false)
        return
      }

      setSource(recipe)
      setTitle(`${recipe.title} (My Version)`)
      setDescription(recipe.description)
      setIngredients(recipe.ingredients.map((ing) => ({ ...ing })))
      setLoading(false)
    }
    load()
  }, [id])

  function updateAmount(index: number, value: string) {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index ? { ...ing, amount: parseFloat(value) || 0 } : ing
      )
    )
  }

  async function handleSave() {
    if (!user || !source) return
    if (!title.trim()) {
      setError('Please give your recipe a name.')
      return
    }
    setSaving(true)
    setError('')

    const { data, error: insertError } = await supabase
      .from('recipes')
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        category: source.category,
        ferment_type: source.ferment_type,
        hydration_pct: source.hydration_pct,
        yield_amount: source.yield_amount,
        // Null out bakers_pct — amounts changed, percentages are stale
        ingredients: ingredients.map((ing) => ({ ...ing, bakers_pct: null })),
        steps: source.steps,
        tags: source.tags,
        is_public: false,
        is_breadbook_original: false,
        source_credit: null,
        image_url: source.image_url ?? null,
        forked_from_recipe_id: source.id,
      })
      .select('id')
      .single()

    setSaving(false)

    if (insertError || !data) {
      setError('Something went wrong. Please try again.')
      return
    }

    setToast(true)
    setTimeout(() => {
      navigate(`/recipes/${data.id}`)
    }, 1200)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse">
        <div className="h-4 bg-dough rounded w-24 mb-4" />
        <div className="h-7 bg-dough rounded w-3/4 mb-3" />
        <div className="h-4 bg-dough rounded w-full mb-2" />
        <div className="h-4 bg-dough rounded w-2/3" />
      </div>
    )
  }

  if (!source) {
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
    <div className="max-w-2xl mx-auto px-4 py-6 pb-48">
      {/* Back link */}
      <Link
        to={`/recipes/${source.id}`}
        className="text-sm text-crust hover:underline mb-4 inline-block"
      >
        ← Back to recipe
      </Link>

      <h1 className="font-heading text-2xl font-bold text-char mb-1">Make It Yours</h1>
      <p className="text-sm text-ash mb-6">
        Customizing <span className="font-medium text-char">{source.title}</span>
        {source.is_breadbook_original && (
          <span className="ml-1 text-xs bg-crust/10 text-crust px-1.5 py-0.5 rounded-full">
            BreadBook Original
          </span>
        )}
      </p>

      {/* Title */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-char mb-1.5">Recipe Name</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-dough bg-steam text-char placeholder-ash focus:outline-none focus:ring-2 focus:ring-crust/30"
          placeholder="Give your version a name"
          maxLength={120}
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-char mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 rounded-lg border border-dough bg-steam text-char placeholder-ash focus:outline-none focus:ring-2 focus:ring-crust/30 resize-none"
          placeholder="What's different about your version?"
          maxLength={500}
        />
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <div className="mb-1.5">
          <label className="text-sm font-medium text-char">Ingredients</label>
        </div>
        <p className="text-xs text-ash-muted mb-3">
          Step instructions reference the original ingredient amounts.
        </p>
        <div className="bg-steam rounded-xl border border-dough overflow-hidden">
          {ingredients.map((ing, i) => (
            <div
              key={ing.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < ingredients.length - 1 ? 'border-b border-dough' : ''
              }`}
            >
              <span className="flex-1 text-sm text-char">{ing.name}</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  inputMode="decimal"
                  value={ing.amount === 0 ? '' : ing.amount}
                  onChange={(e) => updateAmount(i, e.target.value)}
                  className="w-20 px-2 py-1 text-sm text-right rounded border border-dough bg-white dark:bg-char/10 text-char focus:outline-none focus:ring-2 focus:ring-crust/30"
                  min={0}
                  step="any"
                />
                <span className="text-xs text-ash w-8 shrink-0">{ing.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps — collapsed preview */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setStepsOpen((o) => !o)}
          className="flex items-center justify-between w-full px-4 py-3 bg-steam rounded-xl border border-dough text-sm font-medium text-char"
        >
          <span>Steps ({source.steps.length})</span>
          <span className="text-xs text-ash">
            {stepsOpen ? 'Hide' : 'Preview'} · Steps included from original
          </span>
        </button>
        {stepsOpen && (
          <div className="mt-2 bg-steam rounded-xl border border-dough divide-y divide-dough">
            {source.steps.map((step, i) => (
              <div key={step.id} className="px-4 py-3">
                <p className="text-xs font-medium text-char">
                  {i + 1}. {step.title}
                </p>
                <p className="text-xs text-ash mt-0.5 line-clamp-2">{step.instruction}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
      )}

      {/* Actions */}
      <div className="fixed bottom-20 md:bottom-4 left-0 right-0 px-4 max-w-2xl mx-auto z-40 space-y-2">
        <button
          onClick={handleSave}
          disabled={saving || toast}
          className="w-full bg-crust text-steam py-3.5 rounded-xl font-heading font-semibold text-lg hover:bg-crust-dark transition-colors shadow-lg disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save My Version'}
        </button>
        <p className="text-center text-xs text-ash pb-1">
          Saved as private — only you can see this.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-36 md:bottom-20 left-1/2 -translate-x-1/2 bg-char text-steam text-sm px-4 py-2 rounded-full shadow-lg z-50 whitespace-nowrap">
          Saved — only you can see this
        </div>
      )}
    </div>
  )
}

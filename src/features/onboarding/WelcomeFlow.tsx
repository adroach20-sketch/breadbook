import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { useStarters } from '../../hooks/useStarters'
import { supabase } from '../../lib/supabase'
import { breadbookOriginals } from '../../data/originals'
import { RecipeCard } from '../../components/RecipeCard'

interface WelcomeFlowProps {
  onComplete: () => void
}

export function WelcomeFlow({ onComplete }: WelcomeFlowProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { starters, createStarter } = useStarters()

  const [step, setStep] = useState(1)
  const [starterName, setStarterName] = useState('')
  const [flourType, setFlourType] = useState('all-purpose')
  const [creating, setCreating] = useState(false)

  const finishOnboarding = async () => {
    if (user) {
      await supabase
        .from('profiles')
        .update({ has_onboarded: true })
        .eq('id', user.id)
    }
    onComplete()
  }

  const handleCreateStarter = async () => {
    if (!starterName.trim()) return
    setCreating(true)
    await createStarter(starterName.trim(), flourType)
    setCreating(false)
    setStep(3)
  }

  // Beginner-friendly loaf recipes for the "pick your first bake" step
  const beginnerRecipes = breadbookOriginals
    .filter((r) => r.category === 'sourdough_loaf' && r.tags.includes('beginner'))
    .slice(0, 4)

  // Fallback: if no beginner-tagged loaves, show the classics
  const recipesToShow = beginnerRecipes.length >= 2
    ? beginnerRecipes
    : breadbookOriginals
        .filter((r) => r.category === 'sourdough_loaf')
        .slice(0, 4)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Step 1: Welcome */}
      {step === 1 && (
        <div className="text-center py-12">
          <span className="text-6xl block mb-4" aria-hidden="true">🍞</span>
          <h1 className="font-heading text-3xl font-bold text-char mb-3">
            Welcome to BreadBook!
          </h1>
          <p className="text-ash text-lg max-w-md mx-auto mb-8">
            We're glad you're here. Let's get you set up for your first bake — it only takes a minute.
          </p>
          <button
            onClick={() => {
              // Skip step 2 if user already has starters
              if (starters.length > 0) {
                setStep(3)
              } else {
                setStep(2)
              }
            }}
            className="bg-crust text-steam px-8 py-3 rounded-xl font-medium text-lg hover:bg-crust-light transition-colors"
          >
            Let's Go
          </button>
          <button
            onClick={finishOnboarding}
            className="block mx-auto mt-4 text-ash text-sm hover:text-char transition-colors"
          >
            I'll explore on my own
          </button>
        </div>
      )}

      {/* Step 2: Meet Your Starter */}
      {step === 2 && (
        <div className="py-8">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3" aria-hidden="true">🫙</span>
            <h2 className="font-heading text-2xl font-bold text-char mb-2">
              Meet Your Starter
            </h2>
            <p className="text-ash max-w-md mx-auto">
              Your sourdough starter is the heart of every bake. Give yours a name and we'll help you keep track of feedings and activity.
            </p>
          </div>

          <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-6 max-w-sm mx-auto">
            <div className="mb-4">
              <label htmlFor="starter-name" className="block text-sm font-medium text-char mb-1">
                Starter Name
              </label>
              <input
                id="starter-name"
                type="text"
                value={starterName}
                onChange={(e) => setStarterName(e.target.value)}
                placeholder="e.g., Bubbles, Levi, Steve"
                className="w-full border border-dough rounded-lg px-3 py-2 text-char bg-crumb focus:outline-none focus:ring-2 focus:ring-crust focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="flour-type" className="block text-sm font-medium text-char mb-1">
                Flour Type
              </label>
              <select
                id="flour-type"
                value={flourType}
                onChange={(e) => setFlourType(e.target.value)}
                className="w-full border border-dough rounded-lg px-3 py-2 text-char bg-crumb focus:outline-none focus:ring-2 focus:ring-crust focus:border-transparent"
              >
                <option value="all-purpose">All-Purpose</option>
                <option value="bread-flour">Bread Flour</option>
                <option value="whole-wheat">Whole Wheat</option>
                <option value="rye">Rye</option>
                <option value="mix">Mix / Other</option>
              </select>
            </div>

            <button
              onClick={handleCreateStarter}
              disabled={!starterName.trim() || creating}
              className="w-full bg-crust text-steam py-2.5 rounded-xl font-medium hover:bg-crust-light transition-colors disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create My Starter'}
            </button>
          </div>

          <button
            onClick={() => setStep(3)}
            className="block mx-auto mt-4 text-ash text-sm hover:text-char transition-colors"
          >
            Skip for now
          </button>
        </div>
      )}

      {/* Step 3: Pick Your First Bake */}
      {step === 3 && (
        <div className="py-8">
          <div className="text-center mb-6">
            <span className="text-5xl block mb-3" aria-hidden="true">👩‍🍳</span>
            <h2 className="font-heading text-2xl font-bold text-char mb-2">
              Pick Your First Bake
            </h2>
            <p className="text-ash max-w-md mx-auto">
              These are great starting points. Tap one to see the full recipe and start baking when you're ready.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            {recipesToShow.map((recipe) => (
              <div key={recipe.id} onClick={() => { finishOnboarding(); navigate(`/recipes/${recipe.id}`) }}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={() => { finishOnboarding(); navigate('/recipes') }}
              className="text-crust font-medium text-sm hover:text-crust-light transition-colors"
            >
              Browse All Recipes
            </button>
            <button
              onClick={finishOnboarding}
              className="block mx-auto text-ash text-sm hover:text-char transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-colors ${
              s === step ? 'bg-crust' : 'bg-dough'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

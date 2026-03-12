import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import type { OnboardingPath } from '../../lib/auth'
import { useStarters } from '../../hooks/useStarters'
import { supabase } from '../../lib/supabase'
import { breadbookOriginals } from '../../data/originals'
import { RecipeCard } from '../../components/RecipeCard'

interface WelcomeFlowProps {
  onComplete: () => void
}

// Steps: 1=routing, 2=expectation (beginner/kit only), 3=name starter, 5=last fed (has_starter only), 4=pick recipe
type Step = 1 | 2 | 3 | 4 | 5

const PATH_OPTIONS: { value: OnboardingPath; emoji: string; label: string; sub: string }[] = [
  { value: 'beginner',     emoji: '🌱', label: "I'm brand new",          sub: "Never made a sourdough starter" },
  { value: 'has_kit',      emoji: '📦', label: 'I have a starter kit',   sub: "Got a kit or dried starter" },
  { value: 'has_starter',  emoji: '🫙', label: 'I have an active starter', sub: "It's alive and I'm feeding it" },
  { value: 'experienced',  emoji: '🍞', label: "I've done this before",  sub: "Just show me the recipes" },
]

export function WelcomeFlow({ onComplete }: WelcomeFlowProps) {
  const { user, setOnboardingPath } = useAuth()
  const navigate = useNavigate()
  const { starters, createStarter } = useStarters()

  const [step, setStep] = useState<Step>(1)
  const [path, setPath] = useState<OnboardingPath | null>(null)
  const [starterName, setStarterName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createdStarterId, setCreatedStarterId] = useState<string | null>(null)
  const [lastFedSaving, setLastFedSaving] = useState(false)

  const saveAndFinish = async (selectedPath: OnboardingPath) => {
    if (user) {
      await supabase
        .from('profiles')
        .update({ has_onboarded: true, onboarding_path: selectedPath })
        .eq('id', user.id)
    }
    setOnboardingPath(selectedPath)
    onComplete()
  }

  const handlePathSelect = (selected: OnboardingPath) => {
    setPath(selected)
    if (selected === 'beginner' || selected === 'has_kit') {
      setStep(2)
    } else if (selected === 'has_starter') {
      // Skip expectation screen, go straight to naming the starter
      if (starters.length > 0) {
        setStep(4)
      } else {
        setStep(3)
      }
    } else {
      // Experienced — skip to recipes
      setStep(4)
    }
  }

  const handleCreateStarter = async () => {
    if (!starterName.trim()) return
    setCreating(true)
    const starter = await createStarter(starterName.trim(), 'all-purpose')
    setCreating(false)
    if (path === 'beginner' || path === 'has_kit') {
      await saveAndFinish(path)
      navigate('/starters/guide')
    } else if (path === 'has_starter') {
      // Ask when they last fed it before showing recipes
      if (starter) setCreatedStarterId(starter.id)
      setStep(5)
    } else {
      setStep(4)
    }
  }

  const LAST_FED_OPTIONS = [
    { label: 'Earlier today',  hoursAgo: 2  },
    { label: 'Yesterday',      hoursAgo: 26 },
    { label: '2–3 days ago',   hoursAgo: 60 },
  ]

  const handleLastFed = async (hoursAgo: number | null) => {
    if (hoursAgo !== null && createdStarterId && user) {
      setLastFedSaving(true)
      const fedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
      await supabase.from('starter_logs').insert({
        starter_id: createdStarterId,
        user_id: user.id,
        fed_at: fedAt,
        is_quick_log: true,
      })
      setLastFedSaving(false)
    }
    setStep(4)
  }

  // Beginner-friendly recipes for the final step
  const beginnerRecipes = breadbookOriginals
    .filter((r) => r.category === 'sourdough_loaf' && r.tags.includes('beginner'))
    .slice(0, 4)
  const recipesToShow = beginnerRecipes.length >= 2
    ? beginnerRecipes
    : breadbookOriginals.filter((r) => r.category === 'sourdough_loaf').slice(0, 4)

  // Step indicator — only show for paths that have multiple steps
  // Note: has_starter uses [1,3,5,4] — out-of-numeric-order, so dots use index comparison
  const stepDots: Step[] = (path === 'experienced')
    ? [1, 4]
    : (path === 'has_starter')
      ? [1, 3, 5, 4]
      : [1, 2, 3, 4] // beginner, has_kit, or not yet chosen
  const currentDotIndex = stepDots.indexOf(step)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* ── Step 1: Routing question ── */}
      {step === 1 && (
        <div className="py-8">
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4" aria-hidden="true">🍞</span>
            <h1 className="font-heading text-3xl font-bold text-char mb-3">
              Welcome to BreadBook
            </h1>
            <p className="text-ash text-lg max-w-md mx-auto">
              Where are you starting from?
            </p>
          </div>

          <div className="space-y-3 max-w-sm mx-auto">
            {PATH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handlePathSelect(opt.value)}
                className="w-full flex items-center gap-4 bg-steam border border-dough rounded-xl px-5 py-4 text-left hover:border-crust hover:bg-crust/5 transition-colors"
              >
                <span className="text-3xl" aria-hidden="true">{opt.emoji}</span>
                <div>
                  <p className="font-medium text-char">{opt.label}</p>
                  <p className="text-sm text-ash">{opt.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Expectation screen (beginner + kit) ── */}
      {step === 2 && (
        <div className="py-8 max-w-sm mx-auto">
          <button onClick={() => { setStep(1); setPath(null) }} className="text-sm text-ash hover:text-char transition-colors mb-6 flex items-center gap-1">
            ← Back
          </button>
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4" aria-hidden="true">🌱</span>
            <h2 className="font-heading text-2xl font-bold text-char mb-2">
              Here's what to expect
            </h2>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-steam border border-dough rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">📅</span>
                <div>
                  <p className="font-medium text-char text-sm">14 days to a ready starter</p>
                  <p className="text-ash text-sm">About 5 minutes of attention each day — we'll tell you exactly what to do.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🍽️</span>
                <div>
                  <p className="font-medium text-char text-sm">You'll "feed" it daily</p>
                  <p className="text-ash text-sm">Feeding means adding fresh flour and water to keep it alive and active.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🛠️</span>
                <div>
                  <p className="font-medium text-char text-sm">If something looks off, we've got you</p>
                  <p className="text-ash text-sm">
                    The <span className="text-crust font-medium">Troubleshooter</span> covers 20+ common problems — weird smells, no bubbles, you name it.
                  </p>
                </div>
              </div>
            </div>

            {path === 'has_kit' && (
              <div className="bg-wheat/10 border border-wheat/30 rounded-xl px-4 py-3">
                <p className="text-sm text-ash">
                  <span className="font-medium text-char">Got a kit?</span> Start the clock from when you first activated your starter (mixed it with water), not from when you got the kit.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors"
          >
            Let's set up your starter →
          </button>
          <button
            onClick={() => saveAndFinish(path!)}
            className="block mx-auto mt-3 text-ash text-sm hover:text-char transition-colors"
          >
            I'll set it up later
          </button>
        </div>
      )}

      {/* ── Step 3: Name your starter ── */}
      {step === 3 && (
        <div className="py-8">
          <button
            onClick={() => setStep(path === 'has_starter' ? 1 : 2)}
            className="text-sm text-ash hover:text-char transition-colors mb-6 flex items-center gap-1"
          >
            ← Back
          </button>
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3" aria-hidden="true">🫙</span>
            <h2 className="font-heading text-2xl font-bold text-char mb-2">
              {path === 'has_starter' ? 'Add your starter' : 'Name your starter'}
            </h2>
            <p className="text-ash max-w-md mx-auto">
              {path === 'has_starter'
                ? "Add it to BreadBook and we'll help you track feedings and activity."
                : "Give it a name — we'll use it to track your feedings and guide you through the next 14 days."}
            </p>
          </div>

          <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-6 max-w-sm mx-auto">
            <div className="mb-6">
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
                autoFocus
              />
              <p className="text-xs text-ash mt-1">You can change the flour type later in your starter settings.</p>
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
            onClick={() => setStep(4)}
            className="block mx-auto mt-4 text-ash text-sm hover:text-char transition-colors"
          >
            Skip for now
          </button>
        </div>
      )}

      {/* ── Step 5: Last fed (has_starter only) ── */}
      {step === 5 && (
        <div className="py-8 max-w-sm mx-auto">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3" aria-hidden="true">🍽️</span>
            <h2 className="font-heading text-2xl font-bold text-char mb-2">
              When did you last feed {starterName || 'it'}?
            </h2>
            <p className="text-ash text-sm max-w-xs mx-auto">
              So we know when to remind you next.
            </p>
          </div>

          <div className="space-y-3 mb-3">
            {LAST_FED_OPTIONS.map((opt) => (
              <button
                key={opt.hoursAgo}
                onClick={() => handleLastFed(opt.hoursAgo)}
                disabled={lastFedSaving}
                className="w-full flex items-center gap-4 bg-steam border border-dough rounded-xl px-5 py-4 text-left hover:border-crust hover:bg-crust/5 transition-colors disabled:opacity-50"
              >
                <p className="font-medium text-char">{opt.label}</p>
              </button>
            ))}
          </div>

          <p className="text-xs text-ash text-center mb-5">
            Don't worry — we'll help you get it back on track.
          </p>

          <button
            onClick={() => handleLastFed(null)}
            disabled={lastFedSaving}
            className="block mx-auto text-ash text-sm hover:text-char transition-colors"
          >
            Not sure — skip for now
          </button>
        </div>
      )}

      {/* ── Step 4: Pick your first bake ── */}
      {step === 4 && (
        <div className="py-8">
          <div className="text-center mb-6">
            <span className="text-5xl block mb-3" aria-hidden="true">👩‍🍳</span>
            <h2 className="font-heading text-2xl font-bold text-char mb-2">
                {path === 'experienced' ? 'Pick Your First Recipe' : 'Pick your first bake'}
            </h2>
            <p className="text-ash max-w-md mx-auto">
              {path === 'experienced'
                ? 'Browse all recipes or start with one of these.'
                : 'These are great first loaves. Tap one to save it for later.'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            {recipesToShow.map((recipe) => (
              <div key={recipe.id} onClick={async () => { await saveAndFinish(path!); navigate(`/recipes/${recipe.id}`) }}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={async () => { await saveAndFinish(path!); navigate('/recipes') }}
              className="text-crust font-medium text-sm hover:text-crust-light transition-colors"
            >
              Browse All Recipes
            </button>
            <button
              onClick={async () => saveAndFinish(path!)}
              className="block mx-auto text-ash text-sm hover:text-char transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {stepDots.map((s, i) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentDotIndex ? 'bg-crust' : i < currentDotIndex ? 'bg-crust/40' : 'bg-dough'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

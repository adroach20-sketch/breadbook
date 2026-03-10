import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { StepView } from './StepView'
import { BakeComplete } from './BakeComplete'
import { useWakeLock } from '../../hooks/useWakeLock'
import { breadbookOriginals } from '../../data/originals'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import type { Recipe } from '../../data/types'

const BAKE_SESSION_KEY = 'breadbook-active-bake'

interface BakeSession {
  recipeId: string
  currentStep: number
  startedAt: string
  dbSessionId?: string
}

export function BakeMode() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const wakeLock = useWakeLock()

  // Load recipe
  useEffect(() => {
    async function loadRecipe() {
      // Try Supabase
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {
        setRecipe(data as Recipe)
      } else {
        const local = breadbookOriginals.find((r) => r.id === id)
        setRecipe(local || null)
      }
      setLoading(false)
    }
    loadRecipe()
  }, [id])

  // Restore session from localStorage (survive page refresh)
  useEffect(() => {
    const saved = localStorage.getItem(BAKE_SESSION_KEY)
    if (saved) {
      try {
        const session: BakeSession = JSON.parse(saved)
        if (session.recipeId === id) {
          setCurrentStep(session.currentStep)
          if (session.dbSessionId) setSessionId(session.dbSessionId)
        } else {
          localStorage.removeItem(BAKE_SESSION_KEY)
        }
      } catch {
        localStorage.removeItem(BAKE_SESSION_KEY)
      }
    }
  }, [id])

  // Save session to localStorage on step change
  useEffect(() => {
    if (recipe && !isComplete) {
      const session: BakeSession = {
        recipeId: recipe.id,
        currentStep,
        startedAt: new Date().toISOString(),
        dbSessionId: sessionId || undefined,
      }
      localStorage.setItem(BAKE_SESSION_KEY, JSON.stringify(session))
    }
  }, [currentStep, recipe, isComplete, sessionId])

  // Request wake lock on mount
  useEffect(() => {
    wakeLock.request()
    return () => { wakeLock.release() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Create bake_session record on first load
  useEffect(() => {
    async function createSession() {
      if (!user || !recipe || sessionId) return

      const { data, error } = await supabase
        .from('bake_sessions')
        .insert({
          user_id: user.id,
          recipe_id: recipe.id,
          is_active: true,
        })
        .select('id')
        .single()

      if (!error && data) {
        setSessionId(data.id)
      }
    }
    createSession()
  }, [user, recipe, sessionId])

  // Mark bake as complete
  const handleComplete = async () => {
    setIsComplete(true)
    localStorage.removeItem(BAKE_SESSION_KEY)
    // Clean up any persisted timer states for this recipe
    if (recipe) {
      for (let i = 0; i < recipe.steps.length; i++) {
        localStorage.removeItem(`breadbook-timer-${recipe.id}-${i}`)
      }
    }
    wakeLock.release()

    if (sessionId) {
      await supabase
        .from('bake_sessions')
        .update({ completed_at: new Date().toISOString(), is_active: false })
        .eq('id', sessionId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-crumb flex items-center justify-center">
        <p className="text-ash">Loading bake...</p>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-crumb flex items-center justify-center text-center px-6">
        <div>
          <span className="text-4xl mb-3 block">🤔</span>
          <p className="text-ash mb-4">Recipe not found.</p>
          <button
            onClick={() => navigate('/recipes')}
            className="text-crust font-medium hover:underline"
          >
            Back to recipes
          </button>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return <BakeComplete recipeTitle={recipe.title} recipeId={recipe.id} sessionId={sessionId || undefined} />
  }

  const steps = recipe.steps
  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  // Only show Academy card on the first step with each academy_key
  const firstAcademyStepIndex = new Map<string, number>()
  steps.forEach((s, i) => {
    if (s.academy_key && !firstAcademyStepIndex.has(s.academy_key)) {
      firstAcademyStepIndex.set(s.academy_key, i)
    }
  })
  const showAcademy = step.academy_key
    ? firstAcademyStepIndex.get(step.academy_key) === currentStep
    : false

  return (
    <div className="min-h-screen bg-crumb flex flex-col">
      {/* Top bar */}
      <header className="bg-crust text-steam px-4 py-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => {
            if (confirm('Exit bake mode? Your progress is saved.')) {
              navigate(`/recipes/${recipe.id}`)
            }
          }}
          className="text-sm text-dough/70 hover:text-steam transition-colors"
        >
          ← Exit
        </button>
        <span className="font-heading font-semibold text-sm truncate mx-4">
          {recipe.title}
        </span>
        <span className="text-xs text-dough/70">
          {currentStep + 1}/{steps.length}
        </span>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-dough flex-shrink-0">
        <div
          className="h-full bg-wheat transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step content */}
      <StepView step={step} stepIndex={currentStep} totalSteps={steps.length} recipeId={recipe.id} showAcademy={showAcademy} />

      {/* Navigation */}
      <div className="flex gap-3 px-6 pb-8 pt-4 flex-shrink-0 max-w-lg mx-auto w-full">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="flex-1 bg-steam text-ash py-3 rounded-xl font-medium border border-dough disabled:opacity-30 hover:bg-dough transition-colors"
        >
          Previous
        </button>
        {isLastStep ? (
          <button
            onClick={handleComplete}
            className="flex-1 bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust-dark transition-colors"
          >
            Complete Bake
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
            className="flex-1 bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust-dark transition-colors"
          >
            Next Step
          </button>
        )}
      </div>
    </div>
  )
}

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { StepView } from './StepView'
import { BakeComplete } from './BakeComplete'
import { useWakeLock } from '../../hooks/useWakeLock'
import { useBakeSession } from '../../hooks/useBakeSession'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'

export function BakeMode() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isFirstBake, setIsFirstBake] = useState(false)
  const [showExitMenu, setShowExitMenu] = useState(false)
  const exitMenuRef = useRef<HTMLDivElement>(null)

  const wakeLock = useWakeLock()
  const {
    recipe, currentStep, setCurrentStep, isComplete, loading, sessionId,
    foldLog, riseLog, roomTemp, doughFeelLog, doughSmellLog,
    shapingMethodLog, shapingFeelLog, fridgeLog, pokeLog,
    handleFoldDone, handleRiseCheck, handleRoomTemp,
    handleDoughFeel, handleDoughSmell, handleShapingMethod, handleShapingFeel,
    handleFridgeIn, handlePokeTest, handleOffPlan, handleAdvanceStep,
    handleComplete: completeSession, handleAbandon: abandonSession,
  } = useBakeSession(id)

  // Check if this is the user's first completed bake
  useEffect(() => {
    if (!user) return
    supabase
      .from('bake_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .then(({ count, error }) => {
        if (!error) setIsFirstBake(count === 0)
      })
  }, [user])

  // Request wake lock on mount
  useEffect(() => {
    wakeLock.request()
    return () => { wakeLock.release() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleComplete = async () => {
    await completeSession()
    wakeLock.release()
  }

  const handleAbandon = async () => {
    await abandonSession()
    wakeLock.release()
    navigate('/recipes')
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
    return <BakeComplete recipeTitle={recipe.title} recipeId={recipe.id} sessionId={sessionId || undefined} isFirstBake={isFirstBake} />
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

  // Resolve step ingredients from ingredient_ids
  const stepIngredients = step.ingredient_ids
    ? step.ingredient_ids
        .map((id) => recipe.ingredients.find((ing) => ing.id === id))
        .filter((ing): ing is NonNullable<typeof ing> => ing != null)
    : []

  return (
    <div className="min-h-screen bg-crumb flex flex-col">
      {/* Top bar */}
      <header className="bg-crust text-steam px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="relative" ref={exitMenuRef}>
          <button
            onClick={() => setShowExitMenu((v) => !v)}
            className="text-sm text-steam/70 hover:text-steam transition-colors"
          >
            ← Exit
          </button>
          {showExitMenu && (
            <div className="absolute left-0 top-8 bg-steam text-char rounded-xl shadow-lg border border-dough w-52 z-50 overflow-hidden">
              <button
                onClick={() => { setShowExitMenu(false); navigate(`/recipes/${recipe.id}`) }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-dough/50 transition-colors border-b border-dough"
              >
                <span className="font-medium block">Save & exit</span>
                <span className="text-xs text-ash">Resume where you left off</span>
              </button>
              <button
                onClick={() => {
                  setShowExitMenu(false)
                  if (confirm('Stop this bake? This cannot be undone.')) {
                    handleAbandon()
                  }
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 transition-colors"
              >
                <span className="font-medium block text-red-600">Stop bake</span>
                <span className="text-xs text-ash">Clears session, starts fresh next time</span>
              </button>
            </div>
          )}
        </div>
        <span className="font-heading font-semibold text-sm truncate mx-4">
          {recipe.title}
        </span>
        <span className="text-xs text-steam/70 flex items-center gap-2">
          {roomTemp && <span className="text-steam font-medium">{roomTemp}°F</span>}
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
      <StepView
        step={step}
        stepIndex={currentStep}
        totalSteps={steps.length}
        recipeId={recipe.id}
        showAcademy={showAcademy}
        ingredients={stepIngredients}
        foldLog={foldLog}
        onFoldDone={() => handleFoldDone(currentStep)}
        riseLog={riseLog}
        onRiseCheck={(value) => handleRiseCheck(currentStep, value)}
        roomTemp={roomTemp}
        onRoomTemp={(value) => handleRoomTemp(currentStep, value)}
        onAdvance={handleAdvanceStep}
        doughFeelLog={doughFeelLog}
        doughSmellLog={doughSmellLog}
        onDoughFeel={(value) => handleDoughFeel(currentStep, value)}
        onDoughSmell={(value) => handleDoughSmell(currentStep, value)}
        shapingMethodLog={shapingMethodLog}
        shapingFeelLog={shapingFeelLog}
        onShapingMethod={(value) => handleShapingMethod(currentStep, value)}
        onShapingFeel={(value) => handleShapingFeel(currentStep, value)}
        fridgeLog={fridgeLog}
        pokeLog={pokeLog}
        onFridgeIn={() => handleFridgeIn(currentStep)}
        onPokeTest={(value) => handlePokeTest(currentStep, value, step.type)}
        onOffPlan={(reason, note) => handleOffPlan(currentStep, reason, note, step.type)}
      />

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

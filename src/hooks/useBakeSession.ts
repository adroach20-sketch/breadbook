import { useState, useEffect, useCallback } from 'react'
import { useBakeEvents } from './useBakeEvents'
import { breadbookOriginals } from '../data/originals'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type { Recipe } from '../data/types'

const BAKE_SESSION_KEY = 'breadbook-active-bake'

interface BakeSessionStorage {
  recipeId: string
  currentStep: number
  startedAt: string
  dbSessionId?: string
}

export function useBakeSession(recipeId: string | undefined) {
  const { user } = useAuth()

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const { events, logEvent, getEventsByType, clearEvents } = useBakeEvents(recipeId, sessionId, user?.id)

  // Derived bake event data
  const foldLog = getEventsByType('fold_done')
  const riseLog = getEventsByType('rise_check')
  const roomTempEvent = events.find((e) => e.eventType === 'room_temp')
  const roomTemp = roomTempEvent?.eventValue ?? null
  const doughFeelLog = getEventsByType('dough_feel')
  const doughSmellLog = getEventsByType('dough_smell')
  const shapingMethodLog = getEventsByType('shaping_method')
  const shapingFeelLog = getEventsByType('shaping_feel')
  const fridgeLog = getEventsByType('fridge_in')
  const pokeLog = getEventsByType('poke_test')

  // Event handlers
  const handleFoldDone = useCallback(
    (stepIndex: number) => {
      logEvent({ stepIndex, stepType: 'stretch_fold', eventType: 'fold_done', eventValue: null })
    },
    [logEvent]
  )

  const handleRiseCheck = useCallback(
    (stepIndex: number, value: string) => {
      logEvent({ stepIndex, stepType: 'bulk_ferment', eventType: 'rise_check', eventValue: value })
    },
    [logEvent]
  )

  const handleRoomTemp = useCallback(
    (stepIndex: number, value: string) => {
      logEvent({ stepIndex, stepType: 'stretch_fold', eventType: 'room_temp', eventValue: value })
    },
    [logEvent]
  )

  const handleDoughFeel = useCallback(
    (stepIndex: number, value: string) => {
      logEvent({ stepIndex, stepType: 'bulk_ferment', eventType: 'dough_feel', eventValue: value })
    },
    [logEvent]
  )

  const handleDoughSmell = useCallback(
    (stepIndex: number, value: string) => {
      logEvent({ stepIndex, stepType: 'bulk_ferment', eventType: 'dough_smell', eventValue: value })
    },
    [logEvent]
  )

  const handleShapingMethod = useCallback(
    (stepIndex: number, value: string) => {
      logEvent({ stepIndex, stepType: 'shape', eventType: 'shaping_method', eventValue: value })
    },
    [logEvent]
  )

  const handleShapingFeel = useCallback(
    (stepIndex: number, value: string) => {
      logEvent({ stepIndex, stepType: 'shape', eventType: 'shaping_feel', eventValue: value })
    },
    [logEvent]
  )

  const handleFridgeIn = useCallback(
    (stepIndex: number) => {
      logEvent({ stepIndex, stepType: 'cold_proof', eventType: 'fridge_in', eventValue: null })
    },
    [logEvent]
  )

  const handlePokeTest = useCallback(
    (stepIndex: number, value: string, stepType: string = 'proof') => {
      logEvent({ stepIndex, stepType, eventType: 'poke_test', eventValue: value })
    },
    [logEvent]
  )

  const handleOffPlan = useCallback(
    (stepIndex: number, reason: string, note?: string, stepType: string = 'custom') => {
      const value = JSON.stringify({ reason, ...(note ? { note } : {}) })
      logEvent({ stepIndex, stepType, eventType: 'off_plan', eventValue: value })
    },
    [logEvent]
  )

  const handleAdvanceStep = useCallback(() => {
    setCurrentStep((s) => Math.min((recipe?.steps.length ?? 1) - 1, s + 1))
  }, [recipe])

  // Load recipe
  useEffect(() => {
    async function loadRecipe() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single()

      if (!error && data) {
        setRecipe(data as Recipe)
      } else {
        const local = breadbookOriginals.find((r) => r.id === recipeId)
        setRecipe(local || null)
      }
      setLoading(false)
    }
    loadRecipe()
  }, [recipeId])

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(BAKE_SESSION_KEY)
    if (saved) {
      try {
        const session: BakeSessionStorage = JSON.parse(saved)
        if (session.recipeId === recipeId) {
          setCurrentStep(session.currentStep)
          if (session.dbSessionId) setSessionId(session.dbSessionId)
        } else {
          localStorage.removeItem(BAKE_SESSION_KEY)
        }
      } catch {
        localStorage.removeItem(BAKE_SESSION_KEY)
      }
    }
  }, [recipeId])

  // Save session to localStorage on step change
  useEffect(() => {
    if (recipe && !isComplete) {
      const session: BakeSessionStorage = {
        recipeId: recipe.id,
        currentStep,
        startedAt: new Date().toISOString(),
        dbSessionId: sessionId || undefined,
      }
      localStorage.setItem(BAKE_SESSION_KEY, JSON.stringify(session))
    }
  }, [currentStep, recipe, isComplete, sessionId])

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
  const handleComplete = useCallback(async () => {
    setIsComplete(true)
    localStorage.removeItem(BAKE_SESSION_KEY)
    if (recipe) {
      for (let i = 0; i < recipe.steps.length; i++) {
        localStorage.removeItem(`breadbook-timer-${recipe.id}-${i}`)
      }
    }
    clearEvents()

    if (sessionId) {
      await supabase
        .from('bake_sessions')
        .update({ completed_at: new Date().toISOString(), is_active: false })
        .eq('id', sessionId)
    }
  }, [recipe, sessionId, clearEvents])

  // Abandon bake — clears local session and marks Supabase session inactive
  const handleAbandon = useCallback(async () => {
    localStorage.removeItem(BAKE_SESSION_KEY)
    if (recipe) {
      for (let i = 0; i < recipe.steps.length; i++) {
        localStorage.removeItem(`breadbook-timer-${recipe.id}-${i}`)
      }
    }
    clearEvents()

    if (sessionId) {
      await supabase
        .from('bake_sessions')
        .update({ is_active: false })
        .eq('id', sessionId)
    }
  }, [recipe, sessionId, clearEvents])

  return {
    // State
    recipe,
    currentStep,
    setCurrentStep,
    isComplete,
    loading,
    sessionId,

    // Derived event data
    foldLog,
    riseLog,
    roomTemp,
    doughFeelLog,
    doughSmellLog,
    shapingMethodLog,
    shapingFeelLog,
    fridgeLog,
    pokeLog,

    // Handlers
    handleFoldDone,
    handleRiseCheck,
    handleRoomTemp,
    handleDoughFeel,
    handleDoughSmell,
    handleShapingMethod,
    handleShapingFeel,
    handleFridgeIn,
    handlePokeTest,
    handleOffPlan,
    handleAdvanceStep,
    handleComplete,
    handleAbandon,
  }
}

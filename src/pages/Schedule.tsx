import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { ScheduleForm } from '../features/schedule/ScheduleForm'
import { ScheduleTimeline } from '../features/schedule/ScheduleTimeline'
import { ScheduleHistory } from '../features/schedule/ScheduleHistory'
import { generateSchedule } from '../lib/schedule-engine'
import type { GenerateScheduleInput, GenerateScheduleResult } from '../lib/schedule-engine'
import type { SavedSchedule } from '../data/types'

type ScheduleView = 'history' | 'form' | 'timeline'

interface SchedulePageProps {
  initialView?: ScheduleView
}

export function Schedule({ initialView = 'history' }: SchedulePageProps) {
  const { user } = useAuth()

  const [view, setView] = useState<ScheduleView>(initialView)
  const [result, setResult] = useState<GenerateScheduleResult | null>(null)
  const [input, setInput] = useState<GenerateScheduleInput | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const handleGenerate = useCallback((formInput: GenerateScheduleInput) => {
    setInput(formInput)
    const scheduleResult = generateSchedule(formInput)
    setResult(scheduleResult)
    setView('timeline')
    setSaveError('')
  }, [])

  const handleSave = useCallback(async () => {
    if (!user || !input || !result) return

    setSaving(true)
    setSaveError('')

    const { error } = await supabase.from('bake_schedules').insert({
      user_id: user.id,
      recipe_id: input.recipe.id,
      recipe_title: input.recipe.title,
      target_eat_time: input.targetEatTime.toISOString(),
      starter_name: input.starterName || null,
      starter_status: input.starterStatus,
      feed_speed: input.feedSpeed || null,
      room_temp_f: input.roomTempF,
      fridge_available: input.fridgeAvailable,
      schedule_steps: result.steps,
      warnings: result.warnings,
    })

    setSaving(false)

    if (error) {
      setSaveError('Could not save your schedule. Please try again.')
      return
    }

    // Go back to history to see the saved schedule
    setView('history')
    setResult(null)
    setInput(null)
  }, [user, input, result])

  const handleReuse = useCallback((_schedule: SavedSchedule) => {
    // Pre-fill the form would require the Recipe object,
    // but we can navigate to the form view for now.
    // The user will see the form and can adjust settings.
    setView('form')
  }, [])

  const handleBackToForm = useCallback(() => {
    setView('form')
  }, [])

  // Guard: if timeline view has no data, redirect to form
  useEffect(() => {
    if (view === 'timeline' && (!result || !input)) {
      setView('form')
    }
  }, [view, result, input])

  // Render based on current view
  switch (view) {
    case 'form':
      return <ScheduleForm onGenerate={handleGenerate} />

    case 'timeline':
      if (!result || !input) {
        return null // useEffect above will redirect to form
      }
      return (
        <>
          <ScheduleTimeline
            steps={result.steps}
            warnings={result.warnings}
            startTime={result.startTime}
            targetEatTime={input.targetEatTime}
            recipeTitle={input.recipe.title}
            recipeId={input.recipe.id}
            onSave={handleSave}
            onBack={handleBackToForm}
            saving={saving}
          />
          {saveError && (
            <div className="px-4 max-w-2xl mx-auto -mt-4 mb-6">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{saveError}</p>
            </div>
          )}
        </>
      )

    case 'history':
    default:
      return <ScheduleHistory onReuse={handleReuse} />
  }
}

/** Wrapper for /schedule/new route — opens directly to form */
export function ScheduleNew() {
  return <Schedule initialView="form" />
}

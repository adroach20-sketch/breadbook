import { Link } from 'react-router-dom'
import type { ScheduleStep } from '../../data/types'
import { ScheduleStepCard } from './ScheduleStepCard'
import { formatScheduleTime, formatDuration } from '../../lib/schedule-engine'

interface ScheduleTimelineProps {
  steps: ScheduleStep[]
  warnings: string[]
  startTime: Date
  targetEatTime: Date
  recipeTitle: string
  recipeId: string
  onSave: () => void
  onBack: () => void
  saving: boolean
}

export function ScheduleTimeline({
  steps,
  warnings,
  startTime,
  targetEatTime,
  recipeTitle,
  recipeId,
  onSave,
  onBack,
  saving,
}: ScheduleTimelineProps) {
  const totalHours = Math.round(
    (targetEatTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  )
  const activeSteps = steps.filter((s) => s.isActive).length
  const totalActiveMinutes = steps
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + s.durationMinutes, 0)

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-sm text-crust hover:text-crust-light mb-3 inline-flex items-center gap-1"
          aria-label="Back to schedule form"
        >
          <span aria-hidden="true">&larr;</span> Adjust settings
        </button>
        <h1 className="font-heading text-2xl font-bold text-char">
          Your Bake Schedule
        </h1>
        <p className="text-ash mt-1">{recipeTitle}</p>
      </div>

      {/* Summary card */}
      <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-4 mb-6 border border-dough">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-ash mb-0.5">Start</p>
            <p className="font-medium text-sm text-char">
              {formatScheduleTime(startTime.toISOString())}
            </p>
          </div>
          <div>
            <p className="text-xs text-ash mb-0.5">Total</p>
            <p className="font-medium text-sm text-char">
              ~{totalHours} hrs
            </p>
          </div>
          <div>
            <p className="text-xs text-ash mb-0.5">Hands-on</p>
            <p className="font-medium text-sm text-char">
              {activeSteps} steps, {formatDuration(totalActiveMinutes)}
            </p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2 mb-6">
          {warnings.map((warning, i) => (
            <div
              key={i}
              className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3"
              role="alert"
            >
              <p className="text-sm text-amber-800 dark:text-amber-200">{warning}</p>
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="mb-8">
        {steps.map((step, i) => (
          <ScheduleStepCard
            key={step.id}
            step={step}
            isFirst={i === 0}
            isLast={i === steps.length - 1}
          />
        ))}

        {/* Eat time marker */}
        <div className="flex gap-3 mt-1">
          <div className="flex flex-col items-center w-8 shrink-0">
            <div className="w-0.5 flex-1 bg-dough" />
            <div className="w-5 h-5 rounded-full shrink-0 bg-crust flex items-center justify-center">
              <span className="text-xs text-steam" aria-hidden="true">!</span>
            </div>
            <div className="w-0.5 flex-1 bg-transparent" />
          </div>
          <div className="flex-1 rounded-xl p-4 bg-crust/10 border border-crust/20">
            <p className="text-sm font-medium text-crust">
              {formatScheduleTime(targetEatTime.toISOString())}
            </p>
            <p className="font-heading font-semibold text-char">
              Time to eat!
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save This Schedule'}
        </button>
        <Link
          to={`/bake/${recipeId}`}
          className="block w-full text-center text-crust py-3 rounded-xl font-medium border border-dough hover:bg-dough/50 transition-colors"
        >
          Start Baking Now
        </Link>
        <button
          onClick={onBack}
          className="w-full text-ash py-3 rounded-xl font-medium hover:text-char transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}

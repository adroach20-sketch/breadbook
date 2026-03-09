import type { RecipeStep } from '../../data/types'
import { Timer } from './Timer'

interface StepViewProps {
  step: RecipeStep
  stepIndex: number
  totalSteps: number
  recipeId: string
}

export function StepView({ step, stepIndex, totalSteps, recipeId }: StepViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-lg mx-auto w-full">
      {/* Step type badge */}
      <span className="text-xs bg-wheat/30 text-ash px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
        {step.type.replace('_', ' ')}
      </span>

      {/* Step title */}
      <h2 className="font-heading text-2xl font-bold text-char text-center mb-3">
        {step.title}
      </h2>

      {step.is_optional && (
        <span className="text-xs bg-dough text-ash px-2 py-0.5 rounded mb-3">
          Optional Step
        </span>
      )}

      {/* Instructions */}
      <p className="text-ash text-center leading-relaxed mb-8 text-lg">
        {step.instruction}
      </p>

      {/* Timer */}
      <div className="w-full max-w-xs">
        <Timer minutes={step.timer_minutes} label={step.timer_label} storageKey={`breadbook-timer-${recipeId}-${stepIndex}`} />
      </div>

      {/* Step counter */}
      <p className="text-xs text-ash mt-6">
        Step {stepIndex + 1} of {totalSteps}
      </p>
    </div>
  )
}

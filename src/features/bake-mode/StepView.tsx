import type { RecipeStep, Ingredient } from '../../data/types'
import type { BakeEvent } from '../../hooks/useBakeEvents'
import { AcademyCard } from '../../components/AcademyCard'
import { Timer } from './Timer'
import { FoldTracker } from './FoldTracker'
import { RiseCheckIn } from './RiseCheckIn'
import { RoomTempInput } from './RoomTempInput'
import { StepIngredients } from './StepIngredients'

interface StepViewProps {
  step: RecipeStep
  stepIndex: number
  totalSteps: number
  recipeId: string
  showAcademy?: boolean
  ingredients?: Ingredient[]
  // In-bake logging props
  foldLog?: BakeEvent[]
  onFoldDone?: () => void
  riseLog?: BakeEvent[]
  onRiseCheck?: (value: string) => void
  roomTemp?: string | null
  onRoomTemp?: (value: string) => void
  onAdvance?: () => void
}

export function StepView({
  step,
  stepIndex,
  totalSteps,
  recipeId,
  showAcademy = true,
  ingredients = [],
  foldLog = [],
  onFoldDone,
  riseLog = [],
  onRiseCheck,
  roomTemp,
  onRoomTemp,
  onAdvance,
}: StepViewProps) {
  const isStretchFold = step.type === 'stretch_fold'
  const isBulkFerment = step.type === 'bulk_ferment'

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

      {/* Step ingredients checklist */}
      {ingredients.length > 0 && <StepIngredients ingredients={ingredients} />}

      {/* Instructions */}
      <p className="text-ash text-center leading-relaxed mb-4 text-lg">
        {step.instruction}
      </p>

      {/* Academy card — compact "learn more" link, only on first occurrence */}
      {showAcademy && <AcademyCard academyKey={step.academy_key} variant="compact" />}

      {/* Room temp prompt — on S&F steps if not yet captured */}
      {isStretchFold && onRoomTemp && (
        <RoomTempInput onSubmit={onRoomTemp} currentTemp={roomTemp ?? null} />
      )}

      {/* Timer */}
      <div className="w-full max-w-xs">
        <Timer minutes={step.timer_minutes} label={step.timer_label} storageKey={`breadbook-timer-${recipeId}-${stepIndex}`} />
      </div>

      {/* In-bake logging widgets — below timer, above step counter */}
      <div className="mt-4 w-full flex justify-center">
        {isStretchFold && onFoldDone && onAdvance && (
          <FoldTracker onFoldDone={onFoldDone} foldLog={foldLog} onAdvance={onAdvance} />
        )}

        {isBulkFerment && onRiseCheck && (
          <RiseCheckIn onRiseCheck={onRiseCheck} riseLog={riseLog} />
        )}
      </div>

      {/* Step counter */}
      <p className="text-xs text-ash mt-6">
        Step {stepIndex + 1} of {totalSteps}
      </p>
    </div>
  )
}

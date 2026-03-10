import type { RecipeStep, Ingredient } from '../../data/types'
import type { BakeEvent } from '../../hooks/useBakeEvents'
import { AcademyCard } from '../../components/AcademyCard'
import { Timer } from './Timer'
import { FoldTracker } from './FoldTracker'
import { RiseCheckIn } from './RiseCheckIn'
import { RoomTempInput } from './RoomTempInput'
import { StepIngredients } from './StepIngredients'
import { DoughObservation } from './DoughObservation'
import { ShapingLog } from './ShapingLog'
import { ProofingLog } from './ProofingLog'
import { OffPlanSheet } from './OffPlanSheet'

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
  // Phase 2 in-bake logging
  doughFeelLog?: BakeEvent[]
  doughSmellLog?: BakeEvent[]
  onDoughFeel?: (value: string) => void
  onDoughSmell?: (value: string) => void
  shapingMethodLog?: BakeEvent[]
  shapingFeelLog?: BakeEvent[]
  onShapingMethod?: (value: string) => void
  onShapingFeel?: (value: string) => void
  fridgeLog?: BakeEvent[]
  pokeLog?: BakeEvent[]
  onFridgeIn?: () => void
  onPokeTest?: (value: string) => void
  onOffPlan?: (reason: string, note?: string) => void
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
  doughFeelLog = [],
  doughSmellLog = [],
  onDoughFeel,
  onDoughSmell,
  shapingMethodLog = [],
  shapingFeelLog = [],
  onShapingMethod,
  onShapingFeel,
  fridgeLog = [],
  pokeLog = [],
  onFridgeIn,
  onPokeTest,
  onOffPlan,
}: StepViewProps) {
  const isStretchFold = step.type === 'stretch_fold'
  const isBulkFerment = step.type === 'bulk_ferment'
  const isShape = step.type === 'shape'
  const isProof = step.type === 'proof' || step.type === 'cold_proof'

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
      <div className="mt-4 w-full flex flex-col items-center gap-4">
        {isStretchFold && onFoldDone && onAdvance && (
          <FoldTracker onFoldDone={onFoldDone} foldLog={foldLog} onAdvance={onAdvance} />
        )}

        {isBulkFerment && onRiseCheck && (
          <RiseCheckIn onRiseCheck={onRiseCheck} riseLog={riseLog} />
        )}

        {isBulkFerment && onDoughFeel && onDoughSmell && (
          <DoughObservation
            onDoughFeel={onDoughFeel}
            onDoughSmell={onDoughSmell}
            feelLog={doughFeelLog}
            smellLog={doughSmellLog}
          />
        )}

        {isShape && onShapingMethod && onShapingFeel && (
          <ShapingLog
            onShapingMethod={onShapingMethod}
            onShapingFeel={onShapingFeel}
            methodLog={shapingMethodLog}
            feelLog={shapingFeelLog}
          />
        )}

        {isProof && onFridgeIn && onPokeTest && (
          <ProofingLog
            stepType={step.type as 'proof' | 'cold_proof'}
            onFridgeIn={onFridgeIn}
            onPokeTest={onPokeTest}
            fridgeLog={fridgeLog}
            pokeLog={pokeLog}
          />
        )}
      </div>

      {/* Step counter */}
      <p className="text-xs text-ash mt-6">
        Step {stepIndex + 1} of {totalSteps}
      </p>

      {/* Off-plan button — always visible */}
      {onOffPlan && <OffPlanSheet onOffPlan={onOffPlan} />}
    </div>
  )
}

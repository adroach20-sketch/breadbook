/**
 * Schedule Engine - Pure functions for reverse-engineering a bake timeline.
 * Works backwards from eat time to produce timestamped steps.
 * Temperature adjustment: linear model based on 70F baseline.
 * Times rounded to nearest 15 minutes.
 */

import type {
  Recipe,
  RecipeStep,
  StarterStatus,
  ScheduleStep,
  ScheduleCategory,
  StepType,
} from '../data/types'

const BASELINE_TEMP_F = 70
const TEMP_COEFFICIENT = 0.05

const DEFAULT_STEP_DURATIONS: Partial<Record<StepType, number>> = {
  mix: 15,
  autolyse: 30,
  levain: 240,
  stretch_fold: 5,
  lamination: 15,
  shape: 15,
  score: 5,
  proof: 90,
  cold_proof: 60,
  preheat: 30,
  bake: 30,
  cool: 60,
  custom: 15,
}

const TEMP_SENSITIVE_TYPES: Set<StepType> = new Set(['bulk_ferment', 'proof'])

const STARTER_PREP: Record<StarterStatus, { feeds: number; totalMinutes: number }> = {
  peak: { feeds: 0, totalMinutes: 0 },
  recently_fed: { feeds: 0, totalMinutes: 180 },
  fed_but_fallen: { feeds: 1, totalMinutes: 420 },
  dormant: { feeds: 2, totalMinutes: 1440 },
}

const ROOM_TEMP_PROOF_MINUTES = 90

function roundTo15(minutes: number): number {
  return Math.round(minutes / 15) * 15 || 15
}

function getTempFactor(roomTempF: number): number {
  const factor = 1 + (BASELINE_TEMP_F - roomTempF) * TEMP_COEFFICIENT
  return Math.max(0.3, Math.min(2.5, factor))
}

function getCategory(stepType: StepType | 'starter_feed'): ScheduleCategory {
  switch (stepType) {
    case 'starter_feed':
    case 'levain':
      return 'starter_prep'
    case 'mix':
    case 'autolyse':
    case 'stretch_fold':
    case 'lamination':
    case 'shape':
    case 'score':
      return 'dough_work'
    case 'bulk_ferment':
    case 'proof':
    case 'cold_proof':
      return 'proofing'
    case 'preheat':
    case 'bake':
      return 'baking'
    case 'cool':
      return 'cooling'
    case 'custom':
    default:
      return 'dough_work'
  }
}

function isActiveStep(stepType: StepType | 'starter_feed'): boolean {
  switch (stepType) {
    case 'mix':
    case 'stretch_fold':
    case 'lamination':
    case 'shape':
    case 'score':
    case 'starter_feed':
      return true
    default:
      return false
  }
}

function getStepDuration(
  step: RecipeStep,
  roomTempF: number,
  fridgeAvailable: boolean
): number {
  if (step.type === 'cold_proof' && !fridgeAvailable) {
    return roundTo15(ROOM_TEMP_PROOF_MINUTES * getTempFactor(roomTempF))
  }
  const baseDuration = step.timer_minutes ?? DEFAULT_STEP_DURATIONS[step.type] ?? 15
  if (TEMP_SENSITIVE_TYPES.has(step.type)) {
    return roundTo15(baseDuration * getTempFactor(roomTempF))
  }
  return roundTo15(baseDuration)
}

export interface GenerateScheduleInput {
  recipe: Recipe
  targetEatTime: Date
  starterStatus: StarterStatus
  starterName: string
  roomTempF: number
  fridgeAvailable: boolean
}

export interface GenerateScheduleResult {
  steps: ScheduleStep[]
  warnings: string[]
  startTime: Date
}

/**
 * Generate a reverse-engineered bake schedule.
 *
 * Algorithm:
 * 1. Walk recipe steps in reverse order, subtracting durations from eat time
 * 2. Apply temperature adjustments for temp-sensitive steps
 * 3. Add starter prep feeds based on starter status
 * 4. Generate warnings for timeline issues
 * 5. Round all times to 15-minute increments
 */
export function generateSchedule(input: GenerateScheduleInput): GenerateScheduleResult {
  const { recipe, targetEatTime, starterStatus, starterName, roomTempF, fridgeAvailable } = input
  const warnings: string[] = []

  // Build schedule steps in reverse — we start at eat time and walk backwards
  const rawSteps: Array<{
    title: string
    description: string
    durationMinutes: number
    category: ScheduleCategory
    isActive: boolean
    recipeStepId: string | null
    type: StepType | 'starter_feed'
  }> = []

  // Walk recipe steps in their natural order (we'll reverse-assign times later)
  const sortedRecipeSteps = [...recipe.steps]
    .filter((s) => !s.is_optional)
    .sort((a, b) => a.order - b.order)

  for (const step of sortedRecipeSteps) {
    const duration = getStepDuration(step, roomTempF, fridgeAvailable)
    const stepTitle = step.type === 'cold_proof' && !fridgeAvailable
      ? `${step.title} (room temp — no fridge)`
      : step.title

    rawSteps.push({
      title: stepTitle,
      description: step.instruction,
      durationMinutes: duration,
      category: getCategory(step.type),
      isActive: isActiveStep(step.type),
      recipeStepId: step.id,
      type: step.type,
    })
  }

  // Add starter prep steps at the beginning (before all recipe steps)
  const prep = STARTER_PREP[starterStatus]
  if (prep.feeds > 0) {
    const feedDuration = roundTo15(prep.totalMinutes / prep.feeds)
    for (let i = prep.feeds; i >= 1; i--) {
      const feedLabel = prep.feeds === 1
        ? 'Feed Your Starter'
        : `Feed Your Starter (${prep.feeds - i + 1} of ${prep.feeds})`
      const feedDescription = i === 1
        ? `Give ${starterName || 'your starter'} a fresh feed. It should be bubbly and doubled before you start mixing.`
        : `Feed ${starterName || 'your starter'} and let it rise. It needs another feed after this one before it's ready.`

      rawSteps.unshift({
        title: feedLabel,
        description: feedDescription,
        durationMinutes: feedDuration,
        category: 'starter_prep',
        isActive: true,
        recipeStepId: null,
        type: 'starter_feed',
      })
    }
  } else if (starterStatus === 'recently_fed') {
    // Starter was recently fed — just needs time to peak
    rawSteps.unshift({
      title: 'Wait for Starter to Peak',
      description: `${starterName || 'Your starter'} was recently fed. Wait until it's bubbly and has roughly doubled before mixing.`,
      durationMinutes: roundTo15(prep.totalMinutes),
      category: 'starter_prep',
      isActive: false,
      recipeStepId: null,
      type: 'starter_feed',
    })
  }

  // Now assign times — walk backwards from eat time
  let cursor = new Date(targetEatTime.getTime())
  const scheduleSteps: ScheduleStep[] = []

  for (let i = rawSteps.length - 1; i >= 0; i--) {
    const raw = rawSteps[i]
    const endTime = new Date(cursor.getTime())
    const startTime = new Date(cursor.getTime() - raw.durationMinutes * 60 * 1000)

    // Round start time to nearest 15 minutes
    startTime.setMinutes(Math.round(startTime.getMinutes() / 15) * 15, 0, 0)

    scheduleSteps.unshift({
      id: `sched-${i}`,
      order: i + 1,
      title: raw.title,
      description: raw.description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationMinutes: raw.durationMinutes,
      category: raw.category,
      isActive: raw.isActive,
      recipeStepId: raw.recipeStepId,
    })

    cursor = startTime
  }

  const startTime = scheduleSteps.length > 0
    ? new Date(scheduleSteps[0].startTime)
    : targetEatTime

  // ── Generate warnings ──

  const now = new Date()
  const totalHours = (targetEatTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

  // Warning: schedule starts in the past
  if (startTime < now) {
    const hoursAgo = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60 * 60))
    if (hoursAgo <= 2) {
      warnings.push(
        `This schedule starts about ${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago. You can still make it work — just get started right away!`
      )
    } else {
      warnings.push(
        `This recipe needs about ${Math.round(totalHours)} hours from start to table. You'd need to start ${hoursAgo} hours ago to hit your eat time. Want to push your eat time back?`
      )
    }
  }

  // Warning: very early start
  const startHour = startTime.getHours()
  if (startHour >= 0 && startHour < 5 && startTime > now) {
    warnings.push(
      `Heads up — this schedule has you starting at ${formatTimeShort(startTime)}. That's early! A cold proof overnight could give you more flexibility.`
    )
  }

  // Warning: very late finish
  const eatHour = targetEatTime.getHours()
  if (eatHour >= 23 || eatHour < 4) {
    warnings.push(
      `Your bread won't be ready until ${formatTimeShort(targetEatTime)}. Late-night baking is fun, but make sure you'll be awake for the oven!`
    )
  }

  // Warning: compressed timeline (less than 80% of base recipe time)
  const baseRecipeMinutes = recipe.steps
    .filter((s) => !s.is_optional)
    .reduce((sum, s) => sum + (s.timer_minutes ?? DEFAULT_STEP_DURATIONS[s.type] ?? 15), 0)
  const actualRecipeMinutes = rawSteps
    .filter((s) => s.type !== 'starter_feed')
    .reduce((sum, s) => sum + s.durationMinutes, 0)

  if (actualRecipeMinutes < baseRecipeMinutes * 0.8) {
    warnings.push(
      `Your warm kitchen (${roomTempF}°F) speeds things up quite a bit. Keep an eye on your dough — it may be ready sooner than the schedule says.`
    )
  }

  // Warning: no fridge available changes the cold proof
  if (!fridgeAvailable && recipe.steps.some((s) => s.type === 'cold_proof')) {
    warnings.push(
      `Without a fridge, we swapped the cold proof for a room-temp proof. The flavor will be a bit less developed, but the bread will still be delicious.`
    )
  }

  // Warning: dormant starter needs a lot of lead time
  if (starterStatus === 'dormant') {
    warnings.push(
      `Your starter needs about 24 hours of feeding before it's ready to bake. The schedule includes two feeds — make sure ${starterName || 'your starter'} is in a warm spot (${roomTempF}°F or warmer).`
    )
  }

  return { steps: scheduleSteps, warnings, startTime }
}

/** Format a Date as short time like "8:00 AM" */
function formatTimeShort(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/** Format a Date as "Thu 8:00 AM" */
export function formatScheduleTime(isoString: string): string {
  const date = new Date(isoString)
  const day = date.toLocaleDateString('en-US', { weekday: 'short' })
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${day} ${time}`
}

/** Format duration like "4 hrs 30 min" or "15 min" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hrs} hr${hrs === 1 ? '' : 's'}`
  return `${hrs} hr${hrs === 1 ? '' : 's'} ${mins} min`
}

/** Category display config */
export const CATEGORY_CONFIG: Record<ScheduleCategory, { label: string; dotClass: string; bgClass: string }> = {
  starter_prep: { label: 'Starter Prep', dotClass: 'bg-green-500', bgClass: 'bg-green-50 dark:bg-green-950/30' },
  dough_work: { label: 'Dough Work', dotClass: 'bg-blue-500', bgClass: 'bg-blue-50 dark:bg-blue-950/30' },
  proofing: { label: 'Proofing', dotClass: 'bg-amber-500', bgClass: 'bg-amber-50 dark:bg-amber-950/30' },
  baking: { label: 'Baking', dotClass: 'bg-red-500', bgClass: 'bg-red-50 dark:bg-red-950/30' },
  cooling: { label: 'Cooling', dotClass: 'bg-purple-500', bgClass: 'bg-purple-50 dark:bg-purple-950/30' },
}

/** Starter status options with friendly labels */
export const STARTER_STATUS_OPTIONS: Array<{ value: StarterStatus; label: string; hint: string }> = [
  { value: 'peak', label: "It's bubbly and doubled!", hint: 'Ready to bake right now' },
  { value: 'recently_fed', label: 'I fed it a few hours ago', hint: 'Needs a bit more time to peak' },
  { value: 'fed_but_fallen', label: "I fed it yesterday, it's fallen back", hint: 'Needs one more feed' },
  { value: 'dormant', label: "It's been in the fridge for a while", hint: 'Needs two feeds over ~24 hours' },
]

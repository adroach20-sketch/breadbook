/**
 * Schedule Engine v2 - Pure functions for reverse-engineering a bake timeline.
 * Works backwards from eat time to produce timestamped steps.
 *
 * v2 changes:
 * - 3 starter statuses (ready / needs_feed / neglected) instead of 4
 * - Feed speed picker (overnight 1:5:5 vs same_day 1:1:1) controls timing
 * - Feed step descriptions include actual weights
 * - Quiet hours enforcement (default 10pm-7am, user-configurable)
 * - Academy keys on schedule steps for inline knowledge cards
 * - Temperature adjustment: linear model based on 70F baseline
 * - Times rounded to nearest 15 minutes
 */

import type {
  Recipe,
  RecipeStep,
  StarterStatus,
  FeedSpeed,
  QuietHours,
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

const ROOM_TEMP_PROOF_MINUTES = 90

/** Feed timing by speed selection (minutes to peak, temperature-adjusted later) */
const FEED_TIMING: Record<FeedSpeed, { peakMinutes: number; ratio: string; description: string }> = {
  overnight: {
    peakMinutes: 540, // 9 hours (1:5:5)
    ratio: '1:5:5',
    description: 'Feed 10g starter + 50g flour + 50g water',
  },
  same_day: {
    peakMinutes: 300, // 5 hours (1:1:1)
    ratio: '1:1:1',
    description: 'Feed 50g starter + 50g flour + 50g water',
  },
}

export const DEFAULT_QUIET_HOURS: QuietHours = {
  enabled: true,
  start: 22, // 10 PM
  end: 7,    // 7 AM
}

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

/** Map recipe step types to academy keys */
function getAcademyKey(stepType: StepType | 'starter_feed'): string | null {
  switch (stepType) {
    case 'starter_feed': return 'starter_feed'
    case 'autolyse': return 'autolyse'
    case 'levain': return 'levain'
    case 'bulk_ferment': return 'bulk_ferment'
    case 'stretch_fold': return 'stretch_fold'
    case 'lamination': return 'lamination'
    case 'shape': return 'shape'
    case 'cold_proof': return 'cold_proof'
    case 'score': return 'score'
    case 'bake': return 'bake'
    case 'proof': return 'proof'
    case 'preheat': return 'preheat'
    case 'cool': return 'cool'
    case 'mix': return 'mix'
    default: return null
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

/** Check if an hour falls within quiet hours window */
function isInQuietHours(hour: number, quietHours: QuietHours): boolean {
  if (!quietHours.enabled) return false
  if (quietHours.start > quietHours.end) {
    // Spans midnight: e.g. 22-7 means 22,23,0,1,2,3,4,5,6 are quiet
    return hour >= quietHours.start || hour < quietHours.end
  }
  return hour >= quietHours.start && hour < quietHours.end
}

/** Find the next time outside quiet hours, moving forward from the given date */
function nextTimeAfterQuietHours(date: Date, quietHours: QuietHours): Date {
  if (!quietHours.enabled) return date
  const hour = date.getHours()
  if (!isInQuietHours(hour, quietHours)) return date

  const result = new Date(date.getTime())
  result.setHours(quietHours.end, 0, 0, 0)
  // If we're before midnight and quiet hours span midnight, jump to next day's end
  if (hour >= quietHours.start && quietHours.start > quietHours.end) {
    result.setDate(result.getDate() + 1)
  }
  // If we're already past the end hour on this calendar day
  if (result <= date) {
    result.setDate(result.getDate() + 1)
  }
  return result
}

export interface GenerateScheduleInput {
  recipe: Recipe
  targetEatTime: Date
  starterStatus: StarterStatus
  feedSpeed: FeedSpeed
  starterName: string
  roomTempF: number
  fridgeAvailable: boolean
  quietHours: QuietHours
}

export interface GenerateScheduleResult {
  steps: ScheduleStep[]
  warnings: string[]
  startTime: Date
}

interface RawStep {
  title: string
  description: string
  durationMinutes: number
  category: ScheduleCategory
  isActive: boolean
  recipeStepId: string | null
  type: StepType | 'starter_feed'
  academyKey: string | null
}

/**
 * Generate a reverse-engineered bake schedule.
 *
 * Algorithm:
 * 1. Walk recipe steps, calculate durations with temp adjustment
 * 2. Add starter prep feeds based on status + feed speed
 * 3. Assign times backwards from eat time
 * 4. Enforce quiet hours by extending passive steps before active ones
 * 5. Generate warnings for timeline issues
 * 6. Round all times to 15-minute increments
 */
export function generateSchedule(input: GenerateScheduleInput): GenerateScheduleResult {
  const { recipe, targetEatTime, starterStatus, feedSpeed, starterName, roomTempF, fridgeAvailable, quietHours } = input
  const warnings: string[] = []
  const name = starterName || 'your starter'
  const tempFactor = getTempFactor(roomTempF)

  // Build schedule steps in order (we'll assign times backwards later)
  const rawSteps: RawStep[] = []

  // Walk recipe steps in their natural order
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
      academyKey: getAcademyKey(step.type),
    })
  }

  // Add starter prep steps at the beginning
  // Feed steps are split into active "Feed" (5 min hands-on) + passive "Wait for Peak"
  // so quiet hours correctly allows feeding before bed with rising overnight
  const FEED_ACTIVE_MINUTES = 5

  if (starterStatus === 'needs_feed') {
    const timing = FEED_TIMING[feedSpeed]
    const totalMinutes = roundTo15(timing.peakMinutes * tempFactor)
    const waitMinutes = totalMinutes - FEED_ACTIVE_MINUTES
    const Name = name.charAt(0).toUpperCase() + name.slice(1)

    rawSteps.unshift(
      {
        title: 'Feed Your Starter',
        description: `${timing.description} (${timing.ratio} ratio). Mix well, cover, and leave in a warm spot.`,
        durationMinutes: FEED_ACTIVE_MINUTES,
        category: 'starter_prep',
        isActive: true,
        recipeStepId: null,
        type: 'starter_feed',
        academyKey: 'starter_feed',
      },
      {
        title: 'Wait for Starter to Peak',
        description: `${Name} needs about ${formatDuration(totalMinutes)} to peak at ${roomTempF}°F. It should be bubbly and roughly doubled before you start mixing. The float test works — drop a spoonful in water. If it floats, it's ready.`,
        durationMinutes: waitMinutes,
        category: 'starter_prep',
        isActive: false,
        recipeStepId: null,
        type: 'starter_feed',
        academyKey: null,
      }
    )
  } else if (starterStatus === 'neglected') {
    // Two feeds: first is a discard-and-refresh (uses slow ratio to bridge time),
    // second is the build feed using the user's selected speed
    const buildTiming = FEED_TIMING[feedSpeed]
    const buildTotal = roundTo15(buildTiming.peakMinutes * tempFactor)
    const buildWait = buildTotal - FEED_ACTIVE_MINUTES

    // First feed: always a slow refresh (1:5:5 to bridge overnight if needed)
    const refreshTotal = roundTo15(FEED_TIMING.overnight.peakMinutes * tempFactor)
    const refreshWait = refreshTotal - FEED_ACTIVE_MINUTES

    rawSteps.unshift(
      {
        title: 'Feed Your Starter (1 of 2) — Refresh',
        description: `Discard all but 20g of ${name}, then feed with 50g flour and 50g water (roughly 1:2.5:2.5). Mix well, cover, and leave in a warm spot.`,
        durationMinutes: FEED_ACTIVE_MINUTES,
        category: 'starter_prep',
        isActive: true,
        recipeStepId: null,
        type: 'starter_feed',
        academyKey: 'starter_feed',
      },
      {
        title: 'Wait for Signs of Life',
        description: `This first feed wakes up the yeast and bacteria. It doesn't need to peak perfectly — just show signs of life (some bubbles, slight rise). If you see no activity after ${formatDuration(refreshTotal)}, feed again before proceeding.`,
        durationMinutes: refreshWait,
        category: 'starter_prep',
        isActive: false,
        recipeStepId: null,
        type: 'starter_feed',
        academyKey: null,
      },
      {
        title: 'Feed Your Starter (2 of 2) — Build',
        description: `${buildTiming.description} (${buildTiming.ratio} ratio). This is the build feed — mix well, cover, and leave in a warm spot.`,
        durationMinutes: FEED_ACTIVE_MINUTES,
        category: 'starter_prep',
        isActive: true,
        recipeStepId: null,
        type: 'starter_feed',
        academyKey: 'starter_feed',
      },
      {
        title: 'Wait for Starter to Peak',
        description: `${name.charAt(0).toUpperCase() + name.slice(1)} should be bubbly and doubled before you start mixing. Should take about ${formatDuration(buildTotal)} at ${roomTempF}°F.`,
        durationMinutes: buildWait,
        category: 'starter_prep',
        isActive: false,
        recipeStepId: null,
        type: 'starter_feed',
        academyKey: null,
      }
    )
  }
  // starterStatus === 'ready': no prep steps needed

  // Assign times — walk backwards from eat time
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
      academyKey: raw.academyKey,
    })

    cursor = startTime
  }

  // ── Quiet hours enforcement ──
  // Scan for active steps that start during quiet hours and shift them
  if (quietHours.enabled) {
    let shifted = false
    for (let i = 0; i < scheduleSteps.length; i++) {
      const step = scheduleSteps[i]
      const stepStart = new Date(step.startTime)
      const startHour = stepStart.getHours()

      if (step.isActive && isInQuietHours(startHour, quietHours)) {
        // Find the preceding passive step to extend
        const prevPassiveIdx = findPrecedingPassiveStep(scheduleSteps, i)

        if (prevPassiveIdx !== -1) {
          // Calculate how much time to add: push the active step to quiet hours end
          const adjustedStart = nextTimeAfterQuietHours(stepStart, quietHours)
          const shiftMs = adjustedStart.getTime() - stepStart.getTime()

          if (shiftMs > 0) {
            // Extend the passive step's duration
            const passiveStep = scheduleSteps[prevPassiveIdx]
            const addedMinutes = Math.round(shiftMs / (60 * 1000))
            passiveStep.durationMinutes += addedMinutes
            passiveStep.endTime = new Date(
              new Date(passiveStep.endTime).getTime() + shiftMs
            ).toISOString()

            // If extending a cold_proof or bulk_ferment, add a helpful note
            if (!passiveStep.description.includes('extended')) {
              const passiveType = rawSteps[prevPassiveIdx]?.type
              if (passiveType === 'cold_proof') {
                passiveStep.description += ` (We extended your cold proof so you can sleep — your dough will develop amazing flavor in the fridge overnight.)`
              } else {
                passiveStep.description += ` (Extended to avoid a ${formatTimeShort(stepStart)} wake-up.)`
              }
            }

            // Shift this step and all subsequent steps forward
            for (let j = i; j < scheduleSteps.length; j++) {
              const s = scheduleSteps[j]
              s.startTime = new Date(new Date(s.startTime).getTime() + shiftMs).toISOString()
              s.endTime = new Date(new Date(s.endTime).getTime() + shiftMs).toISOString()
            }
            shifted = true
          }
        } else {
          // No passive step to extend — warn the user
          warnings.push(
            `This schedule has an active step (${step.title}) at ${formatTimeShort(stepStart)}, which falls during your quiet hours. We couldn't find a way to shift it — you may want to adjust your eat time.`
          )
        }
      }
    }

    if (shifted) {
      // Recalculate eat time shift
      const lastStep = scheduleSteps[scheduleSteps.length - 1]
      const newEndTime = new Date(lastStep.endTime)
      if (newEndTime.getTime() > targetEatTime.getTime()) {
        const delayMinutes = Math.round((newEndTime.getTime() - targetEatTime.getTime()) / (60 * 1000))
        if (delayMinutes > 15) {
          warnings.push(
            `We shifted your schedule to avoid quiet hours. Your bread will be ready about ${formatDuration(delayMinutes)} later than originally planned.`
          )
        }
      }
    }
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

  // Warning: very early start (only if quiet hours not enforced — otherwise the engine already handles it)
  if (!quietHours.enabled) {
    const startHour = startTime.getHours()
    if (startHour >= 0 && startHour < 5 && startTime > now) {
      warnings.push(
        `Heads up — this schedule has you starting at ${formatTimeShort(startTime)}. That's early! A cold proof overnight could give you more flexibility.`
      )
    }
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

  // Warning: neglected starter needs extra lead time
  if (starterStatus === 'neglected') {
    warnings.push(
      `Your starter needs two feeds before it's ready to bake. The schedule includes a refresh feed and a build feed — make sure ${name} is in a warm spot (${roomTempF}°F or warmer).`
    )
  }

  return { steps: scheduleSteps, warnings, startTime }
}

/** Find the nearest preceding passive (non-active) step */
function findPrecedingPassiveStep(steps: ScheduleStep[], activeIdx: number): number {
  for (let i = activeIdx - 1; i >= 0; i--) {
    if (!steps[i].isActive) return i
  }
  return -1
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
  { value: 'ready', label: "It's bubbly and ready to go!", hint: 'No feeding needed — let\'s bake' },
  { value: 'needs_feed', label: 'It needs a feed first', hint: 'One feed, then it\'ll be ready' },
  { value: 'neglected', label: "It's been in the fridge a while", hint: 'Needs a refresh + build feed' },
]

/** Feed speed options (shown when starter needs a feed) */
export const FEED_SPEED_OPTIONS: Array<{ value: FeedSpeed; label: string; hint: string }> = [
  { value: 'overnight', label: 'Feed tonight, bake tomorrow', hint: '1:5:5 ratio — peaks in 8-10 hours' },
  { value: 'same_day', label: 'Feed now, bake today', hint: '1:1:1 ratio — peaks in 4-6 hours' },
]

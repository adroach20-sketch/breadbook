// BreadBook recipe data types

export type FermentType = 'long_ferment' | 'overnight' | 'same_day_discard'

export type RecipeCategory =
  | 'sourdough_loaf'
  | 'focaccia'
  | 'bagels'
  | 'pizza'
  | 'enriched'
  | 'sandwich'
  | 'flatbread'
  | 'pancakes_waffles'
  | 'crackers'
  | 'quick_bread'
  | 'pasta'
  | 'other_discard'

export type StepType =
  | 'mix'
  | 'autolyse'
  | 'levain'
  | 'bulk_ferment'
  | 'stretch_fold'
  | 'lamination'
  | 'shape'
  | 'proof'
  | 'cold_proof'
  | 'preheat'
  | 'score'
  | 'bake'
  | 'cool'
  | 'custom'

export interface Ingredient {
  id: string
  name: string
  amount: number
  unit: string
  bakers_pct: number
}

export interface RecipeStep {
  id: string
  order: number
  type: StepType
  title: string
  instruction: string
  timer_minutes: number | null
  timer_label: string | null
  is_optional: boolean
  academy_key: string | null
  ingredient_ids?: string[]
}

export interface Recipe {
  id: string
  title: string
  description: string
  category: RecipeCategory
  ferment_type: FermentType
  hydration_pct: number
  yield_amount: string
  ingredients: Ingredient[]
  steps: RecipeStep[]
  tags: string[]
  is_breadbook_original: boolean
  source_credit: string | null
}

export interface AcademyCard {
  key: string
  title: string
  summary: string
  explanation: string
  tips: string[]
  interactions: string[]
  whenToSkip?: string
  showByDefault: boolean
}

export interface BakeLog {
  id: string
  user_id: string
  recipe_id: string
  bake_session_id: string | null
  rating: number
  crumb_notes: string | null
  crust_notes: string | null
  flavor_notes: string | null
  what_went_well: string | null
  what_to_change: string | null
  photo_urls: string[]
  created_at: string
  updated_at: string
  // Joined from select queries
  recipes?: { title: string }
}

// ─────────────────────────────────────────────
// Starter Tracker types (Features 2.1 & 2.2)
// ─────────────────────────────────────────────

export type StarterActivityLevel = 'dormant' | 'waking_up' | 'active' | 'peak' | 'past_peak'

export type StarterHealthStatus = 'green' | 'yellow' | 'red'

export type StarterScheduleType = 'repeating' | 'bake_linked'

export interface Starter {
  id: string
  user_id: string
  name: string
  flour_type: string
  hydration_ratio: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface StarterLog {
  id: string
  starter_id: string
  user_id: string
  fed_at: string
  water_g: number | null
  flour_g: number | null
  temperature_f: number | null
  peak_rise_pct: number | null
  peak_rise_minutes: number | null
  notes: string | null
  photo_url: string | null
  is_quick_log: boolean
  created_at: string
}

export interface StarterSchedule {
  id: string
  starter_id: string
  user_id: string
  schedule_type: StarterScheduleType
  interval_hours: number
  preferred_times: string[] // HH:MM format
  bake_recipe_id: string | null
  bake_target_time: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export const ACTIVITY_THRESHOLDS = {
  DORMANT_AFTER_HOURS: 12,
  WAKING_UP_HOURS: 2,
  ACTIVE_HOURS: 5,
  PEAK_HOURS: 8,
  PAST_PEAK_HOURS: 12,
  DEFAULT_PEAK_HOURS: 6,
  REFERENCE_TEMP_F: 75,
  TEMP_ADJUSTMENT_PER_5F: 1,
} as const

export const activityLabels: Record<StarterActivityLevel, { label: string; emoji: string }> = {
  dormant: { label: 'Dormant', emoji: 'ZZZ' },
  waking_up: { label: 'Waking Up', emoji: 'sunrise' },
  active: { label: 'Active', emoji: 'bubbles' },
  peak: { label: 'Peak', emoji: 'volcano' },
  past_peak: { label: 'Past Peak', emoji: 'down' },
}

export const healthStatusColors: Record<StarterHealthStatus, { label: string; bgClass: string; textClass: string }> = {
  green: { label: 'On schedule', bgClass: 'bg-green-100 dark:bg-green-900/30', textClass: 'text-green-700 dark:text-green-400' },
  yellow: { label: 'Feed soon', bgClass: 'bg-amber-100 dark:bg-amber-900/30', textClass: 'text-amber-700 dark:text-amber-400' },
  red: { label: 'Overdue', bgClass: 'bg-red-100 dark:bg-red-900/30', textClass: 'text-red-700 dark:text-red-400' },
}

// ─────────────────────────────────────────────
// Smart Schedule Planner types (Feature 2.3)
// ─────────────────────────────────────────────

export type StarterStatus = 'ready' | 'needs_feed' | 'neglected'

export type FeedSpeed = 'overnight' | 'same_day'

export interface QuietHours {
  enabled: boolean
  start: number  // 24hr format, e.g. 22 = 10 PM
  end: number    // 24hr format, e.g. 7 = 7 AM
}

export type ScheduleCategory = 'starter_prep' | 'dough_work' | 'proofing' | 'baking' | 'cooling'

export interface ScheduleStep {
  id: string
  order: number
  title: string
  description: string
  startTime: string         // ISO string
  endTime: string           // ISO string
  durationMinutes: number
  category: ScheduleCategory
  isActive: boolean         // Active (hands-on) vs passive (waiting)
  recipeStepId: string | null  // Links back to original recipe step, null for starter feeds
  academyKey: string | null    // Key for inline Academy card in expanded view
}

export interface SavedSchedule {
  id: string
  user_id: string
  recipe_id: string
  recipe_title: string
  target_eat_time: string
  starter_name: string | null
  starter_status: StarterStatus
  feed_speed: FeedSpeed | null
  room_temp_f: number
  fridge_available: boolean
  schedule_steps: ScheduleStep[]
  warnings: string[]
  created_at: string
  updated_at: string
}

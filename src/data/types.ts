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

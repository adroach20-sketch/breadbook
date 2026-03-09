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

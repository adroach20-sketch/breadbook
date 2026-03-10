import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import type { Recipe } from '../data/types'

// ─────────────────────────────────────────────
// Filter types
// ─────────────────────────────────────────────

export interface RecipeFilters {
  category: string | null
  fermentType: string | null
  hydrationRange: [number, number]
  technique: string | null
  timeCommitment: string | null
  source: string | null
}

export const DEFAULT_FILTERS: RecipeFilters = {
  category: null,
  fermentType: null,
  hydrationRange: [0, 100],
  technique: null,
  timeCommitment: null,
  source: null,
}

// ─────────────────────────────────────────────
// Filter option definitions (derived from data)
// ─────────────────────────────────────────────

export const CATEGORY_OPTIONS = [
  { value: 'sourdough_loaf', label: 'Sourdough Loaves' },
  { value: 'focaccia', label: 'Focaccia' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'bagels', label: 'Bagels' },
  { value: 'enriched', label: 'Enriched' },
  { value: 'sandwich', label: 'Sandwich' },
  { value: 'flatbread', label: 'Flatbread' },
  { value: 'pancakes_waffles', label: 'Pancakes & Waffles' },
  { value: 'crackers', label: 'Crackers' },
  { value: 'quick_bread', label: 'Quick Bread' },
  { value: 'pasta', label: 'Pasta' },
  { value: 'other_discard', label: 'Other Discard' },
]

export const FERMENT_OPTIONS = [
  { value: 'long_ferment', label: 'Long Ferment' },
  { value: 'overnight', label: 'Overnight' },
  { value: 'same_day_discard', label: 'Same-Day Discard' },
]

export const TECHNIQUE_OPTIONS = [
  { value: 'autolyse', label: 'Autolyse' },
  { value: 'stretch_fold', label: 'Stretch & Fold' },
  { value: 'cold_proof', label: 'Cold Proof' },
  { value: 'score', label: 'Scoring' },
  { value: 'laminate', label: 'Lamination' },
  { value: 'coil_fold', label: 'Coil Fold' },
]

export const TIME_OPTIONS = [
  { value: 'under_30', label: 'Under 30 min active' },
  { value: 'under_60', label: 'Under 1 hr active' },
  { value: 'weekend', label: 'Weekend project' },
]

export const SOURCE_OPTIONS = [
  { value: 'breadbook', label: 'BreadBook Originals' },
  { value: 'external', label: 'External Recipes' },
]

// ─────────────────────────────────────────────
// Time commitment helpers
// ─────────────────────────────────────────────

function getActiveMinutes(recipe: Recipe): number {
  return recipe.steps.reduce((sum, s) => sum + (s.timer_minutes || 0), 0)
}

function matchesTimeCommitment(recipe: Recipe, commitment: string): boolean {
  const active = getActiveMinutes(recipe)
  switch (commitment) {
    case 'under_30':
      return active <= 30
    case 'under_60':
      return active <= 60
    case 'weekend':
      return recipe.tags?.includes('weekend project') || active > 120
    default:
      return true
  }
}

// ─────────────────────────────────────────────
// Search logic — fuzzy-ish matching against title, description, tags
// ─────────────────────────────────────────────

function matchesSearch(recipe: Recipe, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase().trim()
  const searchable = [
    recipe.title,
    recipe.description,
    recipe.category,
    recipe.ferment_type,
    recipe.source_credit ?? '',
    ...(recipe.tags ?? []),
  ]
    .join(' ')
    .toLowerCase()

  // Support multi-word search: every word must match somewhere
  const words = q.split(/\s+/).filter(Boolean)
  return words.every((word) => searchable.includes(word))
}

// ─────────────────────────────────────────────
// Filter logic
// ─────────────────────────────────────────────

function matchesFilters(recipe: Recipe, filters: RecipeFilters): boolean {
  if (filters.category && recipe.category !== filters.category) return false
  if (filters.fermentType && recipe.ferment_type !== filters.fermentType) return false

  // Hydration range (only filter if non-default)
  const [min, max] = filters.hydrationRange
  if ((min > 0 || max < 100) && recipe.hydration_pct > 0) {
    if (recipe.hydration_pct < min || recipe.hydration_pct > max) return false
  }

  // Technique: check if any step uses this technique
  if (filters.technique) {
    const hasStep = recipe.steps.some((s) => s.type === filters.technique)
    if (!hasStep) return false
  }

  // Time commitment
  if (filters.timeCommitment && !matchesTimeCommitment(recipe, filters.timeCommitment)) return false

  // Source
  if (filters.source === 'breadbook' && !recipe.is_breadbook_original) return false
  if (filters.source === 'external' && recipe.is_breadbook_original) return false

  return true
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

interface UseRecipeSearchOptions {
  recipes: Recipe[]
  debounceMs?: number
}

interface UseRecipeSearchResult {
  query: string
  setQuery: (q: string) => void
  filters: RecipeFilters
  setFilter: <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => void
  resetFilters: () => void
  results: Recipe[]
  isFiltered: boolean
  activeFilterCount: number
}

export function useRecipeSearch({
  recipes,
  debounceMs = 250,
}: UseRecipeSearchOptions): UseRecipeSearchResult {
  const [query, setQueryRaw] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [filters, setFilters] = useState<RecipeFilters>(DEFAULT_FILTERS)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search
  const setQuery = useCallback(
    (q: string) => {
      setQueryRaw(q)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setDebouncedQuery(q)
      }, debounceMs)
    },
    [debounceMs]
  )

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const setFilter = useCallback(
    <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  // Count active filters (non-default)
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.category) count++
    if (filters.fermentType) count++
    if (filters.hydrationRange[0] > 0 || filters.hydrationRange[1] < 100) count++
    if (filters.technique) count++
    if (filters.timeCommitment) count++
    if (filters.source) count++
    return count
  }, [filters])

  const isFiltered = debouncedQuery.length > 0 || activeFilterCount > 0

  const results = useMemo(() => {
    return recipes.filter((r) => matchesSearch(r, debouncedQuery) && matchesFilters(r, filters))
  }, [recipes, debouncedQuery, filters])

  return {
    query,
    setQuery,
    filters,
    setFilter,
    resetFilters,
    results,
    isFiltered,
    activeFilterCount,
  }
}

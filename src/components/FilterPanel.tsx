import { useState, useCallback } from 'react'
import type { RecipeFilters } from '../hooks/useRecipeSearch'
import {
  CATEGORY_OPTIONS,
  FERMENT_OPTIONS,
  TECHNIQUE_OPTIONS,
  TIME_OPTIONS,
  SOURCE_OPTIONS,
} from '../hooks/useRecipeSearch'

interface FilterPanelProps {
  filters: RecipeFilters
  onFilterChange: <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => void
  onReset: () => void
  activeFilterCount: number
}

// ─────────────────────────────────────────────
// Chip selector — reusable pill-button group
// ─────────────────────────────────────────────

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  value: string | null
  onChange: (value: string | null) => void
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-ash mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(active ? null : opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
                active
                  ? 'bg-crust text-steam'
                  : 'bg-dough text-ash hover:bg-wheat/30'
              }`}
              aria-pressed={active}
              role="option"
              aria-selected={active}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Hydration range slider
// ─────────────────────────────────────────────

function HydrationSlider({
  range,
  onChange,
}: {
  range: [number, number]
  onChange: (range: [number, number]) => void
}) {
  const [min, max] = range

  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-ash mb-2">
        Hydration Range
        {(min > 0 || max < 100) && (
          <span className="ml-2 text-crust font-semibold">
            {min}% — {max}%
          </span>
        )}
      </p>
      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="hydration-min">
          Minimum hydration
        </label>
        <input
          id="hydration-min"
          type="range"
          min={0}
          max={100}
          step={5}
          value={min}
          onChange={(e) => {
            const v = Number(e.target.value)
            onChange([Math.min(v, max), max])
          }}
          className="flex-1 h-2 bg-dough rounded-full appearance-none cursor-pointer accent-crust"
          aria-label={`Minimum hydration: ${min}%`}
        />
        <label className="sr-only" htmlFor="hydration-max">
          Maximum hydration
        </label>
        <input
          id="hydration-max"
          type="range"
          min={0}
          max={100}
          step={5}
          value={max}
          onChange={(e) => {
            const v = Number(e.target.value)
            onChange([min, Math.max(v, min)])
          }}
          className="flex-1 h-2 bg-dough rounded-full appearance-none cursor-pointer accent-crust"
          aria-label={`Maximum hydration: ${max}%`}
        />
      </div>
      <div className="flex justify-between text-[10px] text-ash/60 mt-1 px-0.5">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Chevron icons
// ─────────────────────────────────────────────

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ChevronUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

// ─────────────────────────────────────────────
// Filter icon
// ─────────────────────────────────────────────

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

// ─────────────────────────────────────────────
// Main FilterPanel
// ─────────────────────────────────────────────

export function FilterPanel({ filters, onFilterChange, onReset, activeFilterCount }: FilterPanelProps) {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => setOpen((o) => !o), [])

  return (
    <div className="mb-4">
      {/* Toggle button */}
      <button
        onClick={toggle}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-ash bg-steam border border-dough/50 hover:border-crust/30 transition-colors min-h-[44px] w-full sm:w-auto"
        aria-expanded={open}
        aria-controls="filter-panel-content"
      >
        <FilterIcon className="w-4 h-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-crust text-steam text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
        {open ? (
          <ChevronUp className="w-4 h-4 ml-auto" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-auto" />
        )}
      </button>

      {/* Collapsible filter content */}
      {open && (
        <div
          id="filter-panel-content"
          className="mt-3 bg-steam rounded-xl border border-dough/50 p-4 animate-[slide-down_200ms_ease-out]"
          role="region"
          aria-label="Recipe filters"
        >
          <ChipGroup
            label="Category"
            options={CATEGORY_OPTIONS}
            value={filters.category}
            onChange={(v) => onFilterChange('category', v)}
          />

          <ChipGroup
            label="Ferment Type"
            options={FERMENT_OPTIONS}
            value={filters.fermentType}
            onChange={(v) => onFilterChange('fermentType', v)}
          />

          <HydrationSlider
            range={filters.hydrationRange}
            onChange={(r) => onFilterChange('hydrationRange', r)}
          />

          <ChipGroup
            label="Technique"
            options={TECHNIQUE_OPTIONS}
            value={filters.technique}
            onChange={(v) => onFilterChange('technique', v)}
          />

          <ChipGroup
            label="Time Commitment"
            options={TIME_OPTIONS}
            value={filters.timeCommitment}
            onChange={(v) => onFilterChange('timeCommitment', v)}
          />

          <ChipGroup
            label="Source"
            options={SOURCE_OPTIONS}
            value={filters.source}
            onChange={(v) => onFilterChange('source', v)}
          />

          {/* Reset button */}
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="mt-2 text-sm text-crust font-medium hover:underline transition-colors min-h-[44px] px-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

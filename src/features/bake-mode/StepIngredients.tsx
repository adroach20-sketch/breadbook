import { useState } from 'react'
import type { Ingredient } from '../../data/types'

interface StepIngredientsProps {
  ingredients: Ingredient[]
}

function formatAmount(ingredient: Ingredient): string {
  const { amount, unit, name } = ingredient
  if (amount === 0) return name
  // For units like "large" or "as desired", put amount before unit before name
  if (unit === 'large') return `${amount} ${unit} ${name}`
  if (unit === 'as desired') return `${name} (${unit})`
  return `${amount}${unit} ${name}`
}

export function StepIngredients({ ingredients }: StepIngredientsProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  if (ingredients.length === 0) return null

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="w-full max-w-xs mb-3">
      <ul className="space-y-1.5">
        {ingredients.map((ing) => (
          <li key={ing.id}>
            <button
              onClick={() => toggle(ing.id)}
              className="flex items-center gap-2.5 w-full text-left group"
            >
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  checked.has(ing.id)
                    ? 'bg-wheat border-wheat text-char'
                    : 'border-dough bg-steam group-hover:border-wheat/60'
                }`}
              >
                {checked.has(ing.id) && (
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span
                className={`text-sm transition-colors ${
                  checked.has(ing.id) ? 'text-ash-muted line-through' : 'text-char'
                }`}
              >
                {formatAmount(ing)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

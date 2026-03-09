import type { Ingredient } from '../data/types'
import { usePreferences } from '../store/preferences'

export function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  const { showBakersPercent, toggleBakersPercent } = usePreferences()

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg font-semibold text-char">Ingredients</h2>
        <button
          onClick={toggleBakersPercent}
          className="text-xs bg-dough text-ash px-3 py-1 rounded-full hover:bg-wheat/30 transition-colors"
        >
          {showBakersPercent ? 'Show Grams' : "Show Baker's %"}
        </button>
      </div>
      <ul className="space-y-2">
        {ingredients.map((ing) => (
          <li key={ing.id} className="flex justify-between items-center py-1 border-b border-dough/50 last:border-0">
            <span className="text-char">{ing.name}</span>
            <span className="text-ash font-medium tabular-nums">
              {showBakersPercent && ing.bakers_pct > 0
                ? `${ing.bakers_pct}%`
                : typeof ing.amount === 'number' && ing.amount > 0
                  ? `${ing.amount}${ing.unit}`
                  : ing.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

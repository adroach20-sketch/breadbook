import { Link } from 'react-router-dom'
import type { Recipe } from '../data/types'

const fermentLabels: Record<string, string> = {
  long_ferment: 'Long Ferment',
  overnight: 'Overnight',
  same_day_discard: 'Same-Day Discard',
}

const categoryEmojis: Record<string, string> = {
  sourdough_loaf: '🍞',
  focaccia: '🫓',
  bagels: '🥯',
  pizza: '🍕',
  enriched: '🧁',
  sandwich: '🥪',
  flatbread: '🫓',
  pancakes_waffles: '🥞',
  crackers: '🍘',
  quick_bread: '🍌',
  pasta: '🍝',
  other_discard: '♻️',
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const emoji = categoryEmojis[recipe.category] || '🍞'
  const totalTime = recipe.steps.reduce((sum, s) => sum + (s.timer_minutes || 0), 0)

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="block bg-steam rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-dough/50"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-3xl">{emoji}</span>
        <span className="text-xs bg-dough text-ash px-2 py-0.5 rounded-full">
          {fermentLabels[recipe.ferment_type] || recipe.ferment_type}
        </span>
      </div>
      <h3 className="font-heading font-semibold text-char text-lg leading-tight mb-1">
        {recipe.title}
      </h3>
      {recipe.is_breadbook_original && (
        <p className="text-xs text-ash mb-1">🍞 @BreadBook Original</p>
      )}
      <p className="text-sm text-ash line-clamp-2 mb-3">{recipe.description}</p>
      <div className="flex items-center gap-3 text-xs text-ash">
        {recipe.hydration_pct > 0 && <span>{recipe.hydration_pct}% hydration</span>}
        <span>{recipe.yield_amount}</span>
        {totalTime > 0 && (
          <span>
            {totalTime >= 60 ? `${Math.round(totalTime / 60)}h` : `${totalTime}m`} active
          </span>
        )}
      </div>
    </Link>
  )
}

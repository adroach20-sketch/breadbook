import { Link } from 'react-router-dom'
import type { Recipe } from '../data/types'
import { FavoriteButton } from './FavoriteButton'
import { useFavorites } from '../store/favorites'

const fermentLabels: Record<string, string> = {
  long_ferment: 'Long Ferment',
  overnight: 'Overnight',
  same_day_discard: 'Same-Day Discard',
}

const categoryEmojis: Record<string, string> = {
  sourdough_loaf: '\u{1F35E}',
  focaccia: '\u{1FAD3}',
  bagels: '\u{1F96F}',
  pizza: '\u{1F355}',
  enriched: '\u{1F9C1}',
  sandwich: '\u{1F96A}',
  flatbread: '\u{1FAD3}',
  pancakes_waffles: '\u{1F95E}',
  crackers: '\u{1F358}',
  quick_bread: '\u{1F34C}',
  pasta: '\u{1F35D}',
  other_discard: '\u267B\uFE0F',
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const emoji = categoryEmojis[recipe.category] || '\u{1F35E}'
  const totalTime = recipe.steps.reduce((sum, s) => sum + (s.timer_minutes || 0), 0)
  const saveCount = useFavorites((s) => s.getSaveCount(recipe.id))

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="relative block bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-md transition-shadow p-4 border border-dough"
    >
      {/* Favorite button — absolute top-right, sits above the Link */}
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton recipeId={recipe.id} size="sm" />
      </div>

      <div className="flex items-start justify-between mb-2 pr-8">
        <span className="text-3xl">{emoji}</span>
        <span className="text-xs bg-dough text-ash px-2 py-0.5 rounded-full">
          {fermentLabels[recipe.ferment_type] || recipe.ferment_type}
        </span>
      </div>
      <h3 className="font-heading font-semibold text-char text-lg leading-tight mb-1">
        {recipe.title}
      </h3>
      {recipe.is_breadbook_original && (
        <p className="text-xs text-ash mb-1">{'\u{1F35E}'} @BreadBook Original</p>
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
        {saveCount > 0 && (
          <span className="flex items-center gap-0.5">
            <svg className="w-3 h-3 text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {saveCount}
          </span>
        )}
      </div>
    </Link>
  )
}

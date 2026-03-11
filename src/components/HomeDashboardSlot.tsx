import { Link } from 'react-router-dom'
import type { DashboardCard } from '../hooks/useHomeDashboard'

interface Props {
  card: DashboardCard
}

export function HomeDashboardSlot({ card }: Props) {
  if (card.type === 'resume_bake') {
    return (
      <Link
        to={`/bake/${card.recipeId}`}
        aria-label={`Continue baking ${card.recipeTitle}`}
        className="block bg-wheat/15 border border-wheat/30 rounded-xl p-4 hover:bg-wheat/25 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-char">Bake in progress</p>
            <p className="text-ash text-sm mt-0.5">{card.recipeTitle}</p>
            {card.totalSteps && card.totalSteps > 0 && (
              <p className="text-xs text-ash-muted mt-1">
                Step {card.currentStep} of {card.totalSteps}
              </p>
            )}
          </div>
          <span className="text-2xl">🔥</span>
        </div>
        <p className="text-crust text-sm font-medium mt-2">Continue baking →</p>
      </Link>
    )
  }

  if (card.type === 'unlogged_bake') {
    return (
      <Link
        to={`/journal/new?recipe=${card.recipeId}${card.sessionId ? `&session=${card.sessionId}` : ''}`}
        aria-label={`Log your ${card.recipeTitle} bake`}
        className="block bg-crust/5 border border-crust/20 rounded-xl p-4 hover:bg-crust/10 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-char">How did it turn out?</p>
            <p className="text-ash text-sm mt-0.5">
              You finished {card.recipeTitle} — capture your notes while it's fresh.
            </p>
          </div>
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-crust text-sm font-medium mt-2">Log your bake →</p>
      </Link>
    )
  }

  if (card.type === 'starter_needs_feeding') {
    return (
      <Link
        to="/starters"
        aria-label={`${card.starterName} needs feeding`}
        className="block bg-wheat/10 border border-wheat/30 rounded-xl p-4 hover:bg-wheat/20 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-char">{card.starterName} needs attention</p>
            <p className="text-ash text-sm mt-0.5">{card.starterHint}</p>
          </div>
          <span className="text-2xl">🫙</span>
        </div>
        <p className="text-crust text-sm font-medium mt-2">Go to starter →</p>
      </Link>
    )
  }

  return null
}

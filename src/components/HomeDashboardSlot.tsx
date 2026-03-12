import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type { DashboardCard } from '../hooks/useHomeDashboard'

interface Props {
  card: DashboardCard
  onRefresh?: () => void
}

const NUDGE_OPTIONS = [
  { label: 'Just now / today',  hoursAgo: 2  },
  { label: 'Yesterday',         hoursAgo: 26 },
  { label: '2–3 days ago',      hoursAgo: 60 },
]

function StarterSetupNudge({ card, onRefresh }: { card: DashboardCard; onRefresh?: () => void }) {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)

  const handleSelect = async (hoursAgo: number | null) => {
    if (hoursAgo !== null && card?.starterId && user) {
      setSaving(true)
      const fedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
      await supabase.from('starter_logs').insert({
        starter_id: card.starterId,
        user_id: user.id,
        fed_at: fedAt,
        is_quick_log: true,
      })
      setSaving(false)
    }
    onRefresh?.()
  }

  return (
    <div className="bg-steam border border-dough rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-char">When did you last feed {card?.starterName}?</p>
          <p className="text-xs text-ash mt-0.5">So we know when to remind you next.</p>
        </div>
        <span className="text-2xl ml-2">🫙</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {NUDGE_OPTIONS.map((opt) => (
          <button
            key={opt.hoursAgo}
            onClick={() => handleSelect(opt.hoursAgo)}
            disabled={saving}
            className="text-sm bg-dough hover:bg-wheat/30 text-char px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => handleSelect(null)}
        disabled={saving}
        className="text-xs text-ash hover:text-char transition-colors"
      >
        Not sure — remind me later
      </button>
    </div>
  )
}

export function HomeDashboardSlot({ card, onRefresh }: Props) {
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

  if (card.type === 'starter_setup_nudge') {
    return <StarterSetupNudge card={card} onRefresh={onRefresh} />
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

  if (card.type === 'starter_guide_progress') {
    return (
      <Link
        to="/starters/guide"
        aria-label={`Starter guide day ${card.guideDay}`}
        className="block bg-crust/5 border border-crust/20 rounded-xl p-4 hover:bg-crust/10 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-char">{card.guideDayTitle}</p>
            <p className="text-ash text-sm mt-0.5">
              {card.starterName}'s starter guide — day {card.guideDay} of 14
            </p>
          </div>
          <span className="text-2xl">🌱</span>
        </div>
        <p className="text-crust text-sm font-medium mt-2">See today's task →</p>
      </Link>
    )
  }

  return null
}

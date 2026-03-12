import { useMemo, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStarters } from '../hooks/useStarters'
import { useAuth } from '../lib/auth'
import { starterGuide, GUIDE_TOTAL_DAYS } from '../data/starter-guide'
import { supabase } from '../lib/supabase'

/** Calculate which day the user is on based on starter creation date */
function getDayNumber(createdAt: string): number {
  const created = new Date(createdAt)
  const now = new Date()
  // Reset to start of day for accurate day counting
  created.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  const diffMs = now.getTime() - created.getTime()
  const daysSinceCreation = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  // Day 1 = creation day, clamped to guide length
  return Math.min(Math.max(daysSinceCreation + 1, 1), GUIDE_TOTAL_DAYS)
}

export function StarterGuide() {
  const { starters, loading } = useStarters()
  const { onboardingPath } = useAuth()
  const navigate = useNavigate()
  const todayRowRef = useRef<HTMLDivElement>(null)

  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [showReadyConfirm, setShowReadyConfirm] = useState(false)

  const starter = starters[0] // Use first starter
  const currentDay = useMemo(
    () => (starter ? getDayNumber(starter.created_at) : 1),
    [starter]
  )

  const today = starterGuide.find((d) => d.day === currentDay)
  const isComplete = currentDay >= GUIDE_TOTAL_DAYS

  const toggleDay = (day: number) => {
    setExpandedDay((prev) => (prev === day ? null : day))
  }

  const scrollToToday = () => {
    setExpandedDay(null)
    todayRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const markReadyAndBake = async () => {
    // Mark the starter's created_at so getDayNumber returns GUIDE_TOTAL_DAYS (complete)
    if (starter) {
      const completedAt = new Date()
      completedAt.setDate(completedAt.getDate() - (GUIDE_TOTAL_DAYS - 1))
      const { error } = await supabase
        .from('starters')
        .update({ created_at: completedAt.toISOString() })
        .eq('id', starter.id)
      if (error) console.error('Failed to mark starter complete:', error)
    }
    navigate('/recipes')
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="h-6 bg-dough rounded w-32 mb-4 animate-pulse" />
        <div className="h-40 bg-dough rounded-xl animate-pulse" />
      </div>
    )
  }

  // No starter yet — prompt creation
  if (!starter) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <span className="text-5xl block mb-4">🌱</span>
        <h1 className="font-heading text-2xl font-bold text-char mb-3">
          Start Your Starter
        </h1>
        <p className="text-ash mb-6 max-w-sm mx-auto">
          Ready to create your first sourdough starter from scratch? We'll guide you through every day for the next two weeks.
        </p>
        <p className="text-ash text-sm mb-6">
          All you need is flour, water, a jar, and a little patience.
        </p>
        <Link
          to="/starters"
          className="inline-block bg-crust text-steam px-8 py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors"
        >
          Create Your Starter
        </Link>
        <Link
          to="/"
          className="block mt-4 text-sm text-ash hover:text-char transition-colors"
        >
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <Link to="/starters" className="text-sm text-crust hover:underline mb-4 inline-block">
        ← {starter.name}
      </Link>

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-char">
          Start Your Starter
        </h1>
        <p className="text-ash mt-1">
          {isComplete
            ? `${starter.name} is ready to bake! You've completed the 14-day guide.`
            : `Day ${currentDay} of up to ${GUIDE_TOTAL_DAYS} — most starters are ready in 7–10 days.`}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-ash-muted mb-1">
          <span>Day 1</span>
          <span>Day {GUIDE_TOTAL_DAYS}</span>
        </div>
        <div className="h-2 bg-dough rounded-full overflow-hidden">
          <div
            className="h-full bg-crust rounded-full transition-all duration-500"
            style={{ width: `${(currentDay / GUIDE_TOTAL_DAYS) * 100}%` }}
          />
        </div>
      </div>

      {/* Today's card */}
      {today && (
        <div className="bg-steam border border-dough rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{today.emoji}</span>
            <h2 className="font-heading text-lg font-semibold text-char">{today.title}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-char mb-1">What to do</h3>
              <p className="text-ash text-sm leading-relaxed">{today.instruction}</p>
            </div>

            {/* Dehydrated starter callout — Day 1 only, for has_kit users */}
            {currentDay === 1 && onboardingPath === 'has_kit' && (
              <div className="bg-wheat/15 border border-wheat/40 rounded-lg px-4 py-3">
                <p className="text-sm font-medium text-char mb-1">📦 Using a dried or dehydrated starter?</p>
                <p className="text-sm text-ash leading-relaxed">
                  Your timeline is shorter — typically <span className="font-medium text-char">4–7 days</span>, not 14. Instead of mixing fresh flour and water from scratch, rehydrate your dried culture with equal parts warm water, stir well, and follow the feeding steps from Day 3 onward. Activity will come faster because your culture already has established organisms.
                </p>
              </div>
            )}

            {today.feedingRatio && (
              <div className="bg-crust/5 border border-crust/20 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-crust">
                  Feeding ratio: {today.feedingRatio} (starter : flour : water)
                </p>
                {today.feedingNote && (
                  <p className="text-xs text-ash mt-0.5">{today.feedingNote}</p>
                )}
              </div>
            )}

            {today.reassurance && (
              <div className="bg-wheat/10 border border-wheat/30 rounded-lg px-3 py-2">
                <p className="text-sm text-ash">
                  <span className="font-medium text-char">Don't worry —</span> {today.reassurance}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-char mb-1">What to expect</h3>
              <p className="text-ash text-sm leading-relaxed">{today.expectation}</p>
            </div>

            <div className="bg-wheat/10 border border-wheat/20 rounded-lg px-3 py-2">
              <p className="text-sm text-ash">
                <span className="font-medium text-char">Tip:</span> {today.tip}
              </p>
            </div>

            {/* Day 13 — direct first bake CTA */}
            {currentDay === 13 && (
              <Link
                to="/schedule/new?recipe=bb-artisan-simple"
                className="block w-full text-center bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors text-sm"
              >
                You're ready — let's plan your first loaf →
              </Link>
            )}

            {/* Readiness callout — Day 7+ */}
            {today.canBakeEarly && !showReadyConfirm && (
              <div className="border border-dough rounded-lg px-4 py-3">
                <p className="text-sm font-medium text-char mb-1">🌟 Yours might already be ready</p>
                <p className="text-xs text-ash mb-2 leading-relaxed">
                  Many starters are active and ready to bake between Day 7 and 10. Look for these signs:
                </p>
                <ul className="text-xs text-ash space-y-1 mb-3 pl-1">
                  <li>✓ Reliably doubles within 4–8 hours of feeding</li>
                  <li>✓ Smells tangy and yeasty (not harsh or like nail polish)</li>
                  <li>✓ Consistent rise-peak-fall cycle you can predict</li>
                </ul>
                <button
                  onClick={() => setShowReadyConfirm(true)}
                  className="text-xs text-crust font-medium hover:underline"
                >
                  Mine checks all three →
                </button>
              </div>
            )}

            {/* Confirm step — Priya's soft gate */}
            {today.canBakeEarly && showReadyConfirm && (
              <div className="bg-crust/5 border border-crust/30 rounded-lg px-4 py-4">
                <p className="text-sm font-medium text-char mb-1">Sounds like it's ready! 🎉</p>
                <p className="text-xs text-ash leading-relaxed mb-4">
                  Baking a day or two later only makes it stronger — but if it's hitting all three signs consistently, you're good to go whenever you want.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={markReadyAndBake}
                    className="flex-1 bg-crust text-steam text-sm py-2 rounded-lg font-medium hover:bg-crust/90 transition-colors"
                  >
                    Let's bake
                  </button>
                  <button
                    onClick={() => setShowReadyConfirm(false)}
                    className="flex-1 border border-dough text-ash text-sm py-2 rounded-lg hover:text-char transition-colors"
                  >
                    I'll wait a bit longer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick actions */}
      {today?.feedingRatio && (
        <Link
          to={`/starters/${starter.id}`}
          className="block w-full text-center bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors mb-3"
        >
          Log Today's Feeding
        </Link>
      )}

      {isComplete && (
        <button
          onClick={() => navigate('/recipes')}
          className="w-full bg-crust text-steam py-3.5 rounded-xl font-medium hover:bg-crust/90 transition-colors mb-3"
        >
          Pick Your First Recipe
        </button>
      )}

      {/* All days — expandable timeline */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-lg font-semibold text-char">Full Guide</h2>
          {expandedDay !== null && expandedDay !== currentDay && (
            <button
              onClick={scrollToToday}
              className="text-xs text-crust font-medium hover:underline"
            >
              ↑ Back to Today
            </button>
          )}
        </div>

        <div className="space-y-2">
          {starterGuide.map((day) => {
            const isPast = day.day < currentDay
            const isCurrent = day.day === currentDay
            const isFuture = day.day > currentDay
            const isExpanded = expandedDay === day.day

            return (
              <div
                key={day.day}
                ref={isCurrent ? todayRowRef : undefined}
              >
                {/* Row header — always visible, always tappable */}
                <button
                  onClick={() => toggleDay(day.day)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                    isCurrent
                      ? 'border-crust bg-crust/5'
                      : isPast
                        ? 'border-dough bg-steam'
                        : isExpanded
                          ? 'border-dough bg-steam opacity-80'
                          : 'border-dough bg-crumb opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${isFuture && !isExpanded ? 'grayscale' : ''}`}>{day.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-crust' : 'text-char'}`}>
                        {day.title}
                      </p>
                      {isPast && !isExpanded && (
                        <p className="text-xs text-ash-muted">Completed</p>
                      )}
                      {isCurrent && (
                        <p className="text-xs text-crust font-medium">Today</p>
                      )}
                      {isFuture && !isExpanded && (
                        <p className="text-xs text-ash-muted">Upcoming · tap to preview</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isPast && !isExpanded && <span className="text-crust text-sm">✓</span>}
                      <span className="text-ash text-xs">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className={`mt-1 rounded-xl border border-dough bg-steam px-4 py-4 space-y-3 ${isFuture ? 'opacity-85' : ''}`}>
                    {isFuture && (
                      <p className="text-xs text-ash bg-dough/50 rounded-lg px-3 py-1.5 inline-block">
                        Preview — this is what's coming on Day {day.day}
                      </p>
                    )}

                    <div>
                      <p className="text-xs font-medium text-char mb-1">What to do</p>
                      <p className="text-ash text-sm leading-relaxed">{day.instruction}</p>
                    </div>

                    {day.feedingRatio && (
                      <div className="bg-crust/5 border border-crust/20 rounded-lg px-3 py-2">
                        <p className="text-xs font-medium text-crust">
                          Feeding ratio: {day.feedingRatio} (starter : flour : water)
                        </p>
                        {day.feedingNote && (
                          <p className="text-xs text-ash mt-0.5">{day.feedingNote}</p>
                        )}
                      </div>
                    )}

                    {day.reassurance && (
                      <div className="bg-wheat/10 border border-wheat/30 rounded-lg px-3 py-2">
                        <p className="text-sm text-ash">
                          <span className="font-medium text-char">Don't worry —</span> {day.reassurance}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-medium text-char mb-1">What to expect</p>
                      <p className="text-ash text-sm leading-relaxed">{day.expectation}</p>
                    </div>

                    <div className="bg-wheat/10 border border-wheat/20 rounded-lg px-3 py-2">
                      <p className="text-sm text-ash">
                        <span className="font-medium text-char">Tip:</span> {day.tip}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-center mt-6">
        <Link to="/starters" className="text-sm text-crust font-medium hover:underline">
          Back to starters
        </Link>
      </div>
    </div>
  )
}

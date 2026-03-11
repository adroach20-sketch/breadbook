import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStarters } from '../hooks/useStarters'
import { starterGuide, GUIDE_TOTAL_DAYS } from '../data/starter-guide'

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
  const navigate = useNavigate()

  const starter = starters[0] // Use first starter
  const currentDay = useMemo(
    () => (starter ? getDayNumber(starter.created_at) : 1),
    [starter]
  )

  const today = starterGuide.find((d) => d.day === currentDay)
  const isComplete = currentDay >= GUIDE_TOTAL_DAYS

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
            : `Day ${currentDay} of ${GUIDE_TOTAL_DAYS} — you're doing great.`}
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

            {today.feedingRatio && (
              <div className="bg-crust/5 border border-crust/20 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-crust">
                  Feeding ratio: {today.feedingRatio} (starter : flour : water)
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

      {/* All days — collapsible timeline */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-char mb-3">Full Guide</h2>
        <div className="space-y-2">
          {starterGuide.map((day) => {
            const isPast = day.day < currentDay
            const isCurrent = day.day === currentDay
            const isFuture = day.day > currentDay

            return (
              <div
                key={day.day}
                className={`rounded-xl border px-4 py-3 transition-colors ${
                  isCurrent
                    ? 'border-crust bg-crust/5'
                    : isPast
                      ? 'border-dough bg-steam'
                      : 'border-dough bg-crumb opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${isFuture ? 'grayscale' : ''}`}>{day.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-crust' : 'text-char'}`}>
                      {day.title}
                    </p>
                    {isPast && (
                      <p className="text-xs text-ash-muted">Completed</p>
                    )}
                    {isCurrent && (
                      <p className="text-xs text-crust font-medium">Today</p>
                    )}
                  </div>
                  {isPast && <span className="text-crust text-sm">✓</span>}
                </div>
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

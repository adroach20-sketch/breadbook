import { useState, useMemo } from 'react'
import { breadbookOriginals } from '../../data/originals'
import type { Recipe, StarterStatus, FeedSpeed, QuietHours } from '../../data/types'
import { STARTER_STATUS_OPTIONS, FEED_SPEED_OPTIONS, DEFAULT_QUIET_HOURS } from '../../lib/schedule-engine'
import type { GenerateScheduleInput } from '../../lib/schedule-engine'

interface ScheduleFormProps {
  onGenerate: (input: GenerateScheduleInput) => void
}

/** Format a Date to the datetime-local input format (YYYY-MM-DDTHH:MM) */
function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Returns a default eat time: tomorrow at 6 PM */
function getDefaultEatTime(): Date {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(18, 0, 0, 0)
  return d
}

/** Format 24hr number to display string like "10:00 PM" */
function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:00 ${period}`
}

export function ScheduleForm({ onGenerate }: ScheduleFormProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState('')
  const [eatTimeStr, setEatTimeStr] = useState(toDatetimeLocal(getDefaultEatTime()))
  const [starterStatus, setStarterStatus] = useState<StarterStatus>('ready')
  const [feedSpeed, setFeedSpeed] = useState<FeedSpeed>('overnight')
  const [starterName, setStarterName] = useState('')
  const [roomTempF, setRoomTempF] = useState(70)
  const [fridgeAvailable, setFridgeAvailable] = useState(true)
  const [quietHours, setQuietHours] = useState<QuietHours>(DEFAULT_QUIET_HOURS)

  const recipes = useMemo(() => breadbookOriginals, [])
  const selectedRecipe: Recipe | undefined = recipes.find((r) => r.id === selectedRecipeId)

  const canGenerate = selectedRecipeId && eatTimeStr
  const showFeedSpeed = starterStatus === 'needs_feed' || starterStatus === 'neglected'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedRecipe) return

    const targetEatTime = new Date(eatTimeStr)
    if (isNaN(targetEatTime.getTime())) return

    onGenerate({
      recipe: selectedRecipe,
      targetEatTime,
      starterStatus,
      feedSpeed,
      starterName: starterName.trim() || 'your starter',
      roomTempF,
      fridgeAvailable,
      quietHours,
    })
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-char">
          Plan a Bake
        </h1>
        <p className="text-ash mt-1">
          Pick a recipe and tell us when you want to eat — we'll work backwards to build your schedule.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipe picker */}
        <div>
          <label htmlFor="recipe" className="block text-sm font-medium text-char mb-2">
            What are you baking?
          </label>
          <select
            id="recipe"
            value={selectedRecipeId}
            onChange={(e) => setSelectedRecipeId(e.target.value)}
            className="w-full rounded-xl border border-dough bg-steam px-4 py-3 text-char focus:outline-none focus:ring-2 focus:ring-wheat/50 appearance-none"
            aria-label="Select a recipe"
          >
            <option value="">Choose a recipe...</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.is_breadbook_original ? '🍞 ' : ''}{r.title}
              </option>
            ))}
          </select>
          {selectedRecipe && (
            <p className="text-xs text-ash-muted mt-1.5">
              {selectedRecipe.description.slice(0, 100)}...
            </p>
          )}
        </div>

        {/* Eat time */}
        <div>
          <label htmlFor="eatTime" className="block text-sm font-medium text-char mb-2">
            When do you want to eat?
          </label>
          <input
            id="eatTime"
            type="datetime-local"
            value={eatTimeStr}
            onChange={(e) => setEatTimeStr(e.target.value)}
            className="w-full rounded-xl border border-dough bg-steam px-4 py-3 text-char focus:outline-none focus:ring-2 focus:ring-wheat/50"
          />
        </div>

        {/* Starter status */}
        <div>
          <label className="block text-sm font-medium text-char mb-2">
            How's your starter doing?
          </label>
          <div className="space-y-2">
            {STARTER_STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStarterStatus(option.value)}
                className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${
                  starterStatus === option.value
                    ? 'border-crust bg-crust/5'
                    : 'border-dough bg-steam hover:border-ash/50'
                }`}
                aria-pressed={starterStatus === option.value}
              >
                <span className="text-sm font-medium text-char">
                  {option.label}
                </span>
                <span className="block text-xs text-ash-muted mt-0.5">
                  {option.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feed speed picker — only when starter needs feeding */}
        {showFeedSpeed && (
          <div>
            <label className="block text-sm font-medium text-char mb-2">
              When do you want to feed?
            </label>
            {starterStatus === 'neglected' && (
              <p className="text-xs text-ash-muted mb-2">
                The first feed is always a slow refresh to wake things up. This choice affects the second (build) feed.
              </p>
            )}
            <div className="space-y-2">
              {FEED_SPEED_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFeedSpeed(option.value)}
                  className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${
                    feedSpeed === option.value
                      ? 'border-crust bg-crust/5'
                      : 'border-dough bg-steam hover:border-ash/50'
                  }`}
                  aria-pressed={feedSpeed === option.value}
                >
                  <span className="text-sm font-medium text-char">
                    {option.label}
                  </span>
                  <span className="block text-xs text-ash-muted mt-0.5">
                    {option.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Starter name (optional) */}
        <div>
          <label htmlFor="starterName" className="block text-sm font-medium text-char mb-2">
            What's your starter's name? <span className="text-ash-muted font-normal">(optional)</span>
          </label>
          <input
            id="starterName"
            type="text"
            value={starterName}
            onChange={(e) => setStarterName(e.target.value)}
            placeholder="e.g., Bubbles, Steve, The Blob"
            className="w-full rounded-xl border border-dough bg-steam px-4 py-3 text-char placeholder:text-ash-muted focus:outline-none focus:ring-2 focus:ring-wheat/50"
          />
        </div>

        {/* Room temperature */}
        <div>
          <label htmlFor="roomTemp" className="block text-sm font-medium text-char mb-2">
            Kitchen temperature
          </label>
          <div className="flex items-center gap-3">
            <input
              id="roomTemp"
              type="range"
              min={60}
              max={85}
              step={1}
              value={roomTempF}
              onChange={(e) => setRoomTempF(Number(e.target.value))}
              className="flex-1 accent-crust h-2"
              aria-label={`Kitchen temperature: ${roomTempF}°F`}
            />
            <span className="text-sm font-medium text-char w-14 text-right tabular-nums">
              {roomTempF}°F
            </span>
          </div>
          <p className="text-xs text-ash-muted mt-1">
            {roomTempF < 65
              ? 'Pretty cool — fermentation will be slower. Great for flavor development.'
              : roomTempF > 78
                ? 'Warm kitchen! Your dough will move faster. Keep an eye on it.'
                : 'Right in the sweet spot for sourdough.'}
          </p>
        </div>

        {/* Fridge toggle */}
        <div className="flex items-center justify-between rounded-xl border border-dough bg-steam px-4 py-3">
          <div>
            <p className="text-sm font-medium text-char">Fridge available for cold proof?</p>
            <p className="text-xs text-ash-muted mt-0.5">
              {fridgeAvailable
                ? 'Cold proofing develops flavor and makes scheduling flexible.'
                : 'No worries — we\'ll use a room-temp proof instead.'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={fridgeAvailable}
            onClick={() => setFridgeAvailable(!fridgeAvailable)}
            className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors ${
              fridgeAvailable ? 'bg-crust' : 'bg-dough'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-steam shadow-sm transform transition-transform mt-1 ${
                fridgeAvailable ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Quiet hours */}
        <div className="rounded-xl border border-dough bg-steam px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-char">Quiet hours</p>
              <p className="text-xs text-ash-muted mt-0.5">
                {quietHours.enabled
                  ? `No active steps between ${formatHour(quietHours.start)} – ${formatHour(quietHours.end)}`
                  : 'Schedule can include steps at any hour'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={quietHours.enabled}
              onClick={() => setQuietHours({ ...quietHours, enabled: !quietHours.enabled })}
              className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors ${
                quietHours.enabled ? 'bg-crust' : 'bg-dough'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-steam shadow-sm transform transition-transform mt-1 ${
                  quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Time pickers — shown when quiet hours enabled */}
          {quietHours.enabled && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dough">
              <div className="flex-1">
                <label htmlFor="quietStart" className="block text-xs text-ash-muted mb-1">
                  Sleep at
                </label>
                <select
                  id="quietStart"
                  value={quietHours.start}
                  onChange={(e) => setQuietHours({ ...quietHours, start: Number(e.target.value) })}
                  className="w-full rounded-lg border border-dough bg-crumb px-3 py-2 text-sm text-char focus:outline-none focus:ring-2 focus:ring-wheat/50"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{formatHour(i)}</option>
                  ))}
                </select>
              </div>
              <span className="text-ash-muted mt-5">–</span>
              <div className="flex-1">
                <label htmlFor="quietEnd" className="block text-xs text-ash-muted mb-1">
                  Wake at
                </label>
                <select
                  id="quietEnd"
                  value={quietHours.end}
                  onChange={(e) => setQuietHours({ ...quietHours, end: Number(e.target.value) })}
                  className="w-full rounded-lg border border-dough bg-crumb px-3 py-2 text-sm text-char focus:outline-none focus:ring-2 focus:ring-wheat/50"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{formatHour(i)}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canGenerate}
          className="w-full bg-crust text-steam py-3.5 rounded-xl font-medium hover:bg-crust/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
        >
          Generate Schedule
        </button>
      </form>
    </div>
  )
}

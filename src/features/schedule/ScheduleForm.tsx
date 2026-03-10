import { useState, useMemo } from 'react'
import { breadbookOriginals } from '../../data/originals'
import type { Recipe, StarterStatus } from '../../data/types'
import { STARTER_STATUS_OPTIONS } from '../../lib/schedule-engine'
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

export function ScheduleForm({ onGenerate }: ScheduleFormProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState('')
  const [eatTimeStr, setEatTimeStr] = useState(toDatetimeLocal(getDefaultEatTime()))
  const [starterStatus, setStarterStatus] = useState<StarterStatus>('peak')
  const [starterName, setStarterName] = useState('')
  const [roomTempF, setRoomTempF] = useState(70)
  const [fridgeAvailable, setFridgeAvailable] = useState(true)

  const recipes = useMemo(() => breadbookOriginals, [])
  const selectedRecipe: Recipe | undefined = recipes.find((r) => r.id === selectedRecipeId)

  const canGenerate = selectedRecipeId && eatTimeStr

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedRecipe) return

    const targetEatTime = new Date(eatTimeStr)
    if (isNaN(targetEatTime.getTime())) return

    onGenerate({
      recipe: selectedRecipe,
      targetEatTime,
      starterStatus,
      starterName: starterName.trim() || 'your starter',
      roomTempF,
      fridgeAvailable,
    })
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-char dark:text-steam">
          Plan a Bake
        </h1>
        <p className="text-ash dark:text-dough/70 mt-1">
          Pick a recipe and tell us when you want to eat — we'll work backwards to build your schedule.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipe picker */}
        <div>
          <label htmlFor="recipe" className="block text-sm font-medium text-char dark:text-steam mb-2">
            What are you baking?
          </label>
          <select
            id="recipe"
            value={selectedRecipeId}
            onChange={(e) => setSelectedRecipeId(e.target.value)}
            className="w-full rounded-xl border border-dough dark:border-ash/30 bg-steam dark:bg-char/50 px-4 py-3 text-char dark:text-steam focus:outline-none focus:ring-2 focus:ring-wheat/50 appearance-none"
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
            <p className="text-xs text-ash dark:text-dough/50 mt-1.5">
              {selectedRecipe.description.slice(0, 100)}...
            </p>
          )}
        </div>

        {/* Eat time */}
        <div>
          <label htmlFor="eatTime" className="block text-sm font-medium text-char dark:text-steam mb-2">
            When do you want to eat?
          </label>
          <input
            id="eatTime"
            type="datetime-local"
            value={eatTimeStr}
            onChange={(e) => setEatTimeStr(e.target.value)}
            className="w-full rounded-xl border border-dough dark:border-ash/30 bg-steam dark:bg-char/50 px-4 py-3 text-char dark:text-steam focus:outline-none focus:ring-2 focus:ring-wheat/50"
          />
        </div>

        {/* Starter status */}
        <div>
          <label className="block text-sm font-medium text-char dark:text-steam mb-2">
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
                    ? 'border-crust dark:border-wheat bg-crust/5 dark:bg-wheat/10'
                    : 'border-dough dark:border-ash/30 bg-steam dark:bg-char/50 hover:border-ash/50 dark:hover:border-ash/50'
                }`}
                aria-pressed={starterStatus === option.value}
              >
                <span className="text-sm font-medium text-char dark:text-steam">
                  {option.label}
                </span>
                <span className="block text-xs text-ash dark:text-dough/50 mt-0.5">
                  {option.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Starter name (optional) */}
        <div>
          <label htmlFor="starterName" className="block text-sm font-medium text-char dark:text-steam mb-2">
            What's your starter's name? <span className="text-ash dark:text-dough/50 font-normal">(optional)</span>
          </label>
          <input
            id="starterName"
            type="text"
            value={starterName}
            onChange={(e) => setStarterName(e.target.value)}
            placeholder="e.g., Bubbles, Steve, The Blob"
            className="w-full rounded-xl border border-dough dark:border-ash/30 bg-steam dark:bg-char/50 px-4 py-3 text-char dark:text-steam placeholder:text-ash/40 dark:placeholder:text-dough/30 focus:outline-none focus:ring-2 focus:ring-wheat/50"
          />
        </div>

        {/* Room temperature */}
        <div>
          <label htmlFor="roomTemp" className="block text-sm font-medium text-char dark:text-steam mb-2">
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
              className="flex-1 accent-crust dark:accent-wheat h-2"
              aria-label={`Kitchen temperature: ${roomTempF}°F`}
            />
            <span className="text-sm font-medium text-char dark:text-steam w-14 text-right tabular-nums">
              {roomTempF}°F
            </span>
          </div>
          <p className="text-xs text-ash dark:text-dough/50 mt-1">
            {roomTempF < 65
              ? 'Pretty cool — fermentation will be slower. Great for flavor development.'
              : roomTempF > 78
                ? 'Warm kitchen! Your dough will move faster. Keep an eye on it.'
                : 'Right in the sweet spot for sourdough.'}
          </p>
        </div>

        {/* Fridge toggle */}
        <div className="flex items-center justify-between rounded-xl border border-dough dark:border-ash/30 bg-steam dark:bg-char/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-char dark:text-steam">Fridge available for cold proof?</p>
            <p className="text-xs text-ash dark:text-dough/50 mt-0.5">
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
              fridgeAvailable
                ? 'bg-crust dark:bg-wheat'
                : 'bg-dough dark:bg-ash/40'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-steam shadow-sm transform transition-transform mt-1 ${
                fridgeAvailable ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canGenerate}
          className="w-full bg-crust text-steam py-3.5 rounded-xl font-medium hover:bg-crust/90 dark:bg-wheat dark:text-char dark:hover:bg-wheat/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
        >
          Generate Schedule
        </button>
      </form>
    </div>
  )
}

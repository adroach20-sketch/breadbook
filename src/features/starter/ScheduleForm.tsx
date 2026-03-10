import { useState } from 'react'

interface ScheduleFormProps {
  onSave: (data: {
    schedule_type: 'repeating' | 'bake_linked'
    interval_hours: number
    preferred_times: string[]
    bake_recipe_id?: string | null
    bake_target_time?: string | null
  }) => Promise<unknown>
  onCancel: () => void
  currentInterval?: number
  currentTimes?: string[]
  saving?: boolean
}

const intervalOptions = [
  { value: 8, label: 'Every 8 hours' },
  { value: 12, label: 'Every 12 hours' },
  { value: 24, label: 'Every 24 hours' },
  { value: 48, label: 'Every 2 days' },
]

/**
 * Form to set up a repeating feeding schedule.
 * Bake-linked schedules are handled separately when creating a bake plan.
 */
export function ScheduleForm({
  onSave,
  onCancel,
  currentInterval = 12,
  currentTimes = [],
  saving = false,
}: ScheduleFormProps) {
  const [intervalHours, setIntervalHours] = useState(currentInterval)
  const [preferredTimes, setPreferredTimes] = useState<string[]>(
    currentTimes.length > 0 ? currentTimes : ['08:00']
  )
  const [error, setError] = useState('')

  const addTime = () => {
    if (preferredTimes.length < 4) {
      setPreferredTimes([...preferredTimes, '20:00'])
    }
  }

  const removeTime = (index: number) => {
    setPreferredTimes(preferredTimes.filter((_, i) => i !== index))
  }

  const updateTime = (index: number, value: string) => {
    const updated = [...preferredTimes]
    updated[index] = value
    setPreferredTimes(updated)
  }

  const handleSubmit = async () => {
    if (preferredTimes.length === 0) {
      setError('Add at least one preferred feeding time.')
      return
    }
    setError('')
    const result = await onSave({
      schedule_type: 'repeating',
      interval_hours: intervalHours,
      preferred_times: preferredTimes,
    })
    if (!result) {
      setError('Failed to save schedule. Please try again.')
    }
  }

  return (
    <div className="space-y-5">
      <h3 className="font-heading text-lg font-semibold text-char">Feeding Schedule</h3>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-char mb-2">Feed Interval</label>
        <div className="grid grid-cols-2 gap-2">
          {intervalOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setIntervalHours(opt.value)}
              className={
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors ' +
                (intervalHours === opt.value
                  ? 'bg-crust text-steam'
                  : 'bg-dough/50 text-ash hover:text-char')
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-char mb-2">Preferred Times</label>
        <div className="space-y-2">
          {preferredTimes.map((time, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="time"
                value={time}
                onChange={(e) => updateTime(i, e.target.value)}
                className="flex-1 rounded-lg border border-dough bg-steam px-3 py-2 text-char focus:outline-none focus:ring-2 focus:ring-wheat/50"
              />
              {preferredTimes.length > 1 && (
                <button
                  onClick={() => removeTime(i)}
                  className="text-ash hover:text-red-500 transition-colors p-1"
                  aria-label="Remove time"
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
        {preferredTimes.length < 4 && (
          <button
            onClick={addTime}
            className="text-sm text-crust font-medium mt-2 hover:text-crust/80 transition-colors"
          >
            + Add another time
          </button>
        )}
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Schedule'}
        </button>
        <button
          onClick={onCancel}
          className="w-full text-ash py-3 rounded-xl font-medium hover:text-char transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

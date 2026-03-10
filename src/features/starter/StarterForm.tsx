import { useState } from 'react'
import type { Starter } from '../../data/types'

interface StarterFormProps {
  starter?: Starter
  onSave: (name: string, flourType: string, hydrationRatio: number, notes: string | null) => Promise<boolean | Starter | null>
  onCancel: () => void
  saving?: boolean
}

const flourOptions = [
  'all-purpose',
  'bread flour',
  'whole wheat',
  'rye',
  'spelt',
  'einkorn',
  'mix',
]

/**
 * Form to create or edit a sourdough starter.
 * Follows the same form pattern as JournalForm.
 */
export function StarterForm({ starter, onSave, onCancel, saving = false }: StarterFormProps) {
  const [name, setName] = useState(starter?.name || '')
  const [flourType, setFlourType] = useState(starter?.flour_type || 'all-purpose')
  const [hydrationRatio, setHydrationRatio] = useState(starter?.hydration_ratio || 100)
  const [notes, setNotes] = useState(starter?.notes || '')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Give your starter a name!')
      return
    }
    setError('')
    const result = await onSave(name.trim(), flourType, hydrationRatio, notes || null)
    if (!result) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="space-y-5">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-char mb-1">Starter Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Bubbles, The Beast, Old Faithful..."
          className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash/50 focus:outline-none focus:ring-2 focus:ring-wheat/50"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-char mb-1">Flour Type</label>
        <select
          value={flourType}
          onChange={(e) => setFlourType(e.target.value)}
          className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char focus:outline-none focus:ring-2 focus:ring-wheat/50"
        >
          {flourOptions.map((f) => (
            <option key={f} value={f}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-char mb-1">
          Hydration Ratio (%)
        </label>
        <input
          type="number"
          value={hydrationRatio}
          onChange={(e) => setHydrationRatio(Number(e.target.value))}
          min={50}
          max={200}
          className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char focus:outline-none focus:ring-2 focus:ring-wheat/50"
        />
        <p className="text-xs text-ash mt-1">Most starters are 100% (equal parts flour and water by weight)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-char mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any details about your starter... age, quirks, feeding history"
          rows={3}
          className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash/50 focus:outline-none focus:ring-2 focus:ring-wheat/50 resize-none"
        />
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : starter ? 'Update Starter' : 'Add Starter'}
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

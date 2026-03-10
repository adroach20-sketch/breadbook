import { useState } from 'react'
import { PhotoUpload } from '../journal/PhotoUpload'

interface FeedingLogFormProps {
  starterId: string
  onSave: (data: {
    starter_id: string
    water_g?: number | null
    flour_g?: number | null
    temperature_f?: number | null
    peak_rise_pct?: number | null
    peak_rise_minutes?: number | null
    notes?: string | null
    photo_url?: string | null
  }) => Promise<unknown>
  onCancel: () => void
  saving?: boolean
}

/**
 * Full feeding log form with all optional fields.
 * The "tier 2" log for users who want detail.
 */
export function FeedingLogForm({ starterId, onSave, onCancel, saving = false }: FeedingLogFormProps) {
  const [waterG, setWaterG] = useState('')
  const [flourG, setFlourG] = useState('')
  const [temperatureF, setTemperatureF] = useState('')
  const [peakRisePct, setPeakRisePct] = useState('')
  const [peakRiseMinutes, setPeakRiseMinutes] = useState('')
  const [notes, setNotes] = useState('')
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    const result = await onSave({
      starter_id: starterId,
      water_g: waterG ? Number(waterG) : null,
      flour_g: flourG ? Number(flourG) : null,
      temperature_f: temperatureF ? Number(temperatureF) : null,
      peak_rise_pct: peakRisePct ? Number(peakRisePct) : null,
      peak_rise_minutes: peakRiseMinutes ? Number(peakRiseMinutes) : null,
      notes: notes || null,
      photo_url: photoUrls[0] || null,
    })
    if (!result) {
      setError('Failed to save feeding log. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold text-char">Log Feeding Details</h3>

      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-char mb-1">Water (g)</label>
          <input
            type="number"
            value={waterG}
            onChange={(e) => setWaterG(e.target.value)}
            placeholder="50"
            className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash-muted focus:outline-none focus:ring-2 focus:ring-wheat/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-char mb-1">Flour (g)</label>
          <input
            type="number"
            value={flourG}
            onChange={(e) => setFlourG(e.target.value)}
            placeholder="50"
            className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash-muted focus:outline-none focus:ring-2 focus:ring-wheat/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-char mb-1">Temp (F)</label>
          <input
            type="number"
            value={temperatureF}
            onChange={(e) => setTemperatureF(e.target.value)}
            placeholder="72"
            className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash-muted focus:outline-none focus:ring-2 focus:ring-wheat/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-char mb-1">Peak Rise %</label>
          <input
            type="number"
            value={peakRisePct}
            onChange={(e) => setPeakRisePct(e.target.value)}
            placeholder="100"
            className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash-muted focus:outline-none focus:ring-2 focus:ring-wheat/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-char mb-1">Peak Rise Time (minutes)</label>
        <input
          type="number"
          value={peakRiseMinutes}
          onChange={(e) => setPeakRiseMinutes(e.target.value)}
          placeholder="360"
          className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash-muted focus:outline-none focus:ring-2 focus:ring-wheat/50"
        />
        <p className="text-xs text-ash mt-1">How many minutes after feeding did it peak?</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-char mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Looked extra bubbly today, used rye flour..."
          rows={2}
          className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash-muted focus:outline-none focus:ring-2 focus:ring-wheat/50 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-char mb-1">Photo</label>
        <PhotoUpload photoUrls={photoUrls} onPhotosChange={setPhotoUrls} maxPhotos={1} />
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Feeding Log'}
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

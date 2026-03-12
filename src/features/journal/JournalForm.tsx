import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { StarRating } from './StarRating'
import { PhotoUpload } from './PhotoUpload'
import type { BakeLog } from '../../data/types'

export function JournalForm() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const isEdit = !!id
  const recipeId = searchParams.get('recipe')
  const sessionId = searchParams.get('session')
  const appendNote = searchParams.get('appendNote')

  const [recipeTitle, setRecipeTitle] = useState('')
  const [bakeEvents, setBakeEvents] = useState<Array<{ event_type: string; event_value: string | null }>>([])
  const [rating, setRating] = useState(0)
  const [crumbNotes, setCrumbNotes] = useState('')
  const [crustNotes, setCrustNotes] = useState('')
  const [flavorNotes, setFlavorNotes] = useState('')
  const [whatWentWell, setWhatWentWell] = useState('')
  const [whatToChange, setWhatToChange] = useState('')
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load existing log for edit mode, or recipe title for create mode
  useEffect(() => {
    async function load() {
      if (isEdit) {
        const { data, error } = await supabase
          .from('bake_logs')
          .select('*, recipes(title)')
          .eq('id', id)
          .single()

        if (error || !data) {
          setError('Could not load bake log.')
          setLoading(false)
          return
        }

        const log = data as BakeLog
        setRecipeTitle(log.recipes?.title || 'Unknown Recipe')
        setRating(log.rating)
        setCrumbNotes(log.crumb_notes || '')
        setCrustNotes(log.crust_notes || '')
        setFlavorNotes(log.flavor_notes || '')
        setWhatWentWell(log.what_went_well || '')
        const existing = log.what_to_change || ''
        setWhatToChange(appendNote
          ? existing ? `${existing}\n\n${appendNote}` : appendNote
          : existing
        )
        setPhotoUrls(log.photo_urls || [])
      } else if (recipeId) {
        const { data } = await supabase
          .from('recipes')
          .select('title')
          .eq('id', recipeId)
          .single()

        setRecipeTitle(data?.title || 'Unknown Recipe')
      }
      setLoading(false)
    }
    load()
  }, [id, isEdit, recipeId])

  // Fetch bake event data for session summary card + pre-fill what to change
  useEffect(() => {
    if (!sessionId || isEdit) return
    supabase
      .from('bake_event_logs')
      .select('event_type, event_value')
      .eq('bake_session_id', sessionId)
      .then(({ data }) => {
        if (!data) return
        setBakeEvents(data)
        const signals = deriveNegativeSignals(data)
        if (signals.length > 0) setWhatToChange(signals.join('. ') + '.')
      })
  }, [sessionId, isEdit])

  const handleSave = async () => {
    if (!user) return
    if (rating === 0) {
      setError('Please add a star rating.')
      return
    }

    setSaving(true)
    setError('')

    const logData = {
      user_id: user.id,
      recipe_id: isEdit ? undefined : recipeId,
      bake_session_id: isEdit ? undefined : sessionId || null,
      rating,
      crumb_notes: crumbNotes || null,
      crust_notes: crustNotes || null,
      flavor_notes: flavorNotes || null,
      what_went_well: whatWentWell || null,
      what_to_change: whatToChange || null,
      photo_urls: photoUrls,
      updated_at: new Date().toISOString(),
    }

    if (isEdit) {
      const { error } = await supabase
        .from('bake_logs')
        .update(logData)
        .eq('id', id)

      if (error) {
        setError('Failed to update. Please try again.')
        setSaving(false)
        return
      }
      navigate(`/journal/${id}`)
    } else {
      const { data, error } = await supabase
        .from('bake_logs')
        .insert(logData)
        .select('id')
        .single()

      if (error || !data) {
        setError('Failed to save. Please try again.')
        setSaving(false)
        return
      }
      navigate(`/journal/${data.id}`)
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-8 max-w-lg mx-auto">
        <p className="text-ash">Loading...</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 max-w-lg mx-auto">
      <h1 className="font-heading text-2xl font-bold text-char mb-1">
        {isEdit ? 'Edit Bake Log' : 'Log Your Bake'}
      </h1>
      {recipeTitle && (
        <p className="text-ash mb-6">{recipeTitle}</p>
      )}

      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
      )}

      {/* Bake session summary — read-only reference from in-bake logging */}
      {bakeEvents.length > 0 && <BakeSessionSummary events={bakeEvents} />}

      {/* Star rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-char mb-2">How did it turn out?</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Notes fields */}
      <div className="space-y-5">
        <Field
          label="Crumb"
          placeholder={deriveCrumbPlaceholder(bakeEvents)}
          value={crumbNotes}
          onChange={setCrumbNotes}
        />
        <Field
          label="Crust"
          placeholder="Color, thickness, crunch, chewiness..."
          value={crustNotes}
          onChange={setCrustNotes}
        />
        <Field
          label="Flavor"
          placeholder={deriveFlavorPlaceholder(bakeEvents)}
          value={flavorNotes}
          onChange={setFlavorNotes}
        />
        <Field
          label="What went well"
          placeholder="Good oven spring, nice shaping, timing worked out..."
          value={whatWentWell}
          onChange={setWhatWentWell}
        />
        <Field
          label="What to change next time"
          placeholder="More bulk time, different flour, hotter oven..."
          value={whatToChange}
          onChange={setWhatToChange}
        />
      </div>

      {/* Photos */}
      <div className="mt-6 mb-8">
        <label className="block text-sm font-medium text-char mb-2">Photos</label>
        <PhotoUpload photoUrls={photoUrls} onPhotosChange={setPhotoUrls} />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Log' : 'Save Log'}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full text-ash py-3 rounded-xl font-medium hover:text-char transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function deriveCrumbPlaceholder(events: Array<{ event_type: string; event_value: string | null }>): string {
  const foldCount = events.filter((e) => e.event_type === 'fold_done').length
  const finalRise = events.filter((e) => e.event_type === 'rise_check').map((e) => e.event_value).filter(Boolean).pop()
  const foldLabel = `${foldCount} fold ${foldCount === 1 ? 'set' : 'sets'}`
  if (foldCount > 0 && finalRise) return `You logged ${foldLabel} and a ${finalRise} rise — how did the crumb turn out?`
  if (finalRise) return `Bulk rise reached ${finalRise} — how did the crumb look?`
  if (foldCount > 0) return `You logged ${foldLabel} — how was the crumb structure?`
  return 'How was the inside? Open, tight, gummy, airy...'
}

function deriveFlavorPlaceholder(events: Array<{ event_type: string; event_value: string | null }>): string {
  const smells = events.filter((e) => e.event_type === 'dough_smell').map((e) => e.event_value).filter(Boolean)
  if (smells.length > 0) {
    const unique = [...new Set(smells)].join(', ').toLowerCase()
    return `Dough smelled ${unique} before baking — how did the flavor land?`
  }
  return 'Sour, mild, wheaty, sweet, salty...'
}

// Derives factual diagnostic signals from bake events for pre-filling "what to change"
function deriveNegativeSignals(events: Array<{ event_type: string; event_value: string | null }>): string[] {
  const signals: string[] = []

  const pokeTest = events.find((e) => e.event_type === 'poke_test')?.event_value
  if (pokeTest === "Didn't spring back") signals.push('Poke test showed no spring-back — may have overproofed')
  else if (pokeTest === 'Sprang back fast') signals.push('Poke test sprang back fast — may need longer proof time')

  const shapingFeel = events.find((e) => e.event_type === 'shaping_feel')?.event_value
  if (shapingFeel && shapingFeel !== 'Good tension') signals.push(`Shaping: ${shapingFeel.toLowerCase()}`)

  const riseChecks = events.filter((e) => e.event_type === 'rise_check').map((e) => e.event_value).filter(Boolean)
  const finalRise = riseChecks[riseChecks.length - 1]
  if (finalRise === '25%' || finalRise === '50%') signals.push(`Bulk rise only reached ${finalRise} — may need more fermentation time`)

  const offPlanEvents = events.filter((e) => e.event_type === 'off_plan').map((e) => e.event_value).filter(Boolean) as string[]
  offPlanEvents.forEach((raw) => {
    try {
      const parsed = JSON.parse(raw) as { reason?: string; note?: string }
      const text = parsed.reason
        ? parsed.note ? `${parsed.reason}: ${parsed.note}` : parsed.reason
        : raw
      signals.push(text)
    } catch {
      signals.push(raw)
    }
  })

  return signals
}

// Read-only summary of bake session data for reference while journaling
function BakeSessionSummary({ events }: { events: Array<{ event_type: string; event_value: string | null }> }) {
  const roomTemp = events.find((e) => e.event_type === 'room_temp')?.event_value
  const doughFeels = events.filter((e) => e.event_type === 'dough_feel').map((e) => e.event_value).filter(Boolean)
  const doughSmells = events.filter((e) => e.event_type === 'dough_smell').map((e) => e.event_value).filter(Boolean)
  const riseChecks = events.filter((e) => e.event_type === 'rise_check').map((e) => e.event_value).filter(Boolean)
  const shapingFeel = events.find((e) => e.event_type === 'shaping_feel')?.event_value
  const pokeTest = events.find((e) => e.event_type === 'poke_test')?.event_value
  const foldCount = events.filter((e) => e.event_type === 'fold_done').length

  const items: string[] = []
  if (roomTemp) items.push(`Room temp: ${roomTemp}°F`)
  if (foldCount > 0) items.push(`${foldCount} fold sets completed`)
  if (riseChecks.length > 0) items.push(`Rise checks: ${riseChecks.join(', ')}`)
  if (doughFeels.length > 0) items.push(`Dough felt: ${[...new Set(doughFeels)].join(', ')}`)
  if (doughSmells.length > 0) items.push(`Dough smelled: ${[...new Set(doughSmells)].join(', ')}`)
  if (shapingFeel) items.push(`Shaping: ${shapingFeel}`)
  if (pokeTest) items.push(`Poke test: ${pokeTest}`)

  if (items.length === 0) return null

  return (
    <div className="mb-6 bg-wheat/10 border border-wheat/30 rounded-xl p-4">
      <h3 className="text-sm font-medium text-char mb-2">From Your Bake</h3>
      <ul className="text-sm text-ash space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

// Simple textarea field to keep the form DRY
function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-char mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash-muted focus:outline-none focus:ring-2 focus:ring-wheat/50 resize-none"
      />
    </div>
  )
}

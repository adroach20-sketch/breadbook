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

  const [recipeTitle, setRecipeTitle] = useState('')
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
        setWhatToChange(log.what_to_change || '')
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
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}

      {/* Star rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-char mb-2">How did it turn out?</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Notes fields */}
      <div className="space-y-5">
        <Field
          label="Crumb"
          placeholder="How was the inside? Open, tight, gummy, airy..."
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
          placeholder="Sour, mild, wheaty, sweet, salty..."
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
        className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash/50 focus:outline-none focus:ring-2 focus:ring-wheat/50 resize-none"
      />
    </div>
  )
}

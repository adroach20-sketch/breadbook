import { useState, useEffect } from 'react'
import { ShareToFeedModal } from '../community/ShareToFeedModal'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { StarRating } from './StarRating'
import type { BakeLog } from '../../data/types'

export function JournalDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [log, setLog] = useState<BakeLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isShared, setIsShared] = useState(false)

  useEffect(() => {
    async function fetchLog() {
      const { data, error } = await supabase
        .from('bake_logs')
        .select('*, recipes(title)')
        .eq('id', id)
        .single()

      if (!error && data) {
        setLog(data as BakeLog)
        setIsShared(!!(data as any).is_shared)
      }
      setLoading(false)
    }
    fetchLog()
  }, [id])

  const handleDelete = async () => {
    if (!log || !confirm('Delete this bake log? This cannot be undone.')) return

    setDeleting(true)
    const { error } = await supabase
      .from('bake_logs')
      .delete()
      .eq('id', log.id)

    if (error) {
      setDeleting(false)
      return
    }
    navigate('/journal')
  }

  if (loading) {
    return (
      <div className="px-6 py-8 max-w-lg mx-auto">
        <div className="bg-dough/50 rounded-xl h-64 animate-pulse" />
      </div>
    )
  }

  if (!log) {
    return (
      <div className="px-6 py-8 max-w-lg mx-auto text-center">
        <span className="text-4xl block mb-3">🤔</span>
        <p className="text-ash mb-4">Bake log not found.</p>
        <Link to="/journal" className="text-crust font-medium hover:underline">
          Back to journal
        </Link>
      </div>
    )
  }

  const date = new Date(log.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <Link
        to={`/recipes/${log.recipe_id}`}
        className="text-crust font-medium text-sm hover:underline"
      >
        {log.recipes?.title || 'Unknown Recipe'}
      </Link>
      <div className="flex items-center gap-3 mt-1 mb-2">
        <StarRating value={log.rating} size="md" />
      </div>
      <p className="text-sm text-ash mb-6">{date}</p>

      {/* Photos */}
      {log.photo_urls.length > 0 && (
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {log.photo_urls.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border border-dough"
            >
              <img
                src={url}
                alt={`Bake photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>
      )}

      {/* Notes sections */}
      <div className="space-y-5">
        <NoteSection label="Crumb" value={log.crumb_notes} />
        <NoteSection label="Crust" value={log.crust_notes} />
        <NoteSection label="Flavor" value={log.flavor_notes} />
        <NoteSection label="What went well" value={log.what_went_well} />
        <NoteSection label="What to change next time" value={log.what_to_change} />
      </div>

      {/* Troubleshooter suggestion for low-rated bakes */}
      {log.rating <= 2 && (
        <Link
          to={`/troubleshoot?recipe=${log.recipe_id}&from=journal&logId=${log.id}`}
          className="mt-6 block bg-wheat/10 border border-wheat/30 rounded-xl p-4 hover:bg-wheat/20 transition-colors"
        >
          <p className="text-char font-medium text-sm">Something didn't go right?</p>
          <p className="text-ash text-sm mt-0.5">We can help figure out what happened and how to fix it next time.</p>
        </Link>
      )}

      {/* Bake this again */}
      <Link
        to={`/bake/${log.recipe_id}`}
        className="mt-4 block w-full text-center border border-dough text-crust py-3 rounded-xl font-medium hover:bg-dough/30 transition-colors"
      >
        Bake This Again
      </Link>

      {/* Share to Feed */}
      {!isShared && (
        <button
          onClick={() => setShowShareModal(true)}
          className="mt-6 w-full text-center bg-wheat/20 text-crust py-3 rounded-xl font-medium hover:bg-wheat/30 transition-colors"
        >
          Share to Community
        </button>
      )}
      {isShared && (
        <p className="mt-6 text-center text-sm text-ash">
          Shared to the community feed
        </p>
      )}

      {showShareModal && (
        <ShareToFeedModal
          bakeLogId={log.id}
          onClose={() => setShowShareModal(false)}
          onShared={() => { setShowShareModal(false); setIsShared(true) }}
        />
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <Link
          to={`/journal/${log.id}/edit`}
          className="flex-1 text-center bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 text-center border border-red-300 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <Link
        to="/journal"
        className="block text-center text-ash mt-4 hover:text-char transition-colors"
      >
        Back to journal
      </Link>
    </div>
  )
}

function NoteSection({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div>
      <h3 className="text-sm font-medium text-char mb-1">{label}</h3>
      <p className="text-ash whitespace-pre-wrap">{value}</p>
    </div>
  )
}

import { useState } from 'react'
import { useShareToFeed } from '../../hooks/useCommunity'

interface ShareToFeedModalProps {
  bakeLogId: string
  onClose: () => void
  onShared: () => void
}

export function ShareToFeedModal({ bakeLogId, onClose, onShared }: ShareToFeedModalProps) {
  const { sharePost, sharing } = useShareToFeed()
  const [caption, setCaption] = useState('')

  const handleShare = async () => {
    const postId = await sharePost(bakeLogId, caption)
    if (postId) {
      onShared()
    }
  }

  return (
    <div className="fixed inset-0 bg-char/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-steam rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6">
        <h2 className="font-heading text-lg font-bold text-char mb-4">
          Share to Community
        </h2>
        <p className="text-sm text-ash mb-4">
          Share this bake with the BreadBook community. Other bakers will see your photo and notes.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-char mb-1">
            Add a caption (optional)
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="First time trying this recipe..."
            rows={2}
            maxLength={280}
            className="w-full rounded-lg border border-dough bg-crumb px-3 py-2 text-char placeholder:text-ash-muted focus:outline-none focus:ring-2 focus:ring-wheat/50 resize-none"
          />
        </div>

        <div className="space-y-2">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="w-full bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors disabled:opacity-50"
          >
            {sharing ? 'Sharing...' : 'Share'}
          </button>
          <button
            onClick={onClose}
            disabled={sharing}
            className="w-full text-ash py-3 rounded-xl font-medium hover:text-char transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

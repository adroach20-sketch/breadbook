import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { ShareCard } from './ShareCard'

interface ShareCardModalProps {
  recipeTitle: string
  rating?: number
  date?: string
  isFirstBake?: boolean
  onClose: () => void
}

/**
 * Modal with a scaled preview of the share card and a Download PNG button.
 * The real 600×600 card is rendered off-screen; html2canvas captures it at 2×
 * for a crisp 1200×1200 PNG (retina-quality on most social platforms).
 */
export function ShareCardModal({
  recipeTitle,
  rating,
  date,
  isFirstBake,
  onClose,
}: ShareCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [capturing, setCapturing] = useState(false)

  async function handleDownload() {
    if (!cardRef.current) return
    setCapturing(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FBF7F0',
        logging: false,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `breadbook-${recipeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } finally {
      setCapturing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-char/50" onClick={onClose} aria-hidden="true" />

      {/* Sheet */}
      <div className="relative bg-steam rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm sm:mx-4 shadow-xl">
        <h2 className="font-heading text-lg font-bold text-char mb-4 text-center">
          Share Your Bake
        </h2>

        {/*
          Preview: 600px card scaled to 300px.
          The outer div clips overflow; transform doesn't affect layout so we
          set an explicit height equal to 600 * 0.5 = 300.
        */}
        <div
          className="overflow-hidden rounded-xl border border-dough mb-5 mx-auto"
          style={{ width: 300, height: 300 }}
        >
          <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: 600, flexShrink: 0 }}>
            <ShareCard
              rating={rating}
              date={date}
              recipeTitle={recipeTitle}
              isFirstBake={isFirstBake}
            />
          </div>
        </div>

        {/* Off-screen capture target (visually hidden but in DOM for html2canvas) */}
        <div
          style={{ position: 'absolute', left: -9999, top: -9999, pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <ShareCard
            ref={cardRef}
            rating={rating}
            date={date}
            recipeTitle={recipeTitle}
            isFirstBake={isFirstBake}
          />
        </div>

        <button
          onClick={handleDownload}
          disabled={capturing}
          className="w-full bg-crust text-steam py-3 rounded-xl font-semibold hover:bg-crust-dark transition-colors disabled:opacity-50"
        >
          {capturing ? 'Saving...' : 'Download Image'}
        </button>

        <p className="text-center text-xs text-ash-muted mt-3">
          Save the image, then share to Instagram, Twitter, or wherever you bake.
        </p>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ash-muted hover:text-ash transition-colors text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}

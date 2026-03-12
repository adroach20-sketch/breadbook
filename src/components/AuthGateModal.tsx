import { Link } from 'react-router-dom'

interface AuthGateModalProps {
  title: string
  message: string
  onClose: () => void
  redirectParam?: string
}

/**
 * Warm, non-punitive signup/login prompt. Shown when a guest taps a
 * write action (favorite, start bake, etc.) or a locked nav tab.
 * Slides up from the bottom on mobile, centers on desktop.
 * redirectParam is appended to signup/login links so users return to their context.
 */
export function AuthGateModal({ title, message, onClose, redirectParam = '' }: AuthGateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-char/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative bg-steam rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm sm:mx-4 shadow-xl">
        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">🍞</span>
          <h2 className="font-heading text-xl font-bold text-char mb-2">{title}</h2>
          <p className="text-ash text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to={`/signup${redirectParam}`}
            onClick={onClose}
            className="w-full bg-crust text-steam py-3 rounded-xl font-heading font-semibold text-center hover:bg-crust-dark transition-colors"
          >
            Create Free Account
          </Link>
          <Link
            to={`/login${redirectParam}`}
            onClick={onClose}
            className="w-full border border-dough text-char py-3 rounded-xl font-semibold text-center hover:bg-dough/50 transition-colors text-sm"
          >
            Log In
          </Link>
        </div>

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

interface QuickFeedModalProps {
  starterName: string
  onConfirm: () => Promise<void>
  onExpandForm: () => void
  onClose: () => void
  loading?: boolean
}

/**
 * Bottom-sheet-style modal for quick feeding.
 * One tap to log, option to expand to full form.
 */
export function QuickFeedModal({
  starterName,
  onConfirm,
  onExpandForm,
  onClose,
  loading = false,
}: QuickFeedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-char/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-steam rounded-t-2xl w-full max-w-lg p-6 pb-8 animate-slide-up">
        <div className="w-12 h-1 bg-dough rounded-full mx-auto mb-4" />

        <h3 className="font-heading text-lg font-semibold text-char mb-2">
          Feed {starterName}
        </h3>
        <p className="text-sm text-ash mb-6">
          Quick log records the time. Want to add details? Tap below.
        </p>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full bg-crust text-steam py-4 rounded-xl font-medium text-lg hover:bg-crust/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging...' : 'Fed! Log it'}
          </button>

          <button
            onClick={onExpandForm}
            className="w-full text-crust py-3 rounded-xl font-medium hover:bg-dough/50 transition-colors"
          >
            + Add details (water, flour, temp...)
          </button>

          <button
            onClick={onClose}
            className="w-full text-ash py-2 rounded-xl font-medium hover:text-char transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'

interface OffPlanSheetProps {
  onOffPlan: (reason: string, note?: string) => void
}

const REASON_OPTIONS = [
  'Running late',
  'Running early',
  'Dough not ready',
  'Got interrupted',
  'Temperature changed',
]

export function OffPlanSheet({ onOffPlan }: OffPlanSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [justSubmitted, setJustSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selectedReason) return
    onOffPlan(selectedReason, note.trim() || undefined)
    setJustSubmitted(true)
    setTimeout(() => {
      setIsOpen(false)
      setSelectedReason(null)
      setNote('')
      setJustSubmitted(false)
    }, 600)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedReason(null)
    setNote('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-ash-muted hover:text-ash transition-colors mt-2"
      >
        Off plan?
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-char/40 z-40"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-steam rounded-t-2xl z-50 p-6 pb-8 max-w-lg mx-auto shadow-xl animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-semibold text-char">What happened?</h3>
          <button
            onClick={handleClose}
            className="text-ash-muted hover:text-ash text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Reason pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {REASON_OPTIONS.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 active:scale-95 ${
                selectedReason === reason
                  ? 'bg-wheat text-char'
                  : 'bg-dough text-ash hover:bg-wheat/60'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        {/* Note input */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 200))}
          placeholder="Add a note (optional)"
          rows={2}
          className="w-full px-3 py-2 rounded-xl text-sm bg-crumb border border-dough text-char placeholder:text-ash/40 focus:outline-none focus:ring-1 focus:ring-wheat resize-none mb-1"
        />
        <p className="text-xs text-ash/40 text-right mb-4">{note.length}/200</p>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedReason || justSubmitted}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
            justSubmitted
              ? 'bg-wheat text-char scale-95'
              : selectedReason
                ? 'bg-crust text-steam hover:bg-crust-dark active:scale-95'
                : 'bg-dough text-ash/40 cursor-not-allowed'
          }`}
        >
          {justSubmitted ? 'Logged!' : 'Log It'}
        </button>
      </div>
    </>
  )
}

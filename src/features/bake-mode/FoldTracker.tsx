import { useState, useEffect, useRef } from 'react'
import type { BakeEvent } from '../../hooks/useBakeEvents'

interface FoldTrackerProps {
  onFoldDone: () => void
  foldLog: BakeEvent[]
  onAdvance: () => void
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function timeSince(ts: number): string {
  const diffMs = Date.now() - ts
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  return `${mins} min ago`
}

export function FoldTracker({ onFoldDone, foldLog, onAdvance }: FoldTrackerProps) {
  const [justDone, setJustDone] = useState(false)
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Live "time since last fold" counter
  const [, setTick] = useState(0)
  const lastFold = foldLog.length > 0 ? foldLog[foldLog.length - 1] : null

  useEffect(() => {
    if (!lastFold) return
    const interval = setInterval(() => setTick((t) => t + 1), 10000)
    return () => clearInterval(interval)
  }, [lastFold])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current)
    }
  }, [])

  const handleDone = () => {
    if (justDone) return // prevent double-tap
    setJustDone(true)
    onFoldDone()

    advanceTimeout.current = setTimeout(() => {
      setJustDone(false)
      onAdvance()
    }, 800)
  }

  return (
    <div className="w-full max-w-xs space-y-3">
      {/* Fold log — previous sets */}
      {foldLog.length > 0 && (
        <div className="text-sm text-ash space-y-1">
          {foldLog.map((event, i) => (
            <div key={event.timestamp} className="flex justify-between">
              <span>Set {i + 1}: {formatTime(event.timestamp)}</span>
              <span className="text-ash-muted">{timeSince(event.timestamp)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Time since last fold */}
      {lastFold && (
        <p className="text-xs text-ash-muted text-center">
          {timeSince(lastFold.timestamp)} since last fold
        </p>
      )}

      {/* Mark Set Done button */}
      <button
        onClick={handleDone}
        disabled={justDone}
        className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
          justDone
            ? 'bg-wheat text-char scale-95'
            : 'bg-crust text-steam hover:bg-crust-dark active:scale-95'
        }`}
      >
        {justDone ? 'Done!' : 'Mark Set Done'}
      </button>
    </div>
  )
}

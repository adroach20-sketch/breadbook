import type { BakeEvent } from '../../hooks/useBakeEvents'

interface RiseCheckInProps {
  onRiseCheck: (value: string) => void
  riseLog: BakeEvent[]
}

const RISE_OPTIONS = ['25%', '50%', '75%', 'Doubled', 'Not sure']

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function RiseCheckIn({ onRiseCheck, riseLog }: RiseCheckInProps) {
  return (
    <div className="w-full max-w-xs space-y-3">
      <p className="text-sm text-ash text-center">How's the rise?</p>

      {/* Pill buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {RISE_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onRiseCheck(option)}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-dough text-ash hover:bg-wheat hover:text-char active:scale-95 transition-all duration-150"
          >
            {option}
          </button>
        ))}
      </div>

      {/* Mini-log */}
      {riseLog.length > 0 && (
        <div className="text-sm text-ash/70 space-y-1">
          {riseLog.map((event) => (
            <div key={event.timestamp} className="text-center">
              {formatTime(event.timestamp)} — ~{event.eventValue}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

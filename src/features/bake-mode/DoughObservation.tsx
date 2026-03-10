import type { BakeEvent } from '../../hooks/useBakeEvents'

interface DoughObservationProps {
  onDoughFeel: (value: string) => void
  onDoughSmell: (value: string) => void
  feelLog: BakeEvent[]
  smellLog: BakeEvent[]
}

const FEEL_OPTIONS = ['Tight', 'Springy', 'Slack', 'Sticky', 'Smooth', 'Jiggly']
const SMELL_OPTIONS = ['Mild', 'Yeasty', 'Tangy', 'Alcoholy']

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function DoughObservation({ onDoughFeel, onDoughSmell, feelLog, smellLog }: DoughObservationProps) {
  return (
    <div className="w-full max-w-xs space-y-3">
      {/* Feel */}
      <div>
        <p className="text-sm text-ash text-center mb-1.5">How does the dough feel?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {FEEL_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => onDoughFeel(option)}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-dough text-ash hover:bg-wheat hover:text-char active:scale-95 transition-all duration-150"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Smell */}
      <div>
        <p className="text-sm text-ash text-center mb-1.5">How does it smell?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {SMELL_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => onDoughSmell(option)}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-dough text-ash hover:bg-wheat hover:text-char active:scale-95 transition-all duration-150"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Mini-log */}
      {(feelLog.length > 0 || smellLog.length > 0) && (
        <div className="text-sm text-ash/70 space-y-1">
          {feelLog.map((event) => (
            <div key={event.timestamp} className="text-center">
              {formatTime(event.timestamp)} — Feel: {event.eventValue}
            </div>
          ))}
          {smellLog.map((event) => (
            <div key={event.timestamp} className="text-center">
              {formatTime(event.timestamp)} — Smell: {event.eventValue}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import type { BakeEvent } from '../../hooks/useBakeEvents'

interface ShapingLogProps {
  onShapingMethod: (value: string) => void
  onShapingFeel: (value: string) => void
  methodLog: BakeEvent[]
  feelLog: BakeEvent[]
}

const METHOD_OPTIONS = ['Boule', 'Batard', 'Rolls', 'Other']
const FEEL_OPTIONS = ['Good tension', 'Tore a bit', 'Very sticky', "Couldn't build tension"]

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function ShapingLog({ onShapingMethod, onShapingFeel, methodLog, feelLog }: ShapingLogProps) {
  const hasMethod = methodLog.length > 0
  const hasFeel = feelLog.length > 0

  return (
    <div className="w-full max-w-xs space-y-3">
      {/* Shaping method */}
      {!hasMethod ? (
        <div>
          <p className="text-sm text-ash text-center mb-1.5">Shaping method used?</p>
          <div className="flex flex-wrap justify-center gap-2">
            {METHOD_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => onShapingMethod(option)}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-dough text-ash hover:bg-wheat hover:text-char active:scale-95 transition-all duration-150"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-ash/70 text-center">
          {formatTime(methodLog[0].timestamp)} — Shaped as {methodLog[0].eventValue}
        </p>
      )}

      {/* Dough feel at shaping */}
      {!hasFeel ? (
        <div>
          <p className="text-sm text-ash text-center mb-1.5">How did the dough feel?</p>
          <div className="flex flex-wrap justify-center gap-2">
            {FEEL_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => onShapingFeel(option)}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-dough text-ash hover:bg-wheat hover:text-char active:scale-95 transition-all duration-150"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-ash/70 text-center">
          {formatTime(feelLog[0].timestamp)} — {feelLog[0].eventValue}
        </p>
      )}
    </div>
  )
}

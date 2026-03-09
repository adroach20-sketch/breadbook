import { useTimer } from '../../hooks/useTimer'

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

interface TimerProps {
  minutes: number | null
  label: string | null
}

export function Timer({ minutes, label }: TimerProps) {
  const { remainingSeconds, isRunning, isComplete, start, pause, reset, hasTimer } = useTimer(minutes)

  if (!hasTimer) return null

  return (
    <div className="bg-char rounded-2xl p-6 text-center">
      {label && (
        <p className="text-wheat text-sm mb-2">{label}</p>
      )}

      <div
        className={`font-mono text-5xl font-bold mb-4 tabular-nums ${
          isComplete ? 'text-wheat animate-pulse' : 'text-steam'
        }`}
      >
        {formatTime(remainingSeconds)}
      </div>

      {isComplete && (
        <p className="text-wheat text-sm mb-3">Time's up!</p>
      )}

      <div className="flex gap-3 justify-center">
        {!isRunning && !isComplete && (
          <button
            onClick={start}
            className="bg-crust text-steam px-6 py-2.5 rounded-xl font-medium hover:bg-crust-light transition-colors"
          >
            {remainingSeconds === (minutes || 0) * 60 ? 'Start' : 'Resume'}
          </button>
        )}
        {isRunning && (
          <button
            onClick={pause}
            className="bg-ash text-steam px-6 py-2.5 rounded-xl font-medium hover:bg-ash/80 transition-colors"
          >
            Pause
          </button>
        )}
        {(isComplete || (remainingSeconds !== (minutes || 0) * 60 && !isRunning)) && (
          <button
            onClick={reset}
            className="bg-ash/50 text-steam px-6 py-2.5 rounded-xl font-medium hover:bg-ash/70 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

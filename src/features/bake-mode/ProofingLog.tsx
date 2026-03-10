import { useState, useEffect } from 'react'
import type { BakeEvent } from '../../hooks/useBakeEvents'

interface ProofingLogProps {
  stepType: 'proof' | 'cold_proof'
  onFridgeIn: () => void
  onPokeTest: (value: string) => void
  fridgeLog: BakeEvent[]
  pokeLog: BakeEvent[]
}

const POKE_OPTIONS = ['Sprang back fast', 'Sprang back slowly', "Didn't spring back"]

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function timeSince(ts: number): string {
  const diffMs = Date.now() - ts
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  const hrs = Math.floor(mins / 60)
  if (hrs >= 1) return `${hrs}h ${mins % 60}m ago`
  return `${mins} min ago`
}

export function ProofingLog({ stepType, onFridgeIn, onPokeTest, fridgeLog, pokeLog }: ProofingLogProps) {
  const [justTapped, setJustTapped] = useState(false)
  const hasFridgeEntry = fridgeLog.length > 0
  const isColdProof = stepType === 'cold_proof'
  const lastFridge = fridgeLog.length > 0 ? fridgeLog[fridgeLog.length - 1] : null

  // Live "time since fridge" counter
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!lastFridge) return
    const interval = setInterval(() => setTick((t) => t + 1), 30000)
    return () => clearInterval(interval)
  }, [lastFridge])

  const handleFridgeIn = () => {
    if (justTapped) return
    setJustTapped(true)
    onFridgeIn()
    setTimeout(() => setJustTapped(false), 800)
  }

  return (
    <div className="w-full max-w-xs space-y-3">
      {/* Into the fridge button — cold proof only */}
      {isColdProof && (
        <>
          {!hasFridgeEntry ? (
            <button
              onClick={handleFridgeIn}
              disabled={justTapped}
              className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                justTapped
                  ? 'bg-wheat text-char scale-95'
                  : 'bg-crust text-steam hover:bg-crust-dark active:scale-95'
              }`}
            >
              {justTapped ? 'Logged!' : 'Into the Fridge'}
            </button>
          ) : (
            <div className="text-center space-y-1">
              <p className="text-sm text-ash">
                In fridge since {formatTime(lastFridge!.timestamp)}
              </p>
              <p className="text-xs text-wheat">
                {timeSince(lastFridge!.timestamp)}
              </p>
            </div>
          )}
        </>
      )}

      {/* Poke test */}
      <div>
        <p className="text-sm text-ash text-center mb-1.5">Poke test?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {POKE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => onPokeTest(option)}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-dough text-ash hover:bg-wheat hover:text-char active:scale-95 transition-all duration-150"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Mini-log */}
      {pokeLog.length > 0 && (
        <div className="text-sm text-ash-muted space-y-1">
          {pokeLog.map((event) => (
            <div key={event.timestamp} className="text-center">
              {formatTime(event.timestamp)} — {event.eventValue}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

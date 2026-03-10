import { useState } from 'react'

interface RoomTempInputProps {
  onSubmit: (temp: string) => void
  currentTemp: string | null
}

const PRESETS = ['65', '70', '75', '80']

export function RoomTempInput({ onSubmit, currentTemp }: RoomTempInputProps) {
  const [customTemp, setCustomTemp] = useState('')

  // Already captured — don't show
  if (currentTemp) return null

  const handleCustomSubmit = () => {
    const val = customTemp.trim()
    if (val && !isNaN(Number(val))) {
      onSubmit(val)
    }
  }

  return (
    <div className="w-full max-w-xs space-y-2 mb-3">
      <p className="text-sm text-ash text-center">Kitchen temperature?</p>

      <div className="flex items-center justify-center gap-2">
        {PRESETS.map((temp) => (
          <button
            key={temp}
            onClick={() => onSubmit(temp)}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-dough text-ash hover:bg-wheat hover:text-char active:scale-95 transition-all duration-150"
          >
            {temp}°F
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          placeholder="Other"
          value={customTemp}
          onChange={(e) => setCustomTemp(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
          className="w-20 px-2 py-1.5 rounded-lg text-sm text-center bg-steam border border-dough text-char placeholder:text-ash/40 focus:outline-none focus:ring-1 focus:ring-wheat"
        />
        <span className="text-xs text-ash/60">°F</span>
        {customTemp && (
          <button
            onClick={handleCustomSubmit}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-wheat text-char active:scale-95 transition-all duration-150"
          >
            Set
          </button>
        )}
      </div>
    </div>
  )
}

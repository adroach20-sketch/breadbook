import { useState, useEffect, useRef } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const placeholders = [
  'Search for focaccia...',
  'What sounds good today?',
  'Try "overnight" or "discard"...',
  'Search by ingredient...',
  'Find your next bake...',
]

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Rotate placeholder text every 4 seconds when input is empty
  useEffect(() => {
    if (value) return
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [value])

  const currentPlaceholder = placeholder || placeholders[placeholderIdx]

  return (
    <div className="relative">
      {/* Search icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash/50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={currentPlaceholder}
        className="w-full pl-10 pr-10 py-2.5 bg-steam border border-dough rounded-xl text-char text-sm placeholder:text-ash/40 focus:outline-none focus:ring-2 focus:ring-crust/30 focus:border-crust transition-colors"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-ash/10 text-ash/60 hover:bg-ash/20 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}

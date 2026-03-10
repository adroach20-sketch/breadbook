import { useState } from 'react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-lg gap-0.5',
  md: 'text-2xl gap-1',
  lg: 'text-3xl gap-1',
}

export function StarRating({ value, onChange, size = 'md' }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)
  const interactive = !!onChange
  const displayValue = hoverValue || value

  return (
    <div
      className={`flex ${sizeClasses[size]}`}
      onMouseLeave={() => interactive && setHoverValue(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${interactive ? 'cursor-pointer' : ''} select-none transition-colors ${
            star <= displayValue ? 'text-wheat' : 'text-ash-muted'
          }`}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHoverValue(star)}
          role={interactive ? 'button' : undefined}
          aria-label={interactive ? `Rate ${star} stars` : `${value} stars`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

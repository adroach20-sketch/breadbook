import { useRef, useState, useEffect } from 'react'
import type { Recipe } from '../data/types'
import { RecipeCard } from './RecipeCard'

interface RecipeSectionProps {
  title: string
  emoji?: string
  recipes: Recipe[]
  /** Optional callback when "See all" is tapped — if omitted, no link shown */
  onSeeAll?: () => void
}

// ─────────────────────────────────────────────
// Horizontal scroll carousel of recipe cards
// ─────────────────────────────────────────────

export function RecipeSection({ title, emoji, recipes, onSeeAll }: RecipeSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Check scroll position to show/hide scroll indicators
  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollState()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    // Also update on resize
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [recipes])

  if (recipes.length === 0) return null

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = 260 + 16 // card min-w + gap
    el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' })
  }

  return (
    <section className="mb-8" aria-label={title}>
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-3 px-4 md:px-0">
        <h2 className="font-heading text-lg font-semibold text-char flex items-center gap-1.5">
          {emoji && <span>{emoji}</span>}
          {title}
        </h2>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-sm text-crust font-medium hover:underline transition-colors min-h-[44px] flex items-center"
          >
            See all
          </button>
        )}
      </div>

      {/* Carousel wrapper */}
      <div className="relative group">
        {/* Left scroll button (desktop only) */}
        {canScrollLeft && (
          <button
            onClick={() => scrollBy('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-steam/90 border border-dough rounded-full shadow-md text-ash hover:text-char transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory"
          role="list"
        >
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex-shrink-0 w-[260px] snap-start"
              role="listitem"
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>

        {/* Right scroll button (desktop only) */}
        {canScrollRight && (
          <button
            onClick={() => scrollBy('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-steam/90 border border-dough rounded-full shadow-md text-ash hover:text-char transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Fade edges to hint at scroll */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-crumb to-transparent pointer-events-none md:hidden" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-crumb to-transparent pointer-events-none md:hidden" />
        )}
      </div>
    </section>
  )
}

import { useState } from 'react'
import { academyCards } from '../data/academy'

interface AcademyCardProps {
  academyKey: string | null
  variant?: 'full' | 'compact'
  forceShow?: boolean
  children?: React.ReactNode
}

export function AcademyCard({ academyKey, variant = 'full', forceShow = false, children }: AcademyCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!academyKey) return null
  const card = academyCards[academyKey]
  if (!card) return null
  if (!card.showByDefault && !forceShow) return null

  const toggle = () => setIsOpen(prev => !prev)

  if (variant === 'compact') {
    return (
      <div className="mt-4 w-full">
        <button
          onClick={toggle}
          className="text-sm text-crust hover:text-crust-light transition-colors flex items-center gap-1.5"
        >
          <span className="text-base">📖</span>
          <span className="underline underline-offset-2">
            Learn about {card.title.toLowerCase()}
          </span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className="mt-3 p-4 bg-dough/30 rounded-lg border-l-2 border-wheat/40 text-left">
              <CardContent card={card} />
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Full variant (recipe detail)
  return (
    <div className="mt-2 mb-1">
      <button
        onClick={toggle}
        className="w-full flex items-center gap-2 px-3 py-2 bg-dough/30 rounded-lg border-l-2 border-wheat/40 hover:bg-dough/50 transition-colors text-left"
      >
        <span className="text-sm">📖</span>
        <span className="flex-1 text-sm text-ash">
          <span className="font-medium text-char">{card.title}</span>
          <span className="mx-1.5 text-wheat">·</span>
          {card.summary}
        </span>
        <svg
          className={`w-4 h-4 text-ash flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="mx-3 mt-2 mb-1 px-3 py-3 bg-dough/20 rounded-lg border-l-2 border-wheat/20">
            <CardContent card={card} />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function CardContent({ card }: { card: { explanation: string; tips: string[]; interactions: string[]; whenToSkip?: string } }) {
  return (
    <>
      {/* Explanation */}
      <p className="text-sm text-ash leading-relaxed">{card.explanation}</p>

      {/* Tips */}
      {card.tips.length > 0 && (
        <div className="mt-3">
          <h4 className="text-xs font-semibold text-char uppercase tracking-wide mb-1.5">Tips</h4>
          <ul className="space-y-1">
            {card.tips.map((tip, i) => (
              <li key={i} className="text-sm text-ash leading-relaxed flex gap-2">
                <span className="text-wheat mt-0.5 flex-shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interaction notes — prominent callout */}
      {card.interactions.length > 0 && (
        <div className="mt-3 p-2.5 bg-wheat/10 rounded-md border border-wheat/20">
          <h4 className="text-xs font-semibold text-crust uppercase tracking-wide mb-1.5">Good to know</h4>
          <ul className="space-y-1">
            {card.interactions.map((note, i) => (
              <li key={i} className="text-sm text-ash leading-relaxed flex gap-2">
                <span className="text-crust mt-0.5 flex-shrink-0">→</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* When to skip */}
      {card.whenToSkip && (
        <p className="mt-3 text-xs text-ash-muted italic">
          Skip this step? {card.whenToSkip}
        </p>
      )}
    </>
  )
}

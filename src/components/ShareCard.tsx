import { forwardRef } from 'react'

interface ShareCardProps {
  recipeTitle: string
  /** 1–5 star rating. Omit for the post-bake "no rating yet" variant. */
  rating?: number
  /** Formatted date string, e.g. "March 11, 2026" */
  date?: string
  isFirstBake?: boolean
}

/**
 * Off-screen card rendered by ShareCardModal before html2canvas capture.
 * Uses only system fonts and inline styles so html2canvas renders faithfully.
 * Fixed 600×600 — square for Instagram/social.
 */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ recipeTitle, rating, date, isFirstBake }, ref) => {
    const filledStar = '★'
    const emptyStar = '☆'
    const stars = rating
      ? filledStar.repeat(rating) + emptyStar.repeat(5 - rating)
      : null

    return (
      <div
        ref={ref}
        style={{
          width: 600,
          height: 600,
          backgroundColor: '#FBF7F0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 56,
          boxSizing: 'border-box',
          position: 'relative',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {/* Brand header */}
        <div style={{ fontSize: 52, marginBottom: 8, lineHeight: 1 }}>🍞</div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#8B5E3C',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: 52,
            fontFamily: 'Georgia, serif',
          }}
        >
          BreadBook
        </div>

        {/* Recipe title */}
        <div
          style={{
            fontSize: recipeTitle.length > 24 ? 30 : 38,
            fontWeight: 700,
            color: '#2C1A0E',
            textAlign: 'center',
            lineHeight: 1.25,
            marginBottom: 20,
            fontFamily: 'Georgia, serif',
          }}
        >
          {recipeTitle}
        </div>

        {/* Stars */}
        {stars && (
          <div
            style={{
              fontSize: 30,
              color: '#D4A96A',
              letterSpacing: '0.08em',
              marginBottom: date ? 12 : 0,
            }}
          >
            {stars}
          </div>
        )}

        {/* First bake milestone */}
        {isFirstBake && (
          <div
            style={{
              fontSize: 15,
              color: '#8B5E3C',
              fontStyle: 'italic',
              marginTop: 8,
              marginBottom: 4,
              fontFamily: 'Georgia, serif',
            }}
          >
            My first BreadBook loaf! 🎉
          </div>
        )}

        {/* Date */}
        {date && (
          <div
            style={{
              fontSize: 14,
              color: '#8B7B6B',
              marginTop: 8,
              fontFamily: 'Georgia, serif',
            }}
          >
            {date}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            fontSize: 13,
            color: '#A39080',
            letterSpacing: '0.04em',
            fontFamily: 'Georgia, serif',
          }}
        >
          baked with love · breadbook.app
        </div>

        {/* Subtle border */}
        <div
          style={{
            position: 'absolute',
            inset: 16,
            border: '1.5px solid #E8D9C4',
            borderRadius: 12,
            pointerEvents: 'none',
          }}
        />
      </div>
    )
  }
)

ShareCard.displayName = 'ShareCard'

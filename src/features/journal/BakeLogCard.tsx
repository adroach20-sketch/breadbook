import { Link } from 'react-router-dom'
import { StarRating } from './StarRating'
import type { BakeLog } from '../../data/types'

export function BakeLogCard({ log }: { log: BakeLog }) {
  const date = new Date(log.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const hasPhoto = log.photo_urls.length > 0

  return (
    <Link
      to={`/journal/${log.id}`}
      className="block bg-steam rounded-xl shadow-sm hover:shadow-md transition-shadow border border-dough/50 overflow-hidden"
    >
      {/* Photo or placeholder */}
      <div className="h-36 bg-dough flex items-center justify-center">
        {hasPhoto ? (
          <img
            src={log.photo_urls[0]}
            alt="Bake photo"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl opacity-40">🍞</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-heading font-semibold text-char leading-tight mb-1">
          {log.recipes?.title || 'Unknown Recipe'}
        </h3>
        <div className="flex items-center justify-between">
          <StarRating value={log.rating} size="sm" />
          <span className="text-xs text-ash">{date}</span>
        </div>
      </div>
    </Link>
  )
}

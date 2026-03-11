import { Link, useSearchParams } from 'react-router-dom'
import { symptoms, categoryLabels, type SymptomCategory } from '../data/troubleshooter'

const categories: SymptomCategory[] = ['appearance', 'crumb', 'flavor', 'other']

export function Troubleshoot() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read filter from URL so it survives back navigation
  const filterParam = searchParams.get('cat')
  const filter: SymptomCategory | 'all' =
    filterParam && categories.includes(filterParam as SymptomCategory)
      ? (filterParam as SymptomCategory)
      : 'all'

  function setFilter(cat: SymptomCategory | 'all') {
    const next = new URLSearchParams(searchParams)
    if (cat === 'all') {
      next.delete('cat')
    } else {
      next.set('cat', cat)
    }
    setSearchParams(next, { replace: true })
  }

  // Preserve context params for linking through to diagnosis
  const recipeId = searchParams.get('recipe')
  const sessionId = searchParams.get('session')
  const contextParams = [
    recipeId ? `recipe=${recipeId}` : '',
    sessionId ? `session=${sessionId}` : '',
  ].filter(Boolean).join('&')

  const filtered = filter === 'all'
    ? symptoms
    : symptoms.filter((s) => s.category === filter)

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-char">
          Troubleshoot Your Bake
        </h1>
        <p className="text-ash mt-1">
          Pick what went wrong — we'll help you figure out why and how to fix it next time.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
        <button
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-crust text-steam'
              : 'bg-dough text-ash hover:text-char'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-crust text-steam'
                : 'bg-dough text-ash hover:text-char'
            }`}
          >
            {categoryLabels[cat].emoji} {categoryLabels[cat].label}
          </button>
        ))}
      </div>

      {/* Symptom cards */}
      <div className="space-y-3">
        {filtered.map((symptom) => (
          <Link
            key={symptom.id}
            to={`/troubleshoot/${symptom.id}${contextParams ? `?${contextParams}` : ''}`}
            className="block bg-steam border border-dough rounded-xl p-4 hover:border-ash/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-0.5">{symptom.emoji}</span>
              <div>
                <p className="text-sm font-medium text-char">{symptom.title}</p>
                <p className="text-xs text-ash mt-0.5 line-clamp-2">{symptom.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Back link */}
      <div className="text-center mt-6">
        <Link to="/" className="text-sm text-crust font-medium hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  )
}

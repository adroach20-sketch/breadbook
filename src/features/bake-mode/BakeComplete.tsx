import { Link } from 'react-router-dom'

interface BakeCompleteProps {
  recipeTitle: string
  recipeId: string
  sessionId?: string
  isFirstBake?: boolean
}

export function BakeComplete({ recipeTitle, recipeId, sessionId, isFirstBake }: BakeCompleteProps) {
  return (
    <div className="min-h-screen bg-crumb flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {isFirstBake ? (
          <>
            <span className="text-7xl block mb-6">🎉 🍞 🎉</span>
            <h1 className="font-heading text-3xl font-bold text-crust mb-2">Bake Complete!</h1>
            <p className="text-ash text-lg mb-2">{recipeTitle}</p>
            <p className="text-ash mb-8">
              Your first BreadBook bake! That's a milestone worth celebrating.
            </p>
          </>
        ) : (
          <>
            <span className="text-7xl block mb-6">🍞</span>
            <h1 className="font-heading text-3xl font-bold text-crust mb-2">Bake Complete!</h1>
            <p className="text-ash text-lg mb-2">{recipeTitle}</p>
            <p className="text-ash mb-8">
              Nice work. Now comes the hardest part — waiting for it to cool.
            </p>
          </>
        )}

        <div className="space-y-4">
          {/* Primary CTA — hero action */}
          <Link
            to={`/journal/new?recipe=${recipeId}${sessionId ? `&session=${sessionId}` : ''}`}
            className="block bg-wheat text-char dark:text-crumb py-3.5 rounded-xl font-semibold hover:bg-wheat/80 transition-colors text-center text-lg"
          >
            Log Your Bake
          </Link>
          <p className="text-ash/60 text-sm -mt-2">Capture your results while they're fresh</p>

          {/* Secondary — text link */}
          <Link
            to={`/recipes/${recipeId}`}
            className="block text-crust font-medium hover:underline transition-colors"
          >
            Back to Recipe
          </Link>

          {/* Troubleshooter — conditional text link, hidden on first bake */}
          {!isFirstBake && (
            <Link
              to={`/troubleshoot?recipe=${recipeId}${sessionId ? `&session=${sessionId}` : ''}`}
              className="block text-ash text-sm hover:text-crust transition-colors"
            >
              Something didn't look right? Troubleshoot
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

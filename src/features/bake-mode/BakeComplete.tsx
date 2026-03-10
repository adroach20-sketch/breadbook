import { Link } from 'react-router-dom'

interface BakeCompleteProps {
  recipeTitle: string
  recipeId: string
  sessionId?: string
}

export function BakeComplete({ recipeTitle, recipeId, sessionId }: BakeCompleteProps) {
  return (
    <div className="min-h-screen bg-crumb flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <span className="text-7xl block mb-6">🍞</span>
        <h1 className="font-heading text-3xl font-bold text-crust mb-2">Bake Complete!</h1>
        <p className="text-ash text-lg mb-2">{recipeTitle}</p>
        <p className="text-ash mb-8">
          Nice work. Now comes the hardest part — waiting for it to cool.
        </p>

        <div className="space-y-3">
          <Link
            to={`/journal/new?recipe=${recipeId}${sessionId ? `&session=${sessionId}` : ''}`}
            className="block bg-wheat text-char dark:text-crumb py-3 rounded-xl font-medium hover:bg-wheat/80 transition-colors text-center"
          >
            📔 Log Your Bake
          </Link>
          <Link
            to={`/recipes/${recipeId}`}
            className="block bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust-dark transition-colors"
          >
            Back to Recipe
          </Link>
          <Link
            to="/recipes"
            className="block bg-steam text-crust py-3 rounded-xl font-medium hover:bg-crumb transition-colors border border-dough"
          >
            Browse More Recipes
          </Link>
        </div>
      </div>
    </div>
  )
}

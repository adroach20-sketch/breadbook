import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { breadbookOriginals } from '../data/originals'
import { RecipeCard } from '../components/RecipeCard'

export function Home() {
  const { user } = useAuth()
  const username = user?.user_metadata?.username || 'Baker'

  // Show a mix of recipe types on the home page
  const featured = [
    breadbookOriginals.find((r) => r.id === 'bb-artisan-simple'),
    breadbookOriginals.find((r) => r.id === 'bb-classic-country-loaf'),
    breadbookOriginals.find((r) => r.id === 'bb-rosemary-focaccia'),
    breadbookOriginals.find((r) => r.id === 'bb-sourdough-pizza-dough'),
  ].filter(Boolean)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-char">
          Welcome back, {username}
        </h1>
        <p className="text-ash mt-1">What are we baking today?</p>
      </div>

      {/* Quick action */}
      <Link
        to="/recipes"
        className="block bg-crust text-steam rounded-xl p-5 mb-8 hover:bg-crust-dark transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold">Browse Recipes</h2>
            <p className="text-sm text-dough/80 mt-0.5">
              {breadbookOriginals.length} BreadBook Originals ready to bake
            </p>
          </div>
          <span className="text-3xl">📖</span>
        </div>
      </Link>

      {/* Featured recipes */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-semibold text-char mb-3">
          Get Started
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((recipe) => (
            <RecipeCard key={recipe!.id} recipe={recipe!} />
          ))}
        </div>
      </div>

      {/* Discard recipes section */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-char mb-1">
          Got Discard?
        </h2>
        <p className="text-sm text-ash mb-3">Quick recipes that use up your unfed starter.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {breadbookOriginals
            .filter((r) => r.ferment_type === 'same_day_discard')
            .slice(0, 4)
            .map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
        </div>
      </div>
    </div>
  )
}

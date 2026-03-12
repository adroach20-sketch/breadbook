import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rawRedirect = searchParams.get('redirectTo') || '/'
  // Guard against open redirect — only allow relative paths
  const redirectTo = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signUp(email, password, username)
    setLoading(false)

    if (error) {
      setError(error)
    } else {
      navigate(redirectTo)
    }
  }

  return (
    <div className="min-h-screen bg-crumb flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">🍞</span>
          <h1 className="font-heading text-3xl font-bold text-crust mt-3">Join BreadBook</h1>
          <p className="text-ash mt-1">Free forever. Bake better.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-ash mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-dough rounded-lg focus:outline-none focus:ring-2 focus:ring-crust/50 bg-steam dark:bg-crumb"
              placeholder="What should we call you?"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ash mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-dough rounded-lg focus:outline-none focus:ring-2 focus:ring-crust/50 bg-steam dark:bg-crumb"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ash mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-dough rounded-lg focus:outline-none focus:ring-2 focus:ring-crust/50 bg-steam dark:bg-crumb"
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-crust text-steam py-2.5 rounded-lg font-medium hover:bg-crust-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-ash mt-4">
          Already have an account?{' '}
          <Link
            to={`/login${redirectTo !== '/' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="text-crust font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center mt-3">
          <Link to="/recipes" className="text-sm text-ash-muted hover:text-ash transition-colors">
            ← Browse recipes without an account
          </Link>
        </p>
      </div>
    </div>
  )
}

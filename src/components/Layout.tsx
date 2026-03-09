import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/recipes', label: 'Recipes', icon: '📖' },
]

export function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-crumb flex flex-col">
      {/* Top nav — desktop */}
      <header className="bg-crust text-steam px-4 py-3 hidden md:flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🍞</span>
          <span className="font-heading text-xl font-bold">BreadBook</span>
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hover:text-wheat transition-colors ${
                location.pathname === item.path ? 'text-wheat' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={signOut}
              className="text-sm text-dough/70 hover:text-steam transition-colors"
            >
              Sign Out
            </button>
          )}
        </nav>
      </header>

      {/* Mobile top bar */}
      <header className="bg-crust text-steam px-4 py-3 flex md:hidden items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg">🍞</span>
          <span className="font-heading text-lg font-bold">BreadBook</span>
        </Link>
        {user && (
          <button
            onClick={signOut}
            className="text-sm text-dough/70 hover:text-steam transition-colors"
          >
            Sign Out
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-4">
        <Outlet />
      </main>

      {/* Bottom nav — mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-steam border-t border-dough flex md:hidden z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              location.pathname === item.path
                ? 'text-crust font-medium'
                : 'text-ash'
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

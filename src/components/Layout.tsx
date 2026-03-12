import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { usePreferences } from '../store/preferences'

const themeIcons = { system: '💻', light: '☀️', dark: '🌙' } as const
const themeNext = { system: 'light', light: 'dark', dark: 'system' } as const

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/recipes', label: 'Explore', icon: '🔍' },
  { path: '/starters', label: 'Starters', icon: '🫙' },
  { path: '/schedule', label: 'Schedule', icon: '📅' },
  { path: '/journal', label: 'Journal', icon: '📔' },
  { path: '/community', label: 'Community', icon: '🤝' },
]

function isNavActive(itemPath: string, currentPath: string) {
  if (itemPath === '/') return currentPath === '/'
  return currentPath.startsWith(itemPath)
}

export function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const { themeMode, setThemeMode } = usePreferences()

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
              className={`hover:text-steam/80 transition-colors ${
                isNavActive(item.path, location.pathname) ? 'text-steam font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => setThemeMode(themeNext[themeMode])}
            className="text-sm hover:text-steam/80 transition-colors"
            aria-label={`Theme: ${themeMode}`}
            title={`Theme: ${themeMode}`}
          >
            {themeIcons[themeMode]}
          </button>
          {user && (
            <Link to="/profile/edit" className="text-sm text-steam/70 hover:text-steam transition-colors">
              Profile
            </Link>
          )}
          {user && (
            <button
              onClick={signOut}
              className="text-sm text-steam/70 hover:text-steam transition-colors"
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setThemeMode(themeNext[themeMode])}
            className="text-sm hover:text-steam/80 transition-colors"
            aria-label={`Theme: ${themeMode}`}
          >
            {themeIcons[themeMode]}
          </button>
          {user && (
            <button
              onClick={signOut}
              className="text-sm text-steam/70 hover:text-steam transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
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
            aria-label={item.label}
            className={`flex-1 flex flex-col items-center py-3 transition-colors relative ${
              isNavActive(item.path, location.pathname)
                ? 'text-crust'
                : 'text-ash'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            {isNavActive(item.path, location.pathname) && (
              <span className="absolute bottom-1 w-4 h-0.5 bg-crust rounded-full" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}

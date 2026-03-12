import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { usePreferences } from '../store/preferences'
import { useAuthGate } from '../hooks/useAuthGate'

const themeIcons = { system: '💻', light: '☀️', dark: '🌙' } as const
const themeNext = { system: 'light', light: 'dark', dark: 'system' } as const

interface NavItem {
  path: string
  label: string
  icon: string
  requiresAuth: boolean
  gateTitle?: string
  gateMessage?: string
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: '🏠',
    requiresAuth: true,
    gateTitle: 'Your Baking Dashboard',
    gateMessage: 'See your active bakes, starter status, and personalized recipe suggestions.',
  },
  {
    path: '/recipes',
    label: 'Explore',
    icon: '🔍',
    requiresAuth: false,
  },
  {
    path: '/starters',
    label: 'Starters',
    icon: '🫙',
    requiresAuth: true,
    gateTitle: 'Starter Tracker',
    gateMessage: "Track your starter's health, feeding schedule, and rise history.",
  },
  {
    path: '/schedule',
    label: 'Schedule',
    icon: '📅',
    requiresAuth: true,
    gateTitle: 'Smart Schedule Planner',
    gateMessage: 'Plan your bake backwards from when you want to eat — we handle the math.',
  },
  {
    path: '/journal',
    label: 'Journal',
    icon: '📔',
    requiresAuth: true,
    gateTitle: 'Bake Journal',
    gateMessage: 'Log every bake, rate your results, and track your improvement over time.',
  },
  {
    path: '/community',
    label: 'Community',
    icon: '🤝',
    requiresAuth: false,
  },
]

function isNavActive(itemPath: string, currentPath: string) {
  if (itemPath === '/') return currentPath === '/'
  return currentPath.startsWith(itemPath)
}

export function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { themeMode, setThemeMode } = usePreferences()
  const { requireAuth, modal } = useAuthGate()

  async function handleSignOut() {
    await signOut()
    navigate('/recipes')
  }

  function handleNavClick(item: NavItem) {
    if (!item.requiresAuth || user) {
      navigate(item.path)
    } else {
      requireAuth(() => navigate(item.path), {
        title: item.gateTitle,
        message: item.gateMessage,
        redirectTo: item.path,
      })
    }
  }

  return (
    <div className="min-h-screen bg-crumb flex flex-col">
      {/* Top nav — desktop */}
      <header className="bg-crust text-steam px-4 py-3 hidden md:flex items-center justify-between">
        <Link to="/recipes" className="flex items-center gap-2">
          <span className="text-xl">🍞</span>
          <span className="font-heading text-xl font-bold">BreadBook</span>
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isLocked = item.requiresAuth && !user
            const isActive = isNavActive(item.path, location.pathname)
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item)}
                className={`transition-colors text-sm ${
                  isActive ? 'text-steam font-semibold' : ''
                } ${
                  isLocked
                    ? 'text-steam/40 hover:text-steam/60'
                    : 'hover:text-steam/80'
                }`}
                title={isLocked ? `Sign in to access ${item.label}` : item.label}
              >
                {item.label}
                {isLocked && <span className="ml-1 text-xs opacity-60">🔒</span>}
              </button>
            )
          })}
          <button
            onClick={() => setThemeMode(themeNext[themeMode])}
            className="text-sm hover:text-steam/80 transition-colors"
            aria-label={`Theme: ${themeMode}`}
            title={`Theme: ${themeMode}`}
          >
            {themeIcons[themeMode]}
          </button>
          {user ? (
            <>
              <Link to="/profile/edit" className="text-sm text-steam/70 hover:text-steam transition-colors">
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-steam/70 hover:text-steam transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-steam/70 hover:text-steam transition-colors">
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-steam/20 hover:bg-steam/30 text-steam px-3 py-1 rounded-lg transition-colors font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Mobile top bar */}
      <header className="bg-crust text-steam px-4 py-3 flex md:hidden items-center justify-between">
        <Link to="/recipes" className="flex items-center gap-2">
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
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-sm text-steam/70 hover:text-steam transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/signup"
              className="text-sm text-steam/80 hover:text-steam transition-colors font-medium"
            >
              Sign Up
            </Link>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-4">
        <Outlet />
      </main>

      {/* Bottom nav — mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-steam border-t border-dough flex md:hidden z-50">
        {navItems.map((item) => {
          const isLocked = item.requiresAuth && !user
          const isActive = isNavActive(item.path, location.pathname)
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              aria-label={item.label}
              className={`flex-1 flex flex-col items-center py-3 transition-colors relative ${
                isActive ? 'text-crust' : isLocked ? 'text-ash/30' : 'text-ash'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {isActive && (
                <span className="absolute bottom-1 w-4 h-0.5 bg-crust rounded-full" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Auth gate modal — rendered here so it sits above the nav */}
      {modal}
    </div>
  )
}

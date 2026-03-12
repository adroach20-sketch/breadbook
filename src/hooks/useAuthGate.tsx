import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { AuthGateModal } from '../components/AuthGateModal'

export interface AuthGateConfig {
  title?: string
  message?: string
  /** Override the post-auth redirect destination. Defaults to current page. */
  redirectTo?: string
}

/**
 * Soft auth gate — if the user isn't logged in, shows a contextual signup modal
 * instead of silently failing or redirecting.
 *
 * Usage:
 *   const { requireAuth, modal } = useAuthGate()
 *   <button onClick={() => requireAuth(() => doThing(), { title: '...', message: '...' })} />
 *   {modal}
 *
 * Note: fn() is invoked synchronously when the user is authenticated,
 * so closure references to current state are safe.
 */
export function useAuthGate() {
  const { user } = useAuth()
  const location = useLocation()
  const [modalConfig, setModalConfig] = useState<{
    title: string
    message: string
    redirectParam: string
  } | null>(null)

  const requireAuth = (fn: () => void, config?: AuthGateConfig) => {
    if (user) {
      fn()
    } else {
      // Use config.redirectTo if provided (e.g. nav tab destination),
      // otherwise default to the current page so the user returns to context.
      // Only use pathname — search params risk double-encoding.
      const destination = config?.redirectTo ?? location.pathname
      setModalConfig({
        title: config?.title ?? 'Sign up to continue',
        message: config?.message ?? 'Create a free BreadBook account to access this feature.',
        redirectParam: `?redirectTo=${encodeURIComponent(destination)}`,
      })
    }
  }

  const modal = modalConfig ? (
    <AuthGateModal
      title={modalConfig.title}
      message={modalConfig.message}
      onClose={() => setModalConfig(null)}
      redirectParam={modalConfig.redirectParam}
    />
  ) : null

  return { requireAuth, modal }
}

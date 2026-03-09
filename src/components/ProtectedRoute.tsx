import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-crumb flex items-center justify-center">
        <div className="text-crust text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

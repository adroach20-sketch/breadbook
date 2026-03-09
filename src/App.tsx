import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Recipes } from './pages/Recipes'
import { RecipeDetail } from './pages/RecipeDetail'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { BakeMode } from './features/bake-mode/BakeMode'
import { JournalList } from './features/journal/JournalList'
import { JournalForm } from './features/journal/JournalForm'
import { JournalDetail } from './features/journal/JournalDetail'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes with layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/journal" element={<JournalList />} />
            <Route path="/journal/new" element={<JournalForm />} />
            <Route path="/journal/:id" element={<JournalDetail />} />
            <Route path="/journal/:id/edit" element={<JournalForm />} />
          </Route>

          {/* Bake mode — full screen, no nav (but still protected) */}
          <Route
            path="/bake/:id"
            element={
              <ProtectedRoute>
                <BakeMode />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

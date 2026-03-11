import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './lib/auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { RecipeDetail } from './pages/RecipeDetail'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { BakeMode } from './features/bake-mode/BakeMode'
import { JournalList } from './features/journal/JournalList'
import { JournalForm } from './features/journal/JournalForm'
import { JournalDetail } from './features/journal/JournalDetail'
import { Feed } from './pages/Feed'
import { CommunityRecipes } from './pages/CommunityRecipes'
import { BakerProfile } from './pages/BakerProfile'
import { ProfileEdit } from './features/community/ProfileEdit'
import { StarterDashboard } from './features/starter/StarterDashboard'
import { StarterDetail } from './pages/StarterDetail'
import { Schedule, ScheduleNew } from './pages/Schedule'
import { Troubleshoot } from './pages/Troubleshoot'
import { TroubleshootDetail } from './pages/TroubleshootDetail'
import { StarterGuide } from './pages/StarterGuide'

export default function App() {
  return (
    <ErrorBoundary>
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
            <Route path="/recipes" element={<Explore />} />
            <Route path="/explore" element={<Navigate to="/recipes" replace />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/journal" element={<JournalList />} />
            <Route path="/journal/new" element={<JournalForm />} />
            <Route path="/journal/:id" element={<JournalDetail />} />
            <Route path="/journal/:id/edit" element={<JournalForm />} />
            <Route path="/community" element={<Feed />} />
            <Route path="/community/recipes" element={<CommunityRecipes />} />
            <Route path="/@:username" element={<BakerProfile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/starters" element={<StarterDashboard />} />
            <Route path="/starters/guide" element={<StarterGuide />} />
            <Route path="/starters/:id" element={<StarterDetail />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/schedule/new" element={<ScheduleNew />} />
            <Route path="/troubleshoot" element={<Troubleshoot />} />
            <Route path="/troubleshoot/:symptomId" element={<TroubleshootDetail />} />
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
    </ErrorBoundary>
  )
}

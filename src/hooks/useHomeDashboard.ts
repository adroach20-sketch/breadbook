import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../lib/auth'
import { useStarters } from './useStarters'
import { getActivityLevel, formatTimeSinceFeed, getHealthStatus } from './useStarterActivity'
import { breadbookOriginals } from '../data/originals'
import { GUIDE_TOTAL_DAYS, starterGuide } from '../data/starter-guide'
import { supabase } from '../lib/supabase'

const BAKE_SESSION_KEY = 'breadbook-active-bake'

export type DashboardCardType =
  | 'resume_bake'
  | 'unlogged_bake'
  | 'starter_setup_nudge'
  | 'starter_needs_feeding'
  | 'starter_guide_progress'
  | null

export interface DashboardCard {
  type: DashboardCardType
  // Resume bake
  recipeId?: string
  recipeTitle?: string
  currentStep?: number
  totalSteps?: number
  // Unlogged bake
  sessionId?: string
  // Starter needs feeding
  starterName?: string
  starterHint?: string
  starterId?: string
  // Starter guide progress
  guideDay?: number
  guideDayTitle?: string
}

export function useHomeDashboard() {
  const { user, onboardingPath } = useAuth()
  const { starters } = useStarters()
  const [card, setCard] = useState<DashboardCard | null>(null)
  const [loading, setLoading] = useState(true)
  const resolvedRef = useRef(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = useCallback(() => {
    resolvedRef.current = false
    setRefreshKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    // If we already resolved a high-priority card (resume/unlogged),
    // don't re-resolve when starters load later
    if (resolvedRef.current && card?.type !== 'starter_needs_feeding' && card?.type !== 'starter_setup_nudge' && card !== null) {
      return
    }

    async function resolve() {
      // Priority 1: Resume active bake from localStorage
      const saved = localStorage.getItem(BAKE_SESSION_KEY)
      if (saved) {
        try {
          const session = JSON.parse(saved)
          if (session.recipeId) {
            // Try Supabase first, fall back to local originals
            const { data, error } = await supabase
              .from('recipes')
              .select('title, steps')
              .eq('id', session.recipeId)
              .single()

            const title = data?.title
              || breadbookOriginals.find(r => r.id === session.recipeId)?.title
            const stepCount = data && !error
              ? (Array.isArray(data.steps) ? data.steps.length : 0)
              : (breadbookOriginals.find(r => r.id === session.recipeId)?.steps.length ?? 0)

            if (title) {
              setCard({
                type: 'resume_bake',
                recipeId: session.recipeId,
                recipeTitle: title,
                currentStep: (session.currentStep || 0) + 1,
                totalSteps: stepCount,
              })
              resolvedRef.current = true
              setLoading(false)
              return
            }
          }
        } catch {
          // Corrupted localStorage — ignore
        }
      }

      // Priority 2: Completed bake with no journal entry
      const { data: unlogged, error: unloggedError } = await supabase
        .from('bake_sessions')
        .select('id, recipe_id, recipes(title)')
        .eq('user_id', user!.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(5)

      if (unloggedError) {
        console.warn('Dashboard: failed to fetch bake sessions', unloggedError.message)
      }

      if (unlogged && unlogged.length > 0) {
        const sessionIds = unlogged.map((s: any) => s.id)
        const { data: logged, error: loggedError } = await supabase
          .from('bake_logs')
          .select('bake_session_id')
          .in('bake_session_id', sessionIds)

        if (loggedError) {
          console.warn('Dashboard: failed to check bake logs', loggedError.message)
        }

        const loggedIds = new Set((logged || []).map((l: any) => l.bake_session_id))
        const firstUnlogged = unlogged.find((s: any) => !loggedIds.has(s.id))

        if (firstUnlogged) {
          setCard({
            type: 'unlogged_bake',
            recipeId: (firstUnlogged as any).recipe_id,
            recipeTitle: (firstUnlogged as any).recipes?.title || 'Your bake',
            sessionId: (firstUnlogged as any).id,
          })
          resolvedRef.current = true
          setLoading(false)
          return
        }
      }

      // Priority 3: Starter setup nudge — has_starter user who hasn't logged a single feed yet
      if (onboardingPath === 'has_starter' && starters.length > 0) {
        const starter = starters[0]
        const { data: anyLog } = await supabase
          .from('starter_logs')
          .select('id')
          .eq('starter_id', starter.id)
          .limit(1)

        if (!anyLog?.length) {
          setCard({ type: 'starter_setup_nudge', starterName: starter.name, starterId: starter.id })
          setLoading(false)
          return
        }
      }

      // Priority 4: Starter needs feeding
      if (starters.length > 0) {
        const starter = starters[0]
        const { data: logs, error: logsError } = await supabase
          .from('starter_logs')
          .select('*')
          .eq('starter_id', starter.id)
          .order('fed_at', { ascending: false })
          .limit(1)

        if (logsError) {
          console.warn('Dashboard: failed to fetch starter logs', logsError.message)
        }

        const lastLog = logs?.[0] || null
        const activity = getActivityLevel(lastLog)
        const health = getHealthStatus(lastLog, null)
        const timeSince = formatTimeSinceFeed(lastLog)

        if (health === 'red' || health === 'yellow') {
          const hint =
            activity === 'dormant'
              ? `${starter.name} hasn't been fed in a while (${timeSince}).`
              : activity === 'past_peak'
                ? `${starter.name} is past peak (${timeSince}). Feed soon!`
                : `${starter.name} was last fed ${timeSince}.`

          setCard({
            type: 'starter_needs_feeding',
            starterName: starter.name,
            starterHint: hint,
            starterId: starter.id,
          })
          setLoading(false)
          return
        }
      }

      // Priority 5: Starter guide in progress (new starter < 14 days old)
      if (starters.length > 0) {
        const starter = starters[0]
        const created = new Date(starter.created_at)
        created.setHours(0, 0, 0, 0)
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const daysSince = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))

        // Only show guide card during the 14-day window
        if (daysSince < GUIDE_TOTAL_DAYS) {
          const guideDay = daysSince + 1
          const today = starterGuide.find((d) => d.day === guideDay)
          if (today) {
            setCard({
              type: 'starter_guide_progress',
              starterName: starter.name,
              guideDay,
              guideDayTitle: today.title,
            })
            setLoading(false)
            return
          }
        }
      }

      // Nothing to show
      setCard(null)
      setLoading(false)
    }

    resolve()
  }, [user, starters, onboardingPath, refreshKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return { card, loading, refresh }
}

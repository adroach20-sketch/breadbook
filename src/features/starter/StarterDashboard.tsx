import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStarters } from '../../hooks/useStarters'
import { useLatestStarterLogs } from '../../hooks/useStarterLogs'
import { useAllStarterSchedules } from '../../hooks/useStarterSchedule'
import { useStarterReminderSync } from '../../hooks/useStarterReminderSync'
import { StarterCard } from './StarterCard'
import { StarterForm } from './StarterForm'
import { QuickFeedModal } from './QuickFeedModal'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import type { StarterLog } from '../../data/types'

/**
 * Main starter dashboard page.
 * Shows cards for each starter, quick-feed flow, and add starter form.
 */
export function StarterDashboard() {
  const { user } = useAuth()
  const { starters, loading, createStarter } = useStarters()
  const starterIds = useMemo(() => starters.map((s) => s.id), [starters])
  const { latestLogs, loading: logsLoading } = useLatestStarterLogs(starterIds)
  const { schedules } = useAllStarterSchedules(starterIds)

  // Sync feeding reminders whenever starters/logs/schedules change
  useStarterReminderSync(starters, latestLogs, schedules)

  const [showForm, setShowForm] = useState(false)
  const [quickFeedStarterId, setQuickFeedStarterId] = useState<string | null>(null)
  const [quickFeedLoading, setQuickFeedLoading] = useState(false)
  const [showFullForm, setShowFullForm] = useState(false)

  // We also need recent logs for sparklines - fetch all at once
  const [recentLogsMap, setRecentLogsMap] = useState<Record<string, StarterLog[]>>({})

  // Fetch recent logs for sparklines when starters load
  const starterIdKey = starterIds.join(',')
  useEffect(() => {
    if (!user || starterIds.length === 0) return
    async function fetchRecentLogs() {
      const { data } = await supabase
        .from('starter_logs')
        .select('*')
        .in('starter_id', starterIds)
        .eq('user_id', user!.id)
        .order('fed_at', { ascending: false })
        .limit(100)

      if (data) {
        const byStarter: Record<string, StarterLog[]> = {}
        for (const log of data as StarterLog[]) {
          if (!byStarter[log.starter_id]) byStarter[log.starter_id] = []
          if (byStarter[log.starter_id].length < 7) {
            byStarter[log.starter_id].push(log)
          }
        }
        setRecentLogsMap(byStarter)
      }
    }
    fetchRecentLogs()
  }, [user, starterIdKey])

  const handleCreateStarter = async (
    name: string,
    flourType: string,
    hydrationRatio: number,
    notes: string | null
  ) => {
    const result = await createStarter(name, flourType, hydrationRatio, notes)
    if (result) setShowForm(false)
    return result
  }

  const handleQuickFeed = async () => {
    if (!quickFeedStarterId || !user) return
    setQuickFeedLoading(true)

    const { data, error } = await supabase
      .from('starter_logs')
      .insert({
        starter_id: quickFeedStarterId,
        user_id: user.id,
        fed_at: new Date().toISOString(),
        is_quick_log: true,
      })
      .select()
      .single()

    setQuickFeedLoading(false)

    if (!error && data) {
      // Refresh the latest logs cache
      const log = data as StarterLog
      latestLogs[quickFeedStarterId] = log
      setQuickFeedStarterId(null)
    }
  }

  const quickFeedStarter = starters.find((s) => s.id === quickFeedStarterId)

  if (loading || logsLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="font-heading text-2xl font-bold text-char mb-6">My Starters</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-dough/50 rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-char">My Starters</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-crust text-steam px-4 py-2 rounded-lg text-sm font-medium hover:bg-crust/90 transition-colors"
          >
            + Add Starter
          </button>
        )}
      </div>

      {/* Add starter form */}
      {showForm && (
        <div className="bg-steam rounded-xl border border-dough p-4 mb-6">
          <StarterForm
            onSave={handleCreateStarter}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Starter guide banner for new starters */}
      {starters.length > 0 && (() => {
        const starter = starters[0]
        const created = new Date(starter.created_at)
        created.setHours(0, 0, 0, 0)
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const daysSince = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
        return daysSince < 14
      })() && (
        <Link
          to="/starters/guide"
          className="block bg-crust/5 border border-crust/20 rounded-xl p-4 mb-6 hover:bg-crust/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="text-sm font-medium text-char">Starter Guide</p>
              <p className="text-xs text-ash">Day-by-day instructions for your new starter</p>
            </div>
          </div>
        </Link>
      )}

      {/* Starter cards */}
      {starters.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">{'🧪'}</span>
          <p className="text-ash mb-4">No starters yet.</p>
          <div className="space-y-3">
            <button
              onClick={() => setShowForm(true)}
              className="text-crust font-medium hover:underline"
            >
              Add your first starter
            </button>
            <Link
              to="/starters/guide"
              className="block text-ash text-sm hover:text-char transition-colors"
            >
              New to sourdough? Follow our 14-day guide
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {starters.map((starter) => (
            <StarterCard
              key={starter.id}
              starter={starter}
              lastLog={latestLogs[starter.id] || null}
              schedule={schedules[starter.id] || null}
              recentLogs={recentLogsMap[starter.id] || []}
              onQuickFeed={setQuickFeedStarterId}
            />
          ))}
        </div>
      )}

      {/* Quick feed modal */}
      {quickFeedStarter && !showFullForm && (
        <QuickFeedModal
          starterName={quickFeedStarter.name}
          onConfirm={handleQuickFeed}
          onExpandForm={() => setShowFullForm(true)}
          onClose={() => setQuickFeedStarterId(null)}
          loading={quickFeedLoading}
        />
      )}
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type { StarterLog } from '../data/types'

/**
 * Hook for starter feeding log CRUD operations.
 */
export function useStarterLogs(starterId: string | undefined) {
  const { user } = useAuth()
  const [logs, setLogs] = useState<StarterLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    if (!user || !starterId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('starter_logs')
      .select('*')
      .eq('starter_id', starterId)
      .eq('user_id', user.id)
      .order('fed_at', { ascending: false })
      .limit(50)

    if (!error && data) {
      setLogs(data as StarterLog[])
    }
    setLoading(false)
  }, [user, starterId])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  /**
   * Quick log: just records a feeding timestamp with minimal data.
   */
  const quickLog = useCallback(async (
    sId: string
  ): Promise<StarterLog | null> => {
    if (!user) return null

    const { data, error } = await supabase
      .from('starter_logs')
      .insert({
        starter_id: sId,
        user_id: user.id,
        fed_at: new Date().toISOString(),
        is_quick_log: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to quick log:', error)
      return null
    }

    const log = data as StarterLog
    setLogs((prev) => [log, ...prev])
    return log
  }, [user])

  /**
   * Full feeding log with all optional details.
   */
  const createLog = useCallback(async (logData: {
    starter_id: string
    water_g?: number | null
    flour_g?: number | null
    temperature_f?: number | null
    peak_rise_pct?: number | null
    peak_rise_minutes?: number | null
    notes?: string | null
    photo_url?: string | null
  }): Promise<StarterLog | null> => {
    if (!user) return null

    const { data, error } = await supabase
      .from('starter_logs')
      .insert({
        ...logData,
        user_id: user.id,
        fed_at: new Date().toISOString(),
        is_quick_log: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create log:', error)
      return null
    }

    const log = data as StarterLog
    setLogs((prev) => [log, ...prev])
    return log
  }, [user])

  const deleteLog = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('starter_logs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete log:', error)
      return false
    }

    setLogs((prev) => prev.filter((l) => l.id !== id))
    return true
  }, [])

  /** Get the most recent log (for activity estimation). */
  const lastLog = logs.length > 0 ? logs[0] : null

  return { logs, lastLog, loading, fetchLogs, quickLog, createLog, deleteLog }
}

/**
 * Lightweight hook to fetch just the latest log per starter (for dashboard cards).
 * Avoids loading full log history for every starter card.
 */
export function useLatestStarterLogs(starterIds: string[]) {
  const { user } = useAuth()
  const [latestLogs, setLatestLogs] = useState<Record<string, StarterLog>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLatest() {
      if (!user || starterIds.length === 0) {
        setLoading(false)
        return
      }

      // Fetch recent logs for all starters, then pick latest per starter
      const { data, error } = await supabase
        .from('starter_logs')
        .select('*')
        .in('starter_id', starterIds)
        .eq('user_id', user.id)
        .order('fed_at', { ascending: false })

      if (!error && data) {
        const byStarter: Record<string, StarterLog> = {}
        for (const log of data as StarterLog[]) {
          if (!byStarter[log.starter_id]) {
            byStarter[log.starter_id] = log
          }
        }
        setLatestLogs(byStarter)
      }
      setLoading(false)
    }
    fetchLatest()
  }, [user, starterIds.join(',')])

  return { latestLogs, loading }
}

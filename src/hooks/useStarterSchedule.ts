import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type { StarterSchedule, StarterScheduleType } from '../data/types'

/**
 * Hook for starter schedule CRUD operations.
 */
export function useStarterSchedule(starterId: string | undefined) {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState<StarterSchedule | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSchedule = useCallback(async () => {
    if (!user || !starterId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('starter_schedules')
      .select('*')
      .eq('starter_id', starterId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!error && data) {
      setSchedule(data as StarterSchedule)
    }
    setLoading(false)
  }, [user, starterId])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  const saveSchedule = useCallback(async (scheduleData: {
    schedule_type: StarterScheduleType
    interval_hours: number
    preferred_times: string[]
    bake_recipe_id?: string | null
    bake_target_time?: string | null
  }): Promise<StarterSchedule | null> => {
    if (!user || !starterId) return null

    // Deactivate any existing schedule for this starter
    if (schedule) {
      await supabase
        .from('starter_schedules')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('starter_id', starterId)
        .eq('user_id', user.id)
        .eq('is_active', true)
    }

    const { data, error } = await supabase
      .from('starter_schedules')
      .insert({
        starter_id: starterId,
        user_id: user.id,
        ...scheduleData,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to save schedule:', error)
      return null
    }

    const newSchedule = data as StarterSchedule
    setSchedule(newSchedule)
    return newSchedule
  }, [user, starterId, schedule])

  const deactivateSchedule = useCallback(async (): Promise<boolean> => {
    if (!schedule) return false

    const { error } = await supabase
      .from('starter_schedules')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', schedule.id)

    if (error) {
      console.error('Failed to deactivate schedule:', error)
      return false
    }

    setSchedule(null)
    return true
  }, [schedule])

  return { schedule, loading, fetchSchedule, saveSchedule, deactivateSchedule }
}

/**
 * Fetch active schedules for all starters (for dashboard cards).
 */
export function useAllStarterSchedules(starterIds: string[]) {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<Record<string, StarterSchedule>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      if (!user || starterIds.length === 0) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('starter_schedules')
        .select('*')
        .in('starter_id', starterIds)
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (!error && data) {
        const byStarter: Record<string, StarterSchedule> = {}
        for (const s of data as StarterSchedule[]) {
          byStarter[s.starter_id] = s
        }
        setSchedules(byStarter)
      }
      setLoading(false)
    }
    fetch()
  }, [user, starterIds.join(',')])

  return { schedules, loading }
}

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type { Starter } from '../data/types'

/**
 * Hook for CRUD operations on starters.
 * Follows the same direct-Supabase-client pattern as journal hooks.
 */
export function useStarters() {
  const { user } = useAuth()
  const [starters, setStarters] = useState<Starter[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStarters = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data, error } = await supabase
      .from('starters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setStarters(data as Starter[])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchStarters()
  }, [fetchStarters])

  const createStarter = useCallback(async (
    name: string,
    flourType: string = 'all-purpose',
    hydrationRatio: number = 100,
    notes: string | null = null
  ): Promise<Starter | null> => {
    if (!user) return null

    const { data, error } = await supabase
      .from('starters')
      .insert({
        user_id: user.id,
        name,
        flour_type: flourType,
        hydration_ratio: hydrationRatio,
        notes,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create starter:', error)
      return null
    }

    const starter = data as Starter
    setStarters((prev) => [...prev, starter])
    return starter
  }, [user])

  const updateStarter = useCallback(async (
    id: string,
    updates: Partial<Pick<Starter, 'name' | 'flour_type' | 'hydration_ratio' | 'notes'>>
  ): Promise<boolean> => {
    const { error } = await supabase
      .from('starters')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Failed to update starter:', error)
      return false
    }

    setStarters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s))
    )
    return true
  }, [])

  const deleteStarter = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('starters')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete starter:', error)
      return false
    }

    setStarters((prev) => prev.filter((s) => s.id !== id))
    return true
  }, [])

  return { starters, loading, fetchStarters, createStarter, updateStarter, deleteStarter }
}

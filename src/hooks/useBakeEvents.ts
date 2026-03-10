import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export interface BakeEvent {
  stepIndex: number
  stepType: string
  eventType: 'fold_done' | 'rise_check' | 'room_temp' | 'dough_feel' | 'dough_smell' | 'shaping_method' | 'shaping_feel' | 'fridge_in' | 'poke_test' | 'off_plan'
  eventValue: string | null
  timestamp: number
}

const STORAGE_PREFIX = 'breadbook-bake-events-'

function getStorageKey(recipeId: string): string {
  return `${STORAGE_PREFIX}${recipeId}`
}

function loadFromStorage(recipeId: string): BakeEvent[] {
  try {
    const saved = localStorage.getItem(getStorageKey(recipeId))
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveToStorage(recipeId: string, events: BakeEvent[]): void {
  localStorage.setItem(getStorageKey(recipeId), JSON.stringify(events))
}

/**
 * Hook for managing in-bake event logging.
 * localStorage is the primary store (works for all users, survives refresh).
 * Supabase sync happens on each event when authenticated.
 */
export function useBakeEvents(
  recipeId: string | undefined,
  sessionId: string | null,
  userId: string | undefined
) {
  const [events, setEvents] = useState<BakeEvent[]>(() =>
    recipeId ? loadFromStorage(recipeId) : []
  )
  const eventsRef = useRef(events)
  eventsRef.current = events

  // Reload from storage if recipeId changes
  useEffect(() => {
    if (recipeId) {
      const loaded = loadFromStorage(recipeId)
      setEvents(loaded)
    }
  }, [recipeId])

  const logEvent = useCallback(
    (event: Omit<BakeEvent, 'timestamp'>) => {
      if (!recipeId) return

      const fullEvent: BakeEvent = { ...event, timestamp: Date.now() }
      const updated = [...eventsRef.current, fullEvent]
      setEvents(updated)
      saveToStorage(recipeId, updated)

      // Sync to Supabase if authenticated
      if (sessionId && userId) {
        supabase
          .from('bake_event_logs')
          .insert({
            bake_session_id: sessionId,
            user_id: userId,
            step_index: event.stepIndex,
            step_type: event.stepType,
            event_type: event.eventType,
            event_value: event.eventValue,
          })
          .then(({ error }) => {
            if (error) console.error('Failed to sync bake event:', error)
          })
      }
    },
    [recipeId, sessionId, userId]
  )

  const getEventsByType = useCallback(
    (eventType: BakeEvent['eventType']): BakeEvent[] => {
      return events.filter((e) => e.eventType === eventType)
    },
    [events]
  )

  const clearEvents = useCallback(() => {
    if (recipeId) {
      localStorage.removeItem(getStorageKey(recipeId))
    }
    setEvents([])
  }, [recipeId])

  return { events, logEvent, getEventsByType, clearEvents }
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StarterNotificationState {
  // Quiet hours
  quietHoursEnabled: boolean
  quietStart: string // 'HH:MM'
  quietEnd: string   // 'HH:MM'
  setQuietHours: (enabled: boolean, start: string, end: string) => void

  // Per-starter notification toggle
  disabledStarters: string[] // starter IDs with notifications disabled
  toggleStarterNotifications: (starterId: string) => void

  // Snooze tracking
  snoozedUntil: Record<string, number> // starterId -> timestamp
  snoozeStarter: (starterId: string, durationMs: number) => void
  clearSnooze: (starterId: string) => void
}

export const useStarterNotifications = create<StarterNotificationState>()(
  persist(
    (set) => ({
      quietHoursEnabled: false,
      quietStart: '22:00',
      quietEnd: '07:00',
      setQuietHours: (enabled, start, end) =>
        set({ quietHoursEnabled: enabled, quietStart: start, quietEnd: end }),

      disabledStarters: [],
      toggleStarterNotifications: (starterId) =>
        set((state) => ({
          disabledStarters: state.disabledStarters.includes(starterId)
            ? state.disabledStarters.filter((id) => id !== starterId)
            : [...state.disabledStarters, starterId],
        })),

      snoozedUntil: {},
      snoozeStarter: (starterId, durationMs) =>
        set((state) => ({
          snoozedUntil: { ...state.snoozedUntil, [starterId]: Date.now() + durationMs },
        })),
      clearSnooze: (starterId) =>
        set((state) => {
          const { [starterId]: _, ...rest } = state.snoozedUntil
          return { snoozedUntil: rest }
        }),
    }),
    { name: 'breadbook-starter-notifications' }
  )
)

/**
 * Check if we are currently in quiet hours.
 */
export function isInQuietHours(
  enabled: boolean,
  quietStart: string,
  quietEnd: string,
  now: Date = new Date()
): boolean {
  if (!enabled) return false

  const [startH, startM] = quietStart.split(':').map(Number)
  const [endH, endM] = quietEnd.split(':').map(Number)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  // Handle overnight quiet hours (e.g., 22:00 - 07:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes
  }
  return currentMinutes >= startMinutes && currentMinutes < endMinutes
}

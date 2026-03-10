import { useCallback, useRef, useEffect } from 'react'
import { useStarterNotifications, isInQuietHours } from '../store/starterNotifications'

/**
 * Hook for managing browser notifications for starter feeding reminders.
 * Uses the Browser Notification API (requires user permission).
 */
export function useNotifications() {
  const timerRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const { quietHoursEnabled, quietStart, quietEnd, disabledStarters, snoozedUntil } =
    useStarterNotifications()

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timerRefs.current).forEach(clearTimeout)
    }
  }, [])

  /**
   * Request notification permission from the browser.
   * Returns true if granted.
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false

    const result = await Notification.requestPermission()
    return result === 'granted'
  }, [])

  /**
   * Check if notifications are currently allowed
   * (permission granted + not in quiet hours + not snoozed + not disabled).
   */
  const canNotify = useCallback((starterId: string): boolean => {
    if (!('Notification' in window)) return false
    if (Notification.permission !== 'granted') return false
    if (disabledStarters.includes(starterId)) return false

    // Check snooze
    const snoozedTime = snoozedUntil[starterId]
    if (snoozedTime && Date.now() < snoozedTime) return false

    // Check quiet hours
    if (isInQuietHours(quietHoursEnabled, quietStart, quietEnd)) return false

    return true
  }, [quietHoursEnabled, quietStart, quietEnd, disabledStarters, snoozedUntil])

  /**
   * Schedule a feeding reminder notification.
   * @param starterId - The starter to remind about
   * @param starterName - Human-readable name for the notification
   * @param delayMs - Milliseconds from now to show the notification
   * @param type - Type of reminder
   */
  const scheduleReminder = useCallback((
    starterId: string,
    starterName: string,
    delayMs: number,
    type: 'schedule' | 'bake_linked' | 'rise_check' = 'schedule'
  ) => {
    // Clear any existing timer for this starter
    if (timerRefs.current[starterId]) {
      clearTimeout(timerRefs.current[starterId])
    }

    if (delayMs <= 0) return

    timerRefs.current[starterId] = setTimeout(() => {
      if (!canNotify(starterId)) return

      const titles: Record<string, string> = {
        schedule: 'Time to feed ' + starterName + '!',
        bake_linked: starterName + ' needs a feed for your bake',
        rise_check: 'Check on ' + starterName + " - how's the rise?",
      }

      const bodies: Record<string, string> = {
        schedule: 'Your starter is due for a feeding. Tap to log it.',
        bake_linked: 'Feed now so your starter is ready at bake time.',
        rise_check: 'It might be near peak. Take a look!',
      }

      new Notification(titles[type], {
        body: bodies[type],
        icon: '/breadbook-icon.svg',
        tag: 'starter-' + starterId + '-' + type,
      })

      delete timerRefs.current[starterId]
    }, delayMs)
  }, [canNotify])

  /**
   * Cancel a scheduled reminder.
   */
  const cancelReminder = useCallback((starterId: string) => {
    if (timerRefs.current[starterId]) {
      clearTimeout(timerRefs.current[starterId])
      delete timerRefs.current[starterId]
    }
  }, [])

  return {
    requestPermission,
    canNotify,
    scheduleReminder,
    cancelReminder,
    notificationsSupported: 'Notification' in window,
    permissionStatus: typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'denied',
  }
}

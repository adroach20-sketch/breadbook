import { useEffect } from 'react'
import { useNotifications } from './useNotifications'
import type { Starter, StarterLog, StarterSchedule } from '../data/types'

/**
 * Syncs browser notification reminders for all starters that have an active
 * feeding schedule. Call this wherever you have starters + their latest logs
 * + their schedules in scope (e.g. StarterDashboard).
 *
 * Calculates next feed time as: lastFed + intervalHours, then schedules a
 * browser notification for that moment. Runs on mount and whenever the data
 * changes (e.g. after a feeding is logged).
 *
 * Limitations: setTimeout doesn't survive tab close. Push notifications via
 * Capacitor are planned for v1.0.
 */
export function useStarterReminderSync(
  starters: Starter[],
  latestLogs: Record<string, StarterLog | undefined>,
  schedules: Record<string, StarterSchedule>
) {
  const { scheduleReminder, cancelReminder } = useNotifications()

  useEffect(() => {
    for (const starter of starters) {
      const schedule = schedules[starter.id]
      const lastLog = latestLogs[starter.id]

      if (!schedule) {
        // No schedule — cancel any pending reminder
        cancelReminder(starter.id)
        continue
      }

      if (!lastLog) {
        // Has a schedule but no feeding logged yet — nothing to base timing on
        continue
      }

      const nextFeedMs =
        new Date(lastLog.fed_at).getTime() + schedule.interval_hours * 60 * 60 * 1000
      const delayMs = nextFeedMs - Date.now()

      if (delayMs > 0) {
        scheduleReminder(starter.id, starter.name, delayMs, 'schedule')
      } else {
        // Already overdue — cancel stale timers, the card UI shows the overdue state
        cancelReminder(starter.id)
      }
    }
  }, [starters, latestLogs, schedules, scheduleReminder, cancelReminder])
}

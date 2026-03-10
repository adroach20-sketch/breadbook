import type { StarterLog, StarterActivityLevel, StarterHealthStatus } from '../data/types'
import { ACTIVITY_THRESHOLDS } from '../data/types'

/**
 * Calculate estimated peak time in hours based on temperature.
 * Default: 6 hours at 75F. Adjusts +/-1hr per 5F deviation.
 * Warmer = faster peak, cooler = slower peak.
 */
export function estimatePeakHours(temperatureF: number | null): number {
  const t = ACTIVITY_THRESHOLDS
  if (!temperatureF) return t.DEFAULT_PEAK_HOURS

  const deviation = t.REFERENCE_TEMP_F - temperatureF
  const adjustment = (deviation / 5) * t.TEMP_ADJUSTMENT_PER_5F
  // Clamp between 3 and 12 hours
  return Math.max(3, Math.min(12, t.DEFAULT_PEAK_HOURS + adjustment))
}

/**
 * Determine current activity level based on hours since last feed
 * and optional temperature data.
 */
export function getActivityLevel(
  lastLog: StarterLog | null,
  now: Date = new Date()
): StarterActivityLevel {
  if (!lastLog) return 'dormant'

  const fedAt = new Date(lastLog.fed_at)
  const hoursSinceFeed = (now.getTime() - fedAt.getTime()) / (1000 * 60 * 60)

  // Use temperature-adjusted peak estimate if available
  const peakHours = estimatePeakHours(lastLog.temperature_f)

  // Scale activity windows proportionally to peak time
  const scale = peakHours / ACTIVITY_THRESHOLDS.DEFAULT_PEAK_HOURS

  if (hoursSinceFeed > ACTIVITY_THRESHOLDS.DORMANT_AFTER_HOURS * scale) return 'dormant'
  if (hoursSinceFeed > ACTIVITY_THRESHOLDS.PEAK_HOURS * scale) return 'past_peak'
  if (hoursSinceFeed > ACTIVITY_THRESHOLDS.ACTIVE_HOURS * scale) return 'peak'
  if (hoursSinceFeed > ACTIVITY_THRESHOLDS.WAKING_UP_HOURS * scale) return 'active'
  return 'waking_up'
}

/**
 * Determine health status (green/yellow/red) based on schedule adherence.
 * Green = fed on schedule, Yellow = feed due soon, Red = overdue.
 */
export function getHealthStatus(
  lastLog: StarterLog | null,
  intervalHours: number | null,
  now: Date = new Date()
): StarterHealthStatus {
  if (!lastLog) return 'red' // Never fed

  const fedAt = new Date(lastLog.fed_at)
  const hoursSinceFeed = (now.getTime() - fedAt.getTime()) / (1000 * 60 * 60)

  // If no schedule, use 24hr default
  const interval = intervalHours || 24

  if (hoursSinceFeed > interval * 1.5) return 'red'    // Overdue (50% past schedule)
  if (hoursSinceFeed > interval * 0.8) return 'yellow'  // Due soon (within 20% of schedule)
  return 'green'
}

/**
 * Calculate time until next feed is due.
 * Returns { hours, minutes } or null if no schedule.
 */
export function getTimeUntilNextFeed(
  lastLog: StarterLog | null,
  intervalHours: number | null,
  now: Date = new Date()
): { hours: number; minutes: number; overdue: boolean } | null {
  if (!lastLog || !intervalHours) return null

  const fedAt = new Date(lastLog.fed_at)
  const nextFeedTime = new Date(fedAt.getTime() + intervalHours * 60 * 60 * 1000)
  const diffMs = nextFeedTime.getTime() - now.getTime()
  const overdue = diffMs < 0
  const absDiffMs = Math.abs(diffMs)

  return {
    hours: Math.floor(absDiffMs / (1000 * 60 * 60)),
    minutes: Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60)),
    overdue,
  }
}

/**
 * Format relative time since last feed in human-readable form.
 */
export function formatTimeSinceFeed(lastLog: StarterLog | null, now: Date = new Date()): string {
  if (!lastLog) return 'Never fed'

  const fedAt = new Date(lastLog.fed_at)
  const diffMs = now.getTime() - fedAt.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (hours === 0 && minutes < 1) return 'Just now'
  if (hours === 0) return minutes + 'm ago'
  if (hours < 24) return hours + 'h ' + minutes + 'm ago'
  const days = Math.floor(hours / 24)
  return days + 'd ago'
}

/**
 * Generate a human-readable next action message.
 */
export function getNextAction(
  activity: StarterActivityLevel,
  timeUntilFeed: { hours: number; minutes: number; overdue: boolean } | null
): string {
  if (!timeUntilFeed) {
    if (activity === 'peak') return 'Ready to bake!'
    if (activity === 'dormant') return 'Set up a feeding schedule'
    return 'No schedule set'
  }

  if (timeUntilFeed.overdue) {
    return 'Feed now! ' + timeUntilFeed.hours + 'h ' + timeUntilFeed.minutes + 'm overdue'
  }

  if (activity === 'peak') return 'Ready to bake! Next feed in ' + timeUntilFeed.hours + 'h'
  return 'Next feed in ' + timeUntilFeed.hours + 'h ' + timeUntilFeed.minutes + 'm'
}

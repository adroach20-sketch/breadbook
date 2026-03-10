import { Link } from 'react-router-dom'
import type { Starter, StarterLog, StarterSchedule } from '../../data/types'
import { activityLabels, healthStatusColors } from '../../data/types'
import { getActivityLevel, getHealthStatus, formatTimeSinceFeed, getTimeUntilNextFeed, getNextAction } from '../../hooks/useStarterActivity'
import { ActivitySparkline } from './ActivitySparkline'

interface StarterCardProps {
  starter: Starter
  lastLog: StarterLog | null
  schedule: StarterSchedule | null
  recentLogs: StarterLog[]
  onQuickFeed: (starterId: string) => void
}

/**
 * Dashboard card for a single starter.
 * Shows: name, activity level, health status, sparkline, quick-log button.
 */
export function StarterCard({ starter, lastLog, schedule, recentLogs, onQuickFeed }: StarterCardProps) {
  const activity = getActivityLevel(lastLog)
  const health = getHealthStatus(lastLog, schedule?.interval_hours ?? null)
  const timeSinceFeed = formatTimeSinceFeed(lastLog)
  const timeUntilFeed = getTimeUntilNextFeed(lastLog, schedule?.interval_hours ?? null)
  const nextAction = getNextAction(activity, timeUntilFeed)

  const activityInfo = activityLabels[activity]
  const healthInfo = healthStatusColors[health]

  return (
    <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-4 hover:shadow-md transition-shadow">
      {/* Header row: name + health badge */}
      <div className="flex items-start justify-between mb-3">
        <Link to={'/starters/' + starter.id} className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-char text-lg leading-tight truncate">
            {starter.name}
          </h3>
          <p className="text-xs text-ash mt-0.5">{starter.flour_type} starter</p>
        </Link>
        <span className={'text-xs font-medium px-2 py-0.5 rounded-full ' + healthInfo.bgClass + ' ' + healthInfo.textClass}>
          {healthInfo.label}
        </span>
      </div>

      {/* Activity level */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{activityInfo.emoji}</span>
        <span className="text-sm font-medium text-char">{activityInfo.label}</span>
        <span className="text-xs text-ash">{'·'} {timeSinceFeed}</span>
      </div>

      {/* Next action */}
      <p className="text-sm text-ash mb-3">{nextAction}</p>

      {/* Sparkline */}
      <div className="mb-3">
        <ActivitySparkline logs={recentLogs} />
      </div>

      {/* Quick feed button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          onQuickFeed(starter.id)
        }}
        className="w-full bg-crust/10 text-crust py-2 rounded-lg font-medium text-sm hover:bg-crust/20 transition-colors"
      >
        Quick Feed
      </button>
    </div>
  )
}

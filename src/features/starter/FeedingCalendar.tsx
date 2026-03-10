import type { StarterLog, StarterSchedule } from '../../data/types'

interface FeedingCalendarProps {
  logs: StarterLog[]
  schedule: StarterSchedule | null
}

/**
 * 7-day horizontal calendar strip showing feeding activity.
 * Green dot = fed on schedule, outline = scheduled but not fed, red = missed.
 */
export function FeedingCalendar({ logs, schedule }: FeedingCalendarProps) {
  const today = new Date()
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d)
  }

  // Calculate expected feeds per day based on schedule
  const intervalHours = schedule?.interval_hours || 24
  const feedsPerDay = Math.max(1, Math.round(24 / intervalHours))

  return (
    <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-4">
      <h3 className="font-heading text-sm font-semibold text-char mb-3">Last 7 Days</h3>
      <div className="flex gap-1 justify-between">
        {days.map((day) => {
          const dateStr = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          const dayLabel = day.toLocaleDateString('en-US', { weekday: 'short' })
          const isToday = day.toDateString() === today.toDateString()
          const isPast = day < today && !isToday

          // Count actual feeds on this day
          const feedCount = logs.filter((l) => {
            const ld = new Date(l.fed_at)
            return ld.toDateString() === day.toDateString()
          }).length

          return (
            <div key={dateStr} className="flex flex-col items-center gap-1 flex-1">
              <span className={'text-xs ' + (isToday ? 'font-semibold text-crust' : 'text-ash')}>
                {dayLabel}
              </span>
              <span className={'text-xs ' + (isToday ? 'text-char' : 'text-ash-muted')}>
                {day.getDate()}
              </span>
              {/* Feed indicators */}
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: feedsPerDay }).map((_, i) => {
                  const filled = i < feedCount
                  const missed = isPast && !filled
                  return (
                    <div
                      key={i}
                      className={
                        'w-2.5 h-2.5 rounded-full ' +
                        (filled
                          ? 'bg-green-500'
                          : missed
                            ? 'bg-red-300'
                            : 'border border-dough bg-transparent')
                      }
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

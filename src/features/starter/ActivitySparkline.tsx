import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'
import type { StarterLog } from '../../data/types'

interface ActivitySparklineProps {
  logs: StarterLog[]
}

/**
 * Mini sparkline showing peak rise % for the last 7 feedings.
 * Displayed in starter dashboard cards. Uses Recharts.
 */
export function ActivitySparkline({ logs }: ActivitySparklineProps) {
  // Get last 7 logs with peak_rise_pct data, oldest first for left-to-right chart
  const dataLogs = logs
    .filter((l) => l.peak_rise_pct != null)
    .slice(0, 7)
    .reverse()

  if (dataLogs.length < 2) {
    return (
      <div className="h-8 flex items-center">
        <span className="text-xs text-ash/50">Not enough data</span>
      </div>
    )
  }

  const data = dataLogs.map((l) => ({
    rise: l.peak_rise_pct ?? 0,
  }))

  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={[0, 'auto']} hide />
          <Line
            type="monotone"
            dataKey="rise"
            stroke="#8B5E3C"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

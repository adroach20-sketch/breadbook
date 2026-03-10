import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { StarterLog } from '../../data/types'
import { useThemeColors } from '../../hooks/useThemeColors'

interface ActivityChartProps {
  logs: StarterLog[]
  /** Optional second starter logs for overlay comparison */
  comparisonLogs?: StarterLog[]
  comparisonName?: string
  starterName: string
}

/**
 * Full activity chart showing rise/fall curve over the last 7 days.
 * Supports overlaying a second starter for comparison.
 */
export function ActivityChart({
  logs,
  comparisonLogs,
  comparisonName,
  starterName,
}: ActivityChartProps) {
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7)
  const colors = useThemeColors()

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - timeRange)

  // Filter and format primary logs
  const filteredLogs = logs
    .filter((l) => new Date(l.fed_at) >= cutoff && l.peak_rise_pct != null)
    .reverse()

  // Build chart data points
  const chartData = filteredLogs.map((l) => {
    const date = new Date(l.fed_at)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      [starterName]: l.peak_rise_pct,
      notes: l.notes,
    }
  })

  // Merge comparison data if provided
  if (comparisonLogs && comparisonName) {
    const compFiltered = comparisonLogs
      .filter((l) => new Date(l.fed_at) >= cutoff && l.peak_rise_pct != null)
      .reverse()

    for (const l of compFiltered) {
      const date = new Date(l.fed_at)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const existing = chartData.find((d) => d.date === dateStr)
      if (existing) {
        (existing as Record<string, unknown>)[comparisonName] = l.peak_rise_pct
      } else {
        chartData.push({
          date: dateStr,
          timestamp: date.getTime(),
          [starterName]: undefined as unknown as number | null,
          [comparisonName]: l.peak_rise_pct,
          notes: null,
        } as Record<string, unknown> as typeof chartData[number])
      }
    }
    // Re-sort by timestamp
    chartData.sort((a, b) => a.timestamp - b.timestamp)
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-6 text-center">
        <p className="text-ash">No rise data yet. Log peak rise % with your feedings to see trends.</p>
      </div>
    )
  }

  return (
    <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-char">Activity Chart</h3>
        <div className="flex gap-1">
          {([7, 14, 30] as const).map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={
                'px-2 py-1 text-xs rounded-md transition-colors ' +
                (timeRange === days
                  ? 'bg-crust text-steam'
                  : 'text-ash hover:text-char')
              }
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.dough} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: colors.ash }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: colors.ash }}
              tickLine={false}
              label={{
                value: 'Rise %',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12, fill: colors.ash },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.steam,
                border: `1px solid ${colors.dough}`,
                borderRadius: '8px',
                fontSize: '12px',
                color: colors.char,
              }}
              formatter={(value: number, name: string) => [value + '%', name]}
            />
            {comparisonName && <Legend />}
            <Line
              type="monotone"
              dataKey={starterName}
              stroke={colors.crust}
              strokeWidth={2}
              dot={{ fill: colors.crust, r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
            {comparisonName && (
              <Line
                type="monotone"
                dataKey={comparisonName}
                stroke={colors.wheat}
                strokeWidth={2}
                dot={{ fill: colors.wheat, r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

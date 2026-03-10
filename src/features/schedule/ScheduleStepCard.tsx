import { useState } from 'react'
import type { ScheduleStep } from '../../data/types'
import { formatScheduleTime, formatDuration, CATEGORY_CONFIG } from '../../lib/schedule-engine'

interface ScheduleStepCardProps {
  step: ScheduleStep
  isFirst: boolean
  isLast: boolean
}

export function ScheduleStepCard({ step, isFirst, isLast }: ScheduleStepCardProps) {
  const [expanded, setExpanded] = useState(false)
  const config = CATEGORY_CONFIG[step.category]

  return (
    <div className="flex gap-3">
      {/* Timeline spine */}
      <div className="flex flex-col items-center w-8 shrink-0">
        {/* Line above dot */}
        <div className={`w-0.5 flex-1 ${isFirst ? 'bg-transparent' : 'bg-dough'}`} />
        {/* Dot */}
        <div className={`w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-steam ${config.dotClass}`} />
        {/* Line below dot */}
        <div className={`w-0.5 flex-1 ${isLast ? 'bg-transparent' : 'bg-dough'}`} />
      </div>

      {/* Card */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex-1 rounded-xl p-4 mb-2 text-left transition-colors ${config.bgClass} border border-dough`}
        aria-expanded={expanded}
        aria-label={`${step.title}, ${formatScheduleTime(step.startTime)}, ${formatDuration(step.durationMinutes)}`}
      >
        {/* Time + duration row */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-char">
            {formatScheduleTime(step.startTime)}
          </span>
          <span className="text-xs text-ash flex items-center gap-1">
            {step.isActive ? (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-crust" title="Hands-on step" />
            ) : (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-ash/40" title="Passive step" />
            )}
            {formatDuration(step.durationMinutes)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-medium text-char">{step.title}</h3>

        {/* Category badge */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
          <span className="text-xs text-ash">{config.label}</span>
        </div>

        {/* Expandable details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-dough/30">
            <p className="text-sm text-ash leading-relaxed">
              {step.description}
            </p>
            <p className="text-xs text-ash-muted mt-2">
              {formatScheduleTime(step.startTime)} — {formatScheduleTime(step.endTime)}
            </p>
          </div>
        )}
      </button>
    </div>
  )
}

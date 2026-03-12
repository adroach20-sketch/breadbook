import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useStarters } from '../hooks/useStarters'
import { useStarterLogs } from '../hooks/useStarterLogs'
import { useStarterSchedule } from '../hooks/useStarterSchedule'
import { useNotifications } from '../hooks/useNotifications'
import { getActivityLevel, getHealthStatus, formatTimeSinceFeed, getTimeUntilNextFeed, getNextAction } from '../hooks/useStarterActivity'
import { activityLabels, healthStatusColors } from '../data/types'
import { ActivityChart } from '../features/starter/ActivityChart'
import { FeedingCalendar } from '../features/starter/FeedingCalendar'
import { FeedingLogForm } from '../features/starter/FeedingLogForm'
import { ScheduleForm } from '../features/starter/ScheduleForm'
import { ReminderSettings } from '../features/starter/ReminderSettings'
import { StarterForm } from '../features/starter/StarterForm'
import { QuickFeedModal } from '../features/starter/QuickFeedModal'
import type { StarterLog } from '../data/types'

/**
 * Detail page for a single starter.
 * Shows: info header, activity status, quick feed, feeding calendar,
 * activity chart, feeding log list, schedule, and reminders.
 */
export function StarterDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { starters, loading: startersLoading, updateStarter, deleteStarter } = useStarters()
  const { logs, loading: logsLoading, quickLog, createLog, deleteLog } = useStarterLogs(id)
  const { schedule, loading: scheduleLoading, saveSchedule, deactivateSchedule } = useStarterSchedule(id)
  const { scheduleReminder, cancelReminder } = useNotifications()

  const [showEditForm, setShowEditForm] = useState(false)
  const [showFeedingForm, setShowFeedingForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showQuickFeed, setShowQuickFeed] = useState(false)
  const [quickFeedLoading, setQuickFeedLoading] = useState(false)
  const [feedingSaving, setFeedingSaving] = useState(false)
  const [scheduleSaving, setScheduleSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const starter = starters.find((s) => s.id === id)
  const lastLog = logs.length > 0 ? logs[0] : null

  // Loading state
  if (startersLoading || logsLoading || scheduleLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="h-6 w-24 bg-dough/50 rounded animate-pulse mb-6" />
        <div className="bg-dough/50 rounded-xl h-40 animate-pulse mb-4" />
        <div className="bg-dough/50 rounded-xl h-64 animate-pulse mb-4" />
        <div className="bg-dough/50 rounded-xl h-48 animate-pulse" />
      </div>
    )
  }

  // Not found
  if (!starter) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-5xl block mb-4">{'🔍'}</span>
        <p className="text-ash mb-4">Starter not found. It may have been deleted.</p>
        <Link to="/starters" className="text-crust font-medium hover:underline">
          Back to My Starters
        </Link>
      </div>
    )
  }

  const activity = getActivityLevel(lastLog)
  const health = getHealthStatus(lastLog, schedule?.interval_hours ?? null)
  const timeSinceFeed = formatTimeSinceFeed(lastLog)
  const timeUntilFeed = getTimeUntilNextFeed(lastLog, schedule?.interval_hours ?? null)
  const nextAction = getNextAction(activity, timeUntilFeed)
  const activityInfo = activityLabels[activity]
  const healthInfo = healthStatusColors[health]

  const handleQuickFeed = async () => {
    if (!id || !starter) return
    setQuickFeedLoading(true)
    await quickLog(id)
    setQuickFeedLoading(false)
    setShowQuickFeed(false)
    // Reschedule reminder based on current schedule interval from now
    if (schedule) {
      scheduleReminder(starter.id, starter.name, schedule.interval_hours * 60 * 60 * 1000, 'schedule')
    }
  }

  const handleCreateLog = async (data: Parameters<typeof createLog>[0]) => {
    setFeedingSaving(true)
    const result = await createLog(data)
    setFeedingSaving(false)
    if (result) {
      setShowFeedingForm(false)
      // Reschedule reminder from the logged feed time
      if (starter && schedule) {
        const fedAt = new Date(result.fed_at ?? Date.now()).getTime()
        const delayMs = fedAt + schedule.interval_hours * 60 * 60 * 1000 - Date.now()
        if (delayMs > 0) {
          scheduleReminder(starter.id, starter.name, delayMs, 'schedule')
        }
      }
    }
    return result
  }

  const handleSaveSchedule = async (data: Parameters<typeof saveSchedule>[0]) => {
    setScheduleSaving(true)
    const result = await saveSchedule(data)
    setScheduleSaving(false)
    if (result) {
      setShowScheduleForm(false)
      // If we have a last feeding, schedule the reminder based on the new interval
      if (starter && lastLog) {
        const nextFeedMs =
          new Date(lastLog.fed_at).getTime() + data.interval_hours * 60 * 60 * 1000
        const delayMs = nextFeedMs - Date.now()
        if (delayMs > 0) {
          scheduleReminder(starter.id, starter.name, delayMs, 'schedule')
        } else {
          cancelReminder(starter.id)
        }
      }
    }
    return result
  }

  const handleUpdateStarter = async (
    name: string,
    flourType: string,
    hydrationRatio: number,
    notes: string | null
  ) => {
    const result = await updateStarter(starter.id, {
      name,
      flour_type: flourType,
      hydration_ratio: hydrationRatio,
      notes,
    })
    if (result) setShowEditForm(false)
    return result
  }

  const handleDelete = async () => {
    setDeleting(true)
    const result = await deleteStarter(starter.id)
    if (result) {
      navigate('/starters')
    }
    setDeleting(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        to="/starters"
        className="inline-flex items-center text-sm text-crust hover:text-crust-light transition-colors mb-4"
      >
        {'<-'} My Starters
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-2xl font-bold text-char leading-tight">
            {starter.name}
          </h1>
          <p className="text-sm text-ash mt-1">
            {starter.flour_type} starter · {starter.hydration_ratio}% hydration
          </p>
        </div>
        <span
          className={
            'text-sm font-medium px-3 py-1 rounded-full ' +
            healthInfo.bgClass + ' ' + healthInfo.textClass
          }
        >
          {healthInfo.label}
        </span>
      </div>

      {/* Activity status bar */}
      <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activityInfo.emoji}</span>
            <span className="font-medium text-char">{activityInfo.label}</span>
            <span className="text-sm text-ash">{'·'} {timeSinceFeed}</span>
          </div>
        </div>
        <p className="text-sm text-ash mb-3">{nextAction}</p>
        <button
          onClick={() => setShowQuickFeed(true)}
          className="w-full bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors"
        >
          Quick Feed
        </button>
      </div>

      {/* Feeding calendar */}
      <div className="mb-4">
        <FeedingCalendar logs={logs} schedule={schedule} />
      </div>

      {/* Activity chart */}
      <div className="mb-4">
        <ActivityChart logs={logs} starterName={starter.name} />
      </div>

      {/* Feeding log section */}
      <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-char">Feeding Log</h3>
          {!showFeedingForm && (
            <button
              onClick={() => setShowFeedingForm(true)}
              className="text-sm text-crust font-medium hover:text-crust/80 transition-colors"
            >
              + Full Log
            </button>
          )}
        </div>

        {showFeedingForm && (
          <div className="mb-4">
            <FeedingLogForm
              starterId={starter.id}
              onSave={handleCreateLog}
              onCancel={() => setShowFeedingForm(false)}
              saving={feedingSaving}
            />
          </div>
        )}

        {/* Log entries */}
        {logs.length === 0 ? (
          <p className="text-sm text-ash py-4 text-center">
            No feedings logged yet. Tap Quick Feed above to get started!
          </p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 10).map((log) => (
              <FeedingLogEntry key={log.id} log={log} onDelete={deleteLog} />
            ))}
            {logs.length > 10 && (
              <p className="text-xs text-ash text-center pt-2">
                Showing last 10 of {logs.length} feedings
              </p>
            )}
          </div>
        )}
      </div>

      {/* Schedule section */}
      <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-char">Feeding Schedule</h3>
          {!showScheduleForm && (
            <button
              onClick={() => setShowScheduleForm(true)}
              className="text-sm text-crust font-medium hover:text-crust/80 transition-colors"
            >
              {schedule ? 'Edit' : '+ Set up'}
            </button>
          )}
        </div>

        {showScheduleForm ? (
          <ScheduleForm
            onSave={handleSaveSchedule}
            onCancel={() => setShowScheduleForm(false)}
            currentInterval={schedule?.interval_hours}
            currentTimes={schedule?.preferred_times}
            saving={scheduleSaving}
          />
        ) : schedule ? (
          <div>
            <p className="text-sm text-char">
              Every {schedule.interval_hours} hours
            </p>
            {schedule.preferred_times.length > 0 && (
              <p className="text-sm text-ash mt-1">
                Preferred times: {schedule.preferred_times.join(', ')}
              </p>
            )}
            <button
              onClick={deactivateSchedule}
              className="text-xs text-ash hover:text-red-500 mt-2 transition-colors"
            >
              Remove schedule
            </button>
          </div>
        ) : (
          <p className="text-sm text-ash">
            No schedule set. Add one to get feeding reminders!
          </p>
        )}
      </div>

      {/* Reminders */}
      <div className="mb-4">
        <ReminderSettings starterId={starter.id} starterName={starter.name} />
      </div>

      {/* Starter info / edit / delete */}
      <div className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-char">Starter Details</h3>
          {!showEditForm && (
            <button
              onClick={() => setShowEditForm(true)}
              className="text-sm text-crust font-medium hover:text-crust/80 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {showEditForm ? (
          <StarterForm
            starter={starter}
            onSave={handleUpdateStarter}
            onCancel={() => setShowEditForm(false)}
          />
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-char">
              <span className="text-ash">Flour:</span> {starter.flour_type}
            </p>
            <p className="text-sm text-char">
              <span className="text-ash">Hydration:</span> {starter.hydration_ratio}%
            </p>
            {starter.notes && (
              <p className="text-sm text-char">
                <span className="text-ash">Notes:</span> {starter.notes}
              </p>
            )}
            <p className="text-xs text-ash mt-2">
              Created {new Date(starter.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Delete */}
        <div className="border-t border-dough mt-4 pt-4">
          {showDeleteConfirm ? (
            <div className="space-y-2">
              <p className="text-sm text-red-600 dark:text-red-400">
                This will permanently delete {starter.name} and all feeding logs. Are you sure?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-500 text-steam py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 text-ash py-2 rounded-lg text-sm font-medium hover:text-char transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-ash hover:text-red-500 transition-colors"
            >
              Delete this starter
            </button>
          )}
        </div>
      </div>

      {/* Quick feed modal */}
      {showQuickFeed && (
        <QuickFeedModal
          starterName={starter.name}
          onConfirm={handleQuickFeed}
          onExpandForm={() => {
            setShowQuickFeed(false)
            setShowFeedingForm(true)
          }}
          onClose={() => setShowQuickFeed(false)}
          loading={quickFeedLoading}
        />
      )}
    </div>
  )
}

/**
 * A single feeding log entry row.
 */
function FeedingLogEntry({ log, onDelete }: { log: StarterLog; onDelete: (id: string) => Promise<boolean> }) {
  const [showDelete, setShowDelete] = useState(false)

  const fedAt = new Date(log.fed_at)
  const dateStr = fedAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const timeStr = fedAt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div
      className="flex items-center justify-between py-2 border-b border-dough/30 last:border-b-0"
      onClick={() => setShowDelete(!showDelete)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') setShowDelete(!showDelete) }}
      aria-label={'Feeding on ' + dateStr + ' at ' + timeStr}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-char">{dateStr}</span>
          <span className="text-xs text-ash">{timeStr}</span>
          {log.is_quick_log && (
            <span className="text-xs bg-dough/50 text-ash px-1.5 py-0.5 rounded">quick</span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
          {log.water_g != null && (
            <span className="text-xs text-ash">{log.water_g}g water</span>
          )}
          {log.flour_g != null && (
            <span className="text-xs text-ash">{log.flour_g}g flour</span>
          )}
          {log.temperature_f != null && (
            <span className="text-xs text-ash">{log.temperature_f}F</span>
          )}
          {log.peak_rise_pct != null && (
            <span className="text-xs text-ash">{log.peak_rise_pct}% rise</span>
          )}
        </div>
        {log.notes && (
          <p className="text-xs text-ash-muted mt-0.5 truncate">{log.notes}</p>
        )}
      </div>
      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(log.id)
          }}
          className="text-xs text-red-400 hover:text-red-600 transition-colors ml-2 shrink-0"
          aria-label="Delete this feeding log"
        >
          Delete
        </button>
      )}
    </div>
  )
}

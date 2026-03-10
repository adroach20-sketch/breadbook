import { useStarterNotifications, isInQuietHours } from '../../store/starterNotifications'
import { useNotifications } from '../../hooks/useNotifications'

interface ReminderSettingsProps {
  starterId: string
  starterName: string
}

/**
 * Notification settings UI for a specific starter.
 * Controls: enable/disable, quiet hours, snooze.
 */
export function ReminderSettings({ starterId, starterName }: ReminderSettingsProps) {
  const {
    quietHoursEnabled,
    quietStart,
    quietEnd,
    setQuietHours,
    disabledStarters,
    toggleStarterNotifications,
    snoozedUntil,
    snoozeStarter,
    clearSnooze,
  } = useStarterNotifications()

  const { requestPermission, notificationsSupported, permissionStatus } = useNotifications()

  const isEnabled = !disabledStarters.includes(starterId)
  const snoozedTime = snoozedUntil[starterId]
  const isSnoozed = snoozedTime ? Date.now() < snoozedTime : false
  const inQuietHours = isInQuietHours(quietHoursEnabled, quietStart, quietEnd)

  const handleRequestPermission = async () => {
    await requestPermission()
  }

  return (
    <div className="bg-steam rounded-xl border border-dough/50 p-4 space-y-4">
      <h3 className="font-heading text-sm font-semibold text-char">Reminders</h3>

      {/* Browser permission check */}
      {notificationsSupported && permissionStatus !== 'granted' && (
        <div className="bg-amber-50 rounded-lg p-3">
          <p className="text-sm text-amber-700 mb-2">
            Enable browser notifications to get feeding reminders.
          </p>
          <button
            onClick={handleRequestPermission}
            className="text-sm font-medium text-crust hover:text-crust/80 transition-colors"
          >
            Enable Notifications
          </button>
        </div>
      )}

      {!notificationsSupported && (
        <p className="text-sm text-ash">
          Your browser does not support notifications. Reminders will only show in-app.
        </p>
      )}

      {/* Per-starter toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-char">Reminders for {starterName}</span>
        <button
          onClick={() => toggleStarterNotifications(starterId)}
          className={
            'relative w-10 h-6 rounded-full transition-colors ' +
            (isEnabled ? 'bg-crust' : 'bg-dough')
          }
        >
          <span
            className={
              'absolute top-0.5 w-5 h-5 rounded-full bg-steam shadow transition-transform ' +
              (isEnabled ? 'left-4.5' : 'left-0.5')
            }
          />
        </button>
      </div>

      {/* Snooze */}
      {isEnabled && (
        <div>
          {isSnoozed ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-ash">
                Snoozed until {new Date(snoozedTime!).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
              <button
                onClick={() => clearSnooze(starterId)}
                className="text-sm text-crust font-medium hover:text-crust/80"
              >
                Cancel snooze
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <span className="text-sm text-ash">Snooze:</span>
              <button
                onClick={() => snoozeStarter(starterId, 60 * 60 * 1000)}
                className="text-sm text-crust font-medium hover:text-crust/80"
              >
                1hr
              </button>
              <button
                onClick={() => snoozeStarter(starterId, 2 * 60 * 60 * 1000)}
                className="text-sm text-crust font-medium hover:text-crust/80"
              >
                2hr
              </button>
              <button
                onClick={() => snoozeStarter(starterId, 24 * 60 * 60 * 1000)}
                className="text-sm text-crust font-medium hover:text-crust/80"
              >
                Tomorrow
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiet hours */}
      <div className="border-t border-dough pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-char">Quiet Hours</span>
          <button
            onClick={() => setQuietHours(!quietHoursEnabled, quietStart, quietEnd)}
            className={
              'relative w-10 h-6 rounded-full transition-colors ' +
              (quietHoursEnabled ? 'bg-crust' : 'bg-dough')
            }
          >
            <span
              className={
                'absolute top-0.5 w-5 h-5 rounded-full bg-steam shadow transition-transform ' +
                (quietHoursEnabled ? 'left-4.5' : 'left-0.5')
              }
            />
          </button>
        </div>

        {quietHoursEnabled && (
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={quietStart}
              onChange={(e) => setQuietHours(true, e.target.value, quietEnd)}
              className="rounded-lg border border-dough bg-steam px-2 py-1 text-sm text-char focus:outline-none focus:ring-2 focus:ring-wheat/50"
            />
            <span className="text-sm text-ash">to</span>
            <input
              type="time"
              value={quietEnd}
              onChange={(e) => setQuietHours(true, quietStart, e.target.value)}
              className="rounded-lg border border-dough bg-steam px-2 py-1 text-sm text-char focus:outline-none focus:ring-2 focus:ring-wheat/50"
            />
          </div>
        )}

        {inQuietHours && (
          <p className="text-xs text-ash mt-2">Currently in quiet hours. No notifications will be sent.</p>
        )}
      </div>
    </div>
  )
}

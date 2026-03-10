import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import type { SavedSchedule } from '../../data/types'
import { formatScheduleTime, CATEGORY_CONFIG } from '../../lib/schedule-engine'

interface ScheduleHistoryProps {
  onReuse: (schedule: SavedSchedule) => void
}

export function ScheduleHistory({ onReuse }: ScheduleHistoryProps) {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<SavedSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSchedules() {
      if (!user) return

      const { data, error } = await supabase
        .from('bake_schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setSchedules(data as SavedSchedule[])
      }
      setLoading(false)
    }
    fetchSchedules()
  }, [user])

  async function handleDelete(id: string) {
    setDeletingId(id)
    const { error } = await supabase
      .from('bake_schedules')
      .delete()
      .eq('id', id)

    if (!error) {
      setSchedules((prev) => prev.filter((s) => s.id !== id))
    }
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <h1 className="font-heading text-2xl font-bold text-char mb-6">
          My Schedules
        </h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-dough/50 rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-char">
          My Schedules
        </h1>
        <Link
          to="/schedule/new"
          className="bg-crust text-steam px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Plan a Bake
        </Link>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4" aria-hidden="true">📅</span>
          <p className="text-lg font-medium text-char mb-2">
            No schedules yet
          </p>
          <p className="text-ash mb-6 max-w-xs mx-auto">
            Plan your first bake and we'll figure out the timing for you — pick a recipe, tell us when you want to eat, and we'll handle the rest.
          </p>
          <Link
            to="/schedule/new"
            className="inline-block bg-crust text-steam px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Plan Your First Bake
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => {
            const stepCount = schedule.schedule_steps?.length ?? 0
            const categories = [...new Set(schedule.schedule_steps?.map((s) => s.category) ?? [])]

            return (
              <div
                key={schedule.id}
                className="bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-char truncate">
                      {schedule.recipe_title}
                    </h3>
                    <p className="text-sm text-ash">
                      {formatScheduleTime(schedule.target_eat_time)} &middot; {stepCount} steps
                    </p>
                  </div>
                </div>

                {/* Category dots */}
                <div className="flex items-center gap-2 mb-3">
                  {categories.map((cat) => {
                    const config = CATEGORY_CONFIG[cat]
                    return (
                      <span key={cat} className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
                        <span className="text-xs text-ash">{config.label}</span>
                      </span>
                    )
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReuse(schedule)}
                    className="flex-1 text-sm text-crust font-medium py-2 rounded-lg hover:bg-crust/5 transition-colors"
                  >
                    Re-use Settings
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    disabled={deletingId === schedule.id}
                    className="text-sm text-ash py-2 px-3 rounded-lg hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                    aria-label={`Delete schedule for ${schedule.recipe_title}`}
                  >
                    {deletingId === schedule.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

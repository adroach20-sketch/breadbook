import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { BakeLogCard } from './BakeLogCard'
import type { BakeLog } from '../../data/types'

export function JournalList() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<BakeLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      if (!user) return

      const { data, error } = await supabase
        .from('bake_logs')
        .select('*, recipes(title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setLogs(data as BakeLog[])
      }
      setLoading(false)
    }
    fetchLogs()
  }, [user])

  if (loading) {
    return (
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <h1 className="font-heading text-2xl font-bold text-char mb-6">My Bakes</h1>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-dough/50 rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold text-char mb-6">My Bakes</h1>

      {logs.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">📔</span>
          <p className="text-ash mb-4">No bakes logged yet.</p>
          <Link
            to="/recipes"
            className="text-crust font-medium hover:underline"
          >
            Browse recipes to get started
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {logs.map((log) => (
            <BakeLogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  )
}

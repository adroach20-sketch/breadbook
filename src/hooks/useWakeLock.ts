import { useState, useEffect, useCallback } from 'react'

export function useWakeLock() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)
  const [isSupported] = useState(() => 'wakeLock' in navigator)

  const request = useCallback(async () => {
    if (!isSupported) return

    try {
      const lock = await navigator.wakeLock.request('screen')
      setWakeLock(lock)

      lock.addEventListener('release', () => {
        setWakeLock(null)
      })
    } catch {
      // Wake lock request can fail (e.g., low battery, page not visible)
    }
  }, [isSupported])

  const release = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release()
      setWakeLock(null)
    }
  }, [wakeLock])

  // Re-acquire wake lock when tab becomes visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !wakeLock && isSupported) {
        request()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [wakeLock, isSupported, request])

  return { isActive: !!wakeLock, isSupported, request, release }
}

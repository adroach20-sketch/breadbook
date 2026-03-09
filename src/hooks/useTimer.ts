import { useState, useEffect, useCallback, useRef } from 'react'

interface TimerState {
  remainingSeconds: number
  isRunning: boolean
  isComplete: boolean
}

export function useTimer(totalMinutes: number | null) {
  const totalSeconds = (totalMinutes || 0) * 60
  const [state, setState] = useState<TimerState>({
    remainingSeconds: totalSeconds,
    isRunning: false,
    isComplete: false,
  })

  // Use a ref to track the target end time for accuracy across tab switches
  const endTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    if (!endTimeRef.current) return

    const now = Date.now()
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000))

    if (remaining <= 0) {
      clearTimer()
      endTimeRef.current = null
      setState({ remainingSeconds: 0, isRunning: false, isComplete: true })

      // Send browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('BreadBook Timer', {
          body: 'Time\'s up! Ready for the next step.',
          icon: '/breadbook-icon.svg',
        })
      }
    } else {
      setState((prev) => ({ ...prev, remainingSeconds: remaining }))
    }
  }, [clearTimer])

  const start = useCallback(() => {
    if (totalSeconds === 0) return

    // Request notification permission on first timer start
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    endTimeRef.current = Date.now() + state.remainingSeconds * 1000
    setState((prev) => ({ ...prev, isRunning: true, isComplete: false }))

    clearTimer()
    intervalRef.current = setInterval(tick, 1000)
  }, [totalSeconds, state.remainingSeconds, tick, clearTimer])

  const pause = useCallback(() => {
    clearTimer()
    endTimeRef.current = null
    setState((prev) => ({ ...prev, isRunning: false }))
  }, [clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    endTimeRef.current = null
    setState({
      remainingSeconds: totalSeconds,
      isRunning: false,
      isComplete: false,
    })
  }, [totalSeconds, clearTimer])

  // Re-sync when tab becomes visible (handles background tab drift)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && endTimeRef.current) {
        tick()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [tick])

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer])

  // Reset remaining when totalMinutes changes (new step)
  useEffect(() => {
    clearTimer()
    endTimeRef.current = null
    setState({
      remainingSeconds: totalSeconds,
      isRunning: false,
      isComplete: false,
    })
  }, [totalSeconds, clearTimer])

  return {
    remainingSeconds: state.remainingSeconds,
    isRunning: state.isRunning,
    isComplete: state.isComplete,
    start,
    pause,
    reset,
    hasTimer: totalSeconds > 0,
  }
}

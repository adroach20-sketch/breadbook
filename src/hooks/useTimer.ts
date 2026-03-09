import { useState, useEffect, useCallback, useRef } from 'react'

interface TimerState {
  remainingSeconds: number
  isRunning: boolean
  isComplete: boolean
}

/**
 * @param totalMinutes - timer duration in minutes
 * @param storageKey - optional localStorage key to persist timer across page refreshes
 */
export function useTimer(totalMinutes: number | null, storageKey?: string) {
  const totalSeconds = (totalMinutes || 0) * 60

  // Try to restore a running timer from localStorage
  const getInitialState = (): TimerState => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const { endTime, paused, pausedRemaining } = JSON.parse(saved)
          if (paused && typeof pausedRemaining === 'number') {
            // Timer was paused — restore remaining time
            return { remainingSeconds: pausedRemaining, isRunning: false, isComplete: false }
          }
          if (typeof endTime === 'number') {
            const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
            if (remaining <= 0) {
              localStorage.removeItem(storageKey)
              return { remainingSeconds: 0, isRunning: false, isComplete: true }
            }
            // Timer was running — will be restarted in the effect below
            return { remainingSeconds: remaining, isRunning: true, isComplete: false }
          }
        }
      } catch {
        localStorage.removeItem(storageKey)
      }
    }
    return { remainingSeconds: totalSeconds, isRunning: false, isComplete: false }
  }

  const [state, setState] = useState<TimerState>(getInitialState)
  const endTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const storageKeyRef = useRef(storageKey)
  storageKeyRef.current = storageKey

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const persistTimer = useCallback((data: { endTime?: number; paused?: boolean; pausedRemaining?: number } | null) => {
    if (!storageKeyRef.current) return
    if (data === null) {
      localStorage.removeItem(storageKeyRef.current)
    } else {
      localStorage.setItem(storageKeyRef.current, JSON.stringify(data))
    }
  }, [])

  const tick = useCallback(() => {
    if (!endTimeRef.current) return

    const now = Date.now()
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000))

    if (remaining <= 0) {
      clearTimer()
      endTimeRef.current = null
      persistTimer(null)
      setState({ remainingSeconds: 0, isRunning: false, isComplete: true })

      // Sound alert — three short beeps using Web Audio API
      try {
        const ctx = new AudioContext()
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.frequency.value = 880
          gain.gain.value = 0.3
          osc.start(ctx.currentTime + i * 0.25)
          osc.stop(ctx.currentTime + i * 0.25 + 0.15)
        }
      } catch { /* audio not available */ }

      // Vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200])
      }

      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('BreadBook Timer', {
          body: "Time's up! Ready for the next step.",
          icon: '/breadbook-icon.svg',
        })
      }
    } else {
      setState((prev) => ({ ...prev, remainingSeconds: remaining }))
    }
  }, [clearTimer, persistTimer])

  // Restore a running timer on mount (if we loaded isRunning: true from storage)
  useEffect(() => {
    if (state.isRunning && !intervalRef.current) {
      endTimeRef.current = Date.now() + state.remainingSeconds * 1000
      persistTimer({ endTime: endTimeRef.current })
      intervalRef.current = setInterval(tick, 1000)
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const start = useCallback(() => {
    if (totalSeconds === 0) return

    // Request notification permission once
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    endTimeRef.current = Date.now() + state.remainingSeconds * 1000
    persistTimer({ endTime: endTimeRef.current })
    setState((prev) => ({ ...prev, isRunning: true, isComplete: false }))

    clearTimer()
    intervalRef.current = setInterval(tick, 1000)
  }, [totalSeconds, state.remainingSeconds, tick, clearTimer, persistTimer])

  const pause = useCallback(() => {
    clearTimer()
    const remaining = endTimeRef.current
      ? Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
      : state.remainingSeconds
    endTimeRef.current = null
    persistTimer({ paused: true, pausedRemaining: remaining })
    setState((prev) => ({ ...prev, isRunning: false, remainingSeconds: remaining }))
  }, [clearTimer, persistTimer, state.remainingSeconds])

  const reset = useCallback(() => {
    clearTimer()
    endTimeRef.current = null
    persistTimer(null)
    setState({
      remainingSeconds: totalSeconds,
      isRunning: false,
      isComplete: false,
    })
  }, [totalSeconds, clearTimer, persistTimer])

  // Re-sync when tab becomes visible
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

  // Reset when totalMinutes changes (new step selected)
  useEffect(() => {
    clearTimer()
    endTimeRef.current = null
    // Don't persist null here — the new step may have its own saved state
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

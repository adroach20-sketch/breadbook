import { useEffect, useState } from 'react'
import { usePreferences } from '../store/preferences'

/**
 * Returns resolved CSS variable hex values for the current theme.
 * Useful for libraries like Recharts that need raw color strings
 * instead of CSS custom properties.
 */
export function useThemeColors() {
  const { themeMode } = usePreferences()
  const [colors, setColors] = useState(getColors)

  function getColors() {
    const style = getComputedStyle(document.documentElement)
    return {
      crust: style.getPropertyValue('--color-crust').trim(),
      crumb: style.getPropertyValue('--color-crumb').trim(),
      dough: style.getPropertyValue('--color-dough').trim(),
      steam: style.getPropertyValue('--color-steam').trim(),
      char: style.getPropertyValue('--color-char').trim(),
      ash: style.getPropertyValue('--color-ash').trim(),
      wheat: style.getPropertyValue('--color-wheat').trim(),
      ashMuted: style.getPropertyValue('--color-ash-muted').trim(),
    }
  }

  useEffect(() => {
    // Re-read after theme class change settles
    const timer = setTimeout(() => setColors(getColors()), 50)
    return () => clearTimeout(timer)
  }, [themeMode])

  return colors
}

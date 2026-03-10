import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'system' | 'light' | 'dark'

interface PreferencesState {
  showBakersPercent: boolean
  toggleBakersPercent: () => void
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
}

function applyDarkClass(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = mode === 'dark' || (mode === 'system' && prefersDark)
  document.documentElement.classList.toggle('dark', isDark)
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      showBakersPercent: false,
      toggleBakersPercent: () => set((state) => ({ showBakersPercent: !state.showBakersPercent })),
      themeMode: 'system' as ThemeMode,
      setThemeMode: (mode: ThemeMode) => {
        applyDarkClass(mode)
        set({ themeMode: mode })
      },
    }),
    {
      name: 'breadbook-preferences',
      onRehydrateStorage: () => (state) => {
        // Apply theme on page load after store rehydrates from localStorage
        if (state) applyDarkClass(state.themeMode)
      },
    }
  )
)

// Listen for system preference changes when in 'system' mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const { themeMode } = usePreferences.getState()
  if (themeMode === 'system') applyDarkClass('system')
})

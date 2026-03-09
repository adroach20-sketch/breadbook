import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PreferencesState {
  showBakersPercent: boolean
  toggleBakersPercent: () => void
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      showBakersPercent: false,
      toggleBakersPercent: () => set((state) => ({ showBakersPercent: !state.showBakersPercent })),
    }),
    { name: 'breadbook-preferences' }
  )
)

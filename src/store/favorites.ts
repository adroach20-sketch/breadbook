import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface SaveCountMap {
  [recipeId: string]: number
}

interface FavoritesState {
  // Set of recipe IDs the current user has saved
  savedRecipeIds: Set<string>
  // Save counts per recipe (all users)
  saveCounts: SaveCountMap
  // Loading state
  loaded: boolean

  // Actions
  loadUserFavorites: (userId: string) => Promise<void>
  loadSaveCounts: () => Promise<void>
  toggleFavorite: (userId: string, recipeId: string) => Promise<void>
  isFavorited: (recipeId: string) => boolean
  getSaveCount: (recipeId: string) => number
}

export const useFavorites = create<FavoritesState>()((set, get) => ({
  savedRecipeIds: new Set<string>(),
  saveCounts: {},
  loaded: false,

  loadUserFavorites: async (userId: string) => {
    const { data, error } = await supabase
      .from('recipe_saves')
      .select('recipe_id')
      .eq('user_id', userId)

    if (error) {
      console.warn('Failed to load favorites:', error.message)
      return
    }

    const ids = new Set<string>(data?.map((s) => s.recipe_id) ?? [])
    set({ savedRecipeIds: ids, loaded: true })
  },

  loadSaveCounts: async () => {
    // Query the view for aggregate save counts
    const { data, error } = await supabase
      .from('recipe_save_counts')
      .select('recipe_id, save_count')

    if (error) {
      // View might not exist yet — that is fine, just skip
      console.warn('Failed to load save counts:', error.message)
      return
    }

    const counts: SaveCountMap = {}
    for (const row of data ?? []) {
      counts[row.recipe_id] = Number(row.save_count)
    }
    set({ saveCounts: counts })
  },

  toggleFavorite: async (userId: string, recipeId: string) => {
    const { savedRecipeIds, saveCounts } = get()
    const wasSaved = savedRecipeIds.has(recipeId)

    // Optimistic update
    const nextIds = new Set(savedRecipeIds)
    const nextCounts = { ...saveCounts }
    if (wasSaved) {
      nextIds.delete(recipeId)
      nextCounts[recipeId] = Math.max(0, (nextCounts[recipeId] ?? 1) - 1)
    } else {
      nextIds.add(recipeId)
      nextCounts[recipeId] = (nextCounts[recipeId] ?? 0) + 1
    }
    set({ savedRecipeIds: nextIds, saveCounts: nextCounts })

    // Persist to Supabase
    if (wasSaved) {
      const { error } = await supabase
        .from('recipe_saves')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)

      if (error) {
        console.error('Failed to unsave recipe:', error.message)
        // Revert optimistic update
        set({ savedRecipeIds, saveCounts })
      }
    } else {
      const { error } = await supabase
        .from('recipe_saves')
        .insert({ user_id: userId, recipe_id: recipeId })

      if (error) {
        console.error('Failed to save recipe:', error.message)
        // Revert optimistic update
        set({ savedRecipeIds, saveCounts })
      }
    }
  },

  isFavorited: (recipeId: string) => {
    return get().savedRecipeIds.has(recipeId)
  },

  getSaveCount: (recipeId: string) => {
    return get().saveCounts[recipeId] ?? 0
  },
}))

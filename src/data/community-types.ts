// Community feature types for Recipe Sharing, Bake Feed, and Baker Profiles
import type { RecipeCategory, FermentType } from './types'

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  starter_name: string | null
  is_public: boolean
  created_at: string
}

export interface RecipeLike {
  id: string
  user_id: string
  recipe_id: string
  created_at: string
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface FeedPost {
  id: string
  user_id: string
  bake_log_id: string
  caption: string | null
  created_at: string
  // Joined data
  profiles?: Pick<Profile, 'username' | 'avatar_url'>
  bake_logs?: {
    rating: number
    photo_urls: string[]
    crumb_notes: string | null
    crust_notes: string | null
    flavor_notes: string | null
    what_went_well: string | null
    recipes?: { title: string; id: string }
  }
  comment_count?: number
  like_count?: number
}

export interface FeedComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  // Joined
  profiles?: Pick<Profile, 'username' | 'avatar_url'>
}

export interface BakerProfileData {
  profile: Profile
  bake_count: number
  bakes_this_month: number
  favorite_recipe: { title: string; count: number } | null
  avg_rating: number | null
  bake_streak: number
  public_recipes: Array<{
    id: string
    title: string
    category: RecipeCategory
    hydration_pct: number
    ferment_type: FermentType
    like_count: number
  }>
  recent_posts: FeedPost[]
  follower_count: number
  following_count: number
  is_following: boolean
}

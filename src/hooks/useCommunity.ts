import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type {
  FeedPost,
  FeedComment,
  BakerProfileData,
  Profile,
} from '../data/community-types'

const FEED_PAGE_SIZE = 20

const FEED_SELECT =
  '*, profiles!feed_posts_user_id_fkey(username, avatar_url), bake_logs!feed_posts_bake_log_id_fkey(rating, photo_urls, crumb_notes, crust_notes, flavor_notes, what_went_well, recipes(title, id))'

export function useFeed(mode: 'following' | 'discover') {
  const { user } = useAuth()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = useCallback(
    async (offset = 0) => {
      if (!user) return

      if (mode === 'following') {
        const { data: followData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id)

        const followedIds = followData?.map((f) => f.following_id) || []
        if (followedIds.length === 0) {
          setPosts([])
          setLoading(false)
          setHasMore(false)
          return
        }

        const { data, error } = await supabase
          .from('feed_posts')
          .select(FEED_SELECT)
          .in('user_id', followedIds)
          .order('created_at', { ascending: false })
          .range(offset, offset + FEED_PAGE_SIZE - 1)

        if (error) {
          console.warn('Failed to load feed:', error.message)
          setLoading(false)
          return
        }

        const newPosts = (data || []) as FeedPost[]
        setPosts(offset === 0 ? newPosts : (prev) => [...prev, ...newPosts])
        setHasMore(newPosts.length === FEED_PAGE_SIZE)
        setLoading(false)
      } else {
        const { data, error } = await supabase
          .from('feed_posts')
          .select(FEED_SELECT)
          .order('created_at', { ascending: false })
          .range(offset, offset + FEED_PAGE_SIZE - 1)

        if (error) {
          console.warn('Failed to load feed:', error.message)
          setLoading(false)
          return
        }

        const newPosts = (data || []) as FeedPost[]
        setPosts(offset === 0 ? newPosts : (prev) => [...prev, ...newPosts])
        setHasMore(newPosts.length === FEED_PAGE_SIZE)
        setLoading(false)
      }
    },
    [user, mode]
  )

  useEffect(() => {
    setLoading(true)
    setPosts([])
    fetchPosts(0)
  }, [fetchPosts])

  const loadMore = () => fetchPosts(posts.length)
  return { posts, loading, hasMore, loadMore, refetch: () => fetchPosts(0) }
}

export function useComments(postId: string) {
  const { user } = useAuth()
  const [comments, setComments] = useState<FeedComment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('feed_comments')
      .select('*, profiles!feed_comments_user_id_fkey(username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (!error && data) setComments(data as FeedComment[])
    setLoading(false)
  }, [postId])

  useEffect(() => { fetchComments() }, [fetchComments])

  const addComment = async (content: string) => {
    if (!user || !content.trim()) return false
    const { error } = await supabase.from('feed_comments').insert({
      post_id: postId, user_id: user.id, content: content.trim(),
    })
    if (error) { console.error('Failed to add comment:', error.message); return false }
    await fetchComments()
    return true
  }

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase.from('feed_comments').delete().eq('id', commentId)
    if (!error) setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  return { comments, loading, addComment, deleteComment }
}

export function useRecipeLike(recipeId: string) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function check() {
      const { count } = await supabase
        .from('recipe_likes')
        .select('*', { count: 'exact', head: true })
        .eq('recipe_id', recipeId)
      setLikeCount(count || 0)
      if (user) {
        const { data } = await supabase
          .from('recipe_likes').select('id')
          .eq('recipe_id', recipeId).eq('user_id', user.id).maybeSingle()
        setLiked(!!data)
      }
      setLoading(false)
    }
    check()
  }, [recipeId, user])

  const toggleLike = async () => {
    if (!user) return
    const wasLiked = liked
    setLiked(!wasLiked)
    setLikeCount((prev) => prev + (wasLiked ? -1 : 1))
    if (wasLiked) {
      const { error } = await supabase.from('recipe_likes').delete()
        .eq('recipe_id', recipeId).eq('user_id', user.id)
      if (error) { setLiked(true); setLikeCount((prev) => prev + 1) }
    } else {
      const { error } = await supabase.from('recipe_likes').insert({
        user_id: user.id, recipe_id: recipeId,
      })
      if (error) { setLiked(false); setLikeCount((prev) => prev - 1) }
    }
  }

  return { liked, likeCount, toggleLike, loading }
}

export function useFollow(targetUserId: string) {
  const { user } = useAuth()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function check() {
      if (!user || user.id === targetUserId) { setLoading(false); return }
      const { data } = await supabase.from('follows').select('id')
        .eq('follower_id', user.id).eq('following_id', targetUserId).maybeSingle()
      setFollowing(!!data)
      setLoading(false)
    }
    check()
  }, [user, targetUserId])

  const toggleFollow = async () => {
    if (!user || user.id === targetUserId) return
    const wasFollowing = following
    setFollowing(!wasFollowing)
    if (wasFollowing) {
      const { error } = await supabase.from('follows').delete()
        .eq('follower_id', user.id).eq('following_id', targetUserId)
      if (error) setFollowing(true)
    } else {
      const { error } = await supabase.from('follows').insert({
        follower_id: user.id, following_id: targetUserId,
      })
      if (error) setFollowing(false)
    }
  }

  return { following, toggleFollow, loading }
}

export function useBakerProfile(username: string) {
  const { user } = useAuth()
  const [data, setData] = useState<BakerProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: profile, error } = await supabase
        .from('profiles').select('*').eq('username', username).single()
      if (error || !profile) { setNotFound(true); setLoading(false); return }

      const p = profile as Profile
      if (!p.is_public && user?.id !== p.id) { setNotFound(true); setLoading(false); return }

      const { count: bakeCount } = await supabase
        .from('bake_logs').select('*', { count: 'exact', head: true }).eq('user_id', p.id)

      const monthStart = new Date()
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)
      const { count: bakesThisMonth } = await supabase
        .from('bake_logs').select('*', { count: 'exact', head: true })
        .eq('user_id', p.id).gte('created_at', monthStart.toISOString())

      const { data: recipes } = await supabase
        .from('recipes').select('id, title, category, hydration_pct, ferment_type')
        .eq('user_id', p.id).eq('is_public', true).order('created_at', { ascending: false })

      const { data: posts } = await supabase
        .from('feed_posts').select(FEED_SELECT)
        .eq('user_id', p.id).order('created_at', { ascending: false }).limit(6)

      const { count: followerCount } = await supabase
        .from('follows').select('*', { count: 'exact', head: true }).eq('following_id', p.id)
      const { count: followingCount } = await supabase
        .from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', p.id)

      let isFollowing = false
      if (user && user.id !== p.id) {
        const { data: followRow } = await supabase.from('follows').select('id')
          .eq('follower_id', user.id).eq('following_id', p.id).maybeSingle()
        isFollowing = !!followRow
      }

      setData({
        profile: p,
        bake_count: bakeCount || 0,
        bakes_this_month: bakesThisMonth || 0,
        public_recipes: (recipes || []).map((r) => ({ ...r, like_count: 0 })),
        recent_posts: (posts || []) as FeedPost[],
        follower_count: followerCount || 0,
        following_count: followingCount || 0,
        is_following: isFollowing,
      })
      setLoading(false)
    }
    load()
  }, [username, user])

  return { data, loading, notFound }
}

export function useOwnProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      const { data, error } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      if (!error && data) setProfile(data as Profile)
      setLoading(false)
    }
    load()
  }, [user])

  const updateProfile = async (updates: Partial<Profile>): Promise<true | string> => {
    if (!user) return 'Not logged in.'
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (error) {
      console.error('Failed to update profile:', error.message, error.code, error.details)
      if (error.code === '23505') return 'That username is already taken. Try another one.'
      return error.message || 'Something went wrong. Please try again.'
    }
    setProfile((prev) => (prev ? { ...prev, ...updates } : null))
    return true
  }

  return { profile, loading, updateProfile }
}

export function useShareToFeed() {
  const { user } = useAuth()
  const [sharing, setSharing] = useState(false)

  const sharePost = async (bakeLogId: string, caption: string) => {
    if (!user) return null
    setSharing(true)
    await supabase.from('bake_logs').update({ is_shared: true }).eq('id', bakeLogId)
    const { data, error } = await supabase.from('feed_posts').insert({
      user_id: user.id, bake_log_id: bakeLogId, caption: caption || null,
    }).select('id').single()
    setSharing(false)
    if (error) { console.error('Failed to share:', error.message); return null }
    return data?.id || null
  }

  const unsharePost = async (postId: string, bakeLogId: string) => {
    if (!user) return false
    setSharing(true)
    await supabase.from('feed_posts').delete().eq('id', postId)
    await supabase.from('bake_logs').update({ is_shared: false }).eq('id', bakeLogId)
    setSharing(false)
    return true
  }

  return { sharePost, unsharePost, sharing }
}

export function useCommunityRecipes(filters: {
  category?: string
  hydrationMin?: number
  hydrationMax?: number
  search?: string
}) {
  const [recipes, setRecipes] = useState<
    Array<{
      id: string
      title: string
      description: string
      category: string
      ferment_type: string
      hydration_pct: number
      yield_amount: string
      tags: string[]
      is_breadbook_original: boolean
      source_credit: string | null
      user_id: string
      created_at: string
      profiles?: { username: string; avatar_url: string | null }
    }>
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase
        .from('recipes')
        .select('*, profiles!recipes_user_id_fkey(username, avatar_url)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }
      if (filters.hydrationMin) query = query.gte('hydration_pct', filters.hydrationMin)
      if (filters.hydrationMax) query = query.lte('hydration_pct', filters.hydrationMax)
      if (filters.search) query = query.ilike('title', '%' + filters.search + '%')

      const { data, error } = await query
      if (error) console.warn('Failed to load community recipes:', error.message)
      else setRecipes(data || [])
      setLoading(false)
    }
    load()
  }, [filters.category, filters.hydrationMin, filters.hydrationMax, filters.search])

  return { recipes, loading }
}

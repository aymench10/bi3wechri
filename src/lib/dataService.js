/**
 * Data Service - Centralized data fetching with error handling and retries
 * Ensures consistent data retrieval across the application
 */

import { supabase } from './supabase'

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
  backoffMultiplier: 2
}

/**
 * Retry wrapper for failed requests
 */
const withRetry = async (fn, context = 'operation') => {
  let lastError
  let delay = RETRY_CONFIG.initialDelay

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      console.warn(`${context} failed (attempt ${attempt}/${RETRY_CONFIG.maxRetries}):`, error.message)

      if (attempt < RETRY_CONFIG.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay))
        delay = Math.min(delay * RETRY_CONFIG.backoffMultiplier, RETRY_CONFIG.maxDelay)
      }
    }
  }

  throw lastError
}

/**
 * Fetch all ads with error handling and retry logic
 */
export const fetchAllAds = async (options = {}) => {
  const {
    limit = null,
    offset = 0,
    orderBy = 'created_at',
    ascending = false,
    filters = {}
  } = options

  return withRetry(async () => {
    let query = supabase
      .from('ads')
      .select('*, profiles(full_name, email)', { count: 'exact' })

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.location) {
      query = query.eq('location', filters.location)
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }

    // Apply ordering
    query = query.order(orderBy, { ascending })

    // Apply pagination
    if (limit) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data || [],
      count: count || 0,
      success: true
    }
  }, 'Fetch all ads')
}

/**
 * Fetch single ad by ID with related data
 */
export const fetchAdById = async (adId) => {
  return withRetry(async () => {
    if (!adId) throw new Error('Ad ID is required')

    const { data: adData, error: adError } = await supabase
      .from('ads')
      .select('*')
      .eq('id', adId)
      .single()

    if (adError) throw adError
    if (!adData) throw new Error('Ad not found')

    // Fetch seller profile
    const { data: sellerData, error: sellerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adData.user_id)
      .single()

    if (sellerError && sellerError.code !== 'PGRST116') {
      console.warn('Could not fetch seller profile:', sellerError)
    }

    return {
      ad: adData,
      seller: sellerData || null,
      success: true
    }
  }, `Fetch ad ${adId}`)
}

/**
 * Fetch user's ads
 */
export const fetchUserAds = async (userId, options = {}) => {
  const { status = null, limit = null, offset = 0 } = options

  return withRetry(async () => {
    if (!userId) throw new Error('User ID is required')

    let query = supabase
      .from('ads')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)

    if (status) {
      query = query.eq('status', status)
    }

    query = query.order('created_at', { ascending: false })

    if (limit) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data || [],
      count: count || 0,
      success: true
    }
  }, `Fetch user ads for ${userId}`)
}

/**
 * Fetch similar ads
 */
export const fetchSimilarAds = async (currentAdId, category, location, limit = 4) => {
  return withRetry(async () => {
    if (!currentAdId) throw new Error('Current ad ID is required')

    // First, try to fetch ads with same category
    let query = supabase
      .from('ads')
      .select('*')
      .eq('status', 'active')
      .neq('id', currentAdId)
      .limit(limit)

    if (category) {
      query = query.eq('category', category)
    }

    const { data: categoryAds, error: categoryError } = await query.order('created_at', { ascending: false })

    if (categoryError) throw categoryError

    let allAds = categoryAds || []

    // If not enough ads, fetch by location
    if (allAds.length < limit && location) {
      const { data: locationAds, error: locationError } = await supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .eq('location', location)
        .neq('id', currentAdId)
        .limit(limit - allAds.length)
        .order('created_at', { ascending: false })

      if (!locationError && locationAds) {
        // Combine and remove duplicates
        allAds = [...allAds, ...locationAds]
        allAds = allAds.filter((ad, index, self) =>
          index === self.findIndex((a) => a.id === ad.id)
        )
      }
    }

    return {
      data: allAds.slice(0, limit),
      success: true
    }
  }, `Fetch similar ads for ${currentAdId}`)
}

/**
 * Fetch all users/profiles
 */
export const fetchAllUsers = async (options = {}) => {
  const { limit = null, offset = 0 } = options

  return withRetry(async () => {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data || [],
      count: count || 0,
      success: true
    }
  }, 'Fetch all users')
}

/**
 * Fetch user profile by ID
 */
export const fetchUserProfile = async (userId) => {
  return withRetry(async () => {
    if (!userId) throw new Error('User ID is required')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      return { data: null, success: true }
    }

    if (error) throw error

    return {
      data: data || null,
      success: true
    }
  }, `Fetch user profile ${userId}`)
}

/**
 * Update ad status
 */
export const updateAdStatus = async (adId, status) => {
  return withRetry(async () => {
    if (!adId || !status) throw new Error('Ad ID and status are required')

    const { data, error } = await supabase
      .from('ads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', adId)
      .select()
      .single()

    if (error) throw error

    return {
      data: data,
      success: true
    }
  }, `Update ad ${adId} status to ${status}`)
}

/**
 * Delete ad
 */
export const deleteAd = async (adId) => {
  return withRetry(async () => {
    if (!adId) throw new Error('Ad ID is required')

    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', adId)

    if (error) throw error

    return { success: true }
  }, `Delete ad ${adId}`)
}

/**
 * Update user role
 */
export const updateUserRole = async (userId, role) => {
  return withRetry(async () => {
    if (!userId || !role) throw new Error('User ID and role are required')

    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return {
      data: data,
      success: true
    }
  }, `Update user ${userId} role to ${role}`)
}

/**
 * Fetch admin dashboard stats
 */
export const fetchAdminStats = async () => {
  return withRetry(async () => {
    // Fetch all ads
    const { data: adsData, error: adsError } = await supabase
      .from('ads')
      .select('*', { count: 'exact' })

    if (adsError) throw adsError

    // Fetch all users
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })

    if (usersError) throw usersError

    // Calculate stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats = {
      totalAds: adsData?.length || 0,
      pendingAds: adsData?.filter(ad => ad.status === 'pending').length || 0,
      activeAds: adsData?.filter(ad => ad.status === 'active').length || 0,
      rejectedAds: adsData?.filter(ad => ad.status === 'rejected').length || 0,
      totalUsers: usersData?.length || 0,
      todayAds: adsData?.filter(ad => new Date(ad.created_at) >= today).length || 0
    }

    return {
      stats: stats,
      ads: adsData || [],
      users: usersData || [],
      success: true
    }
  }, 'Fetch admin stats')
}

/**
 * Search ads
 */
export const searchAds = async (query, options = {}) => {
  const { limit = 20, offset = 0 } = options

  return withRetry(async () => {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required')
    }

    const searchTerm = query.toLowerCase()

    // Fetch all ads and filter client-side (Supabase free tier limitation)
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Filter by search term
    const filtered = (data || []).filter(ad =>
      ad.title.toLowerCase().includes(searchTerm) ||
      ad.description.toLowerCase().includes(searchTerm) ||
      ad.category.toLowerCase().includes(searchTerm)
    )

    // Apply pagination
    const paginated = filtered.slice(offset, offset + limit)

    return {
      data: paginated,
      total: filtered.length,
      success: true
    }
  }, `Search ads for "${query}"`)
}

/**
 * Validate data consistency
 */
export const validateDataConsistency = async () => {
  try {
    // Check if ads table has valid data
    const { data: ads, error: adsError } = await supabase
      .from('ads')
      .select('id, user_id, status, created_at')
      .limit(1)

    if (adsError) throw adsError

    // Check if profiles table has valid data
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, created_at')
      .limit(1)

    if (profilesError) throw profilesError

    return {
      adsTableValid: !!ads,
      profilesTableValid: !!profiles,
      success: true
    }
  } catch (error) {
    console.error('Data consistency check failed:', error)
    return {
      adsTableValid: false,
      profilesTableValid: false,
      success: false,
      error: error.message
    }
  }
}

export default {
  fetchAllAds,
  fetchAdById,
  fetchUserAds,
  fetchSimilarAds,
  fetchAllUsers,
  fetchUserProfile,
  updateAdStatus,
  deleteAd,
  updateUserRole,
  fetchAdminStats,
  searchAds,
  validateDataConsistency
}

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth and listen for session changes
  useEffect(() => {
    let mounted = true

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError

        if (mounted) {
          setUser(session?.user ?? null)
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setLoading(false)
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth state changes (session persistence)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    })

    // Set a timeout to ensure loading is never stuck
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        setLoading(false)
      }
    }, 5000)

    return () => {
      mounted = false
      subscription?.unsubscribe()
      clearTimeout(loadingTimeout)
    }
  }, [])

  // Fetch user profile from profiles table
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Profile doesn't exist yet, which is fine for new users
        if (error.code === 'PGRST116') {
          console.log('Profile not found, will be created on first update')
          setProfile(null)
        } else {
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signUp = async (email, password, fullName, phone) => {
    try {
      setError(null)
      
      // Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      })

      if (signUpError) throw signUpError

      // Create profile in profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              phone: phone,
              email: email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.error('Error creating profile:', profileError)
          // Don't throw - profile creation failure shouldn't block signup
        }
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err.message || 'Sign up failed'
      setError(errorMessage)
      return { data: null, error: err }
    }
  }

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null)
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      return { data, error: null }
    } catch (err) {
      const errorMessage = err.message || 'Sign in failed'
      setError(errorMessage)
      return { data: null, error: err }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setError(null)
      
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) throw signOutError

      setUser(null)
      setProfile(null)
      return { error: null }
    } catch (err) {
      const errorMessage = err.message || 'Sign out failed'
      setError(errorMessage)
      return { error: err }
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setError(null)

      if (!user) throw new Error('No user logged in')

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) throw updateError

      setProfile(data)
      return { data, error: null }
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed'
      setError(errorMessage)
      return { data: null, error: err }
    }
  }

  // Update auth user email
  const updateEmail = async (newEmail) => {
    try {
      setError(null)

      const { data, error: updateError } = await supabase.auth.updateUser({
        email: newEmail
      })

      if (updateError) throw updateError

      return { data, error: null }
    } catch (err) {
      const errorMessage = err.message || 'Email update failed'
      setError(errorMessage)
      return { data: null, error: err }
    }
  }

  // Update auth user password
  const updatePassword = async (newPassword) => {
    try {
      setError(null)

      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      return { data, error: null }
    } catch (err) {
      const errorMessage = err.message || 'Password update failed'
      setError(errorMessage)
      return { data: null, error: err }
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateEmail,
    updatePassword,
    isAdmin: profile?.role === 'admin',
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

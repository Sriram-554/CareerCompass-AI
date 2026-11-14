import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { clearAllLocalUserData } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    let mounted = true
    let previousUserId = null

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const nextUser = data.session?.user ?? null
      previousUserId = nextUser?.id || null
      setUser(nextUser)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null
      const nextId = nextUser?.id || null

      // Clear local assessment/progress when logging out or switching accounts
      if (
        event === 'SIGNED_OUT' ||
        (previousUserId && nextId && previousUserId !== nextId)
      ) {
        clearAllLocalUserData()
      }

      previousUserId = nextId
      setUser(nextUser)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isConfigured: isSupabaseConfigured,
      async signUp(email, password) {
        if (!supabase) throw new Error('Supabase is not configured')
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        return data
      },
      async signIn(email, password) {
        if (!supabase) throw new Error('Supabase is not configured')
        // Avoid leaking previous guest/local profile into the new session
        clearAllLocalUserData()
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        return data
      },
      async signOut() {
        if (!supabase) return
        const { error } = await supabase.auth.signOut()
        clearAllLocalUserData()
        if (error) throw error
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

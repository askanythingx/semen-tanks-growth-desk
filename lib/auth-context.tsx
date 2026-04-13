'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types'
import type { Session } from '@supabase/supabase-js'

interface AuthCtx {
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthCtx>({ session: null, profile: null, loading: true, signOut: async () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('user_profiles').select('*').eq('id', userId).single()
    setProfile(data as UserProfile)
    setLoading(false)
  }

  // Route guard
  useEffect(() => {
    if (loading) return
    const isLogin = pathname === '/login'
    if (!session && !isLogin) { router.replace('/login'); return }
    if (session && profile && !isLogin) {
      // Check permission for current route
      if (pathname.startsWith('/sprints') && !profile.can_see_sprints && profile.role !== 'admin') {
        router.replace('/')
      }
      if (pathname.startsWith('/questionnaires') && !profile.can_see_surveys && profile.role !== 'admin') {
        router.replace('/')
      }
      if (pathname.startsWith('/admin') && profile.role !== 'admin') {
        router.replace('/')
      }
    }
  }, [loading, session, profile, pathname, router])

  async function signOut() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return <Ctx.Provider value={{ session, profile, loading, signOut }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)

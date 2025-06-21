"use client"

import { useState, useEffect } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { AuthService } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const session = await AuthService.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (fullName: string, contactNumber: string, password: string) => {
    const { user: newUser, session: newSession } = await AuthService.signUp(fullName, contactNumber, password)
    setUser(newUser)
    setSession(newSession)
  }

  const signIn = async (contactNumber: string, password: string) => {
    const { user: signedInUser, session: newSession } = await AuthService.signIn(contactNumber, password)
    setUser(signedInUser)
    setSession(newSession)
  }

  const signOut = async () => {
    await AuthService.signOut()
    setUser(null)
    setSession(null)
  }

  return { user, session, loading, signUp, signIn, signOut }
}

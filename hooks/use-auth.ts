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
    return await AuthService.signUpWithPhone(fullName, contactNumber, password)
  }

  const signIn = async (contactNumber: string) => {
    return await AuthService.signInWithPhone(contactNumber)
  }

  const verifyOtp = async (phone: string, token: string, type: "sms" | "phone_change" = "sms") => {
    const { user: verifiedUser, session: newSession } = await AuthService.verifyOtp(phone, token, type)
    setUser(verifiedUser)
    setSession(newSession)
    return { user: verifiedUser, session: newSession }
  }

  const signOut = async () => {
    await AuthService.signOut()
    setUser(null)
    setSession(null)
  }

  return { user, session, loading, signUp, signIn, verifyOtp, signOut }
}

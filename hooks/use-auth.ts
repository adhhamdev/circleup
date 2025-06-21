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

      // Create user record in database after email confirmation
      if (event === "SIGNED_IN" && session?.user && session.user.email_confirmed_at) {
        const { error } = await supabase.from("users").upsert({
          id: session.user.id,
          full_name: session.user.user_metadata?.full_name || "",
          email: session.user.email || "",
          password_hash: "supabase_managed",
        })

        if (error) console.error("Error creating user record:", error)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (fullName: string, email: string, password: string) => {
    return await AuthService.signUpWithEmail(fullName, email, password)
  }

  const signIn = async (email: string, password: string) => {
    const { user: signedInUser, session: newSession } = await AuthService.signInWithEmail(email, password)
    setUser(signedInUser)
    setSession(newSession)
    return { user: signedInUser, session: newSession }
  }

  const resendConfirmation = async (email: string) => {
    return await AuthService.resendConfirmation(email)
  }

  const signOut = async () => {
    await AuthService.signOut()
    setUser(null)
    setSession(null)
  }

  return { user, session, loading, signUp, signIn, resendConfirmation, signOut }
}

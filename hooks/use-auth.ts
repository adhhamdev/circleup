"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import type { User } from "@supabase/supabase-js"
import { AuthService } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (fullName: string, contactNumber: string, password: string) => Promise<void>
  signIn: (contactNumber: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    AuthService.getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false))

    // Listen for auth changes
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(setUser)

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (fullName: string, contactNumber: string, password: string) => {
    const { user } = await AuthService.signUp(fullName, contactNumber, password)
    setUser(user)
  }

  const signIn = async (contactNumber: string, password: string) => {
    const { user } = await AuthService.signIn(contactNumber, password)
    setUser(user)
  }

  const signOut = async () => {
    await AuthService.signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

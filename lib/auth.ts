import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface AuthUser {
  id: string
  email?: string
  phone?: string
  user_metadata: {
    full_name?: string
    contact_number?: string
  }
}

export class AuthService {
  static async signUp(fullName: string, contactNumber: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        phone: contactNumber,
        password,
        options: {
          data: {
            full_name: fullName,
            contact_number: contactNumber,
          },
        },
      })

      if (error) throw error

      // Also create user record in our users table
      if (data.user) {
        const { error: dbError } = await supabase.from("users").insert({
          id: data.user.id,
          full_name: fullName,
          contact_number: contactNumber,
          password_hash: "supabase_managed",
        })

        if (dbError) console.error("Error creating user record:", dbError)
      }

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  static async signIn(contactNumber: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: contactNumber,
        password,
      })

      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null)
    })
  }
}

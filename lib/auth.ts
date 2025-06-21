import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export class AuthService {
  static async signUpWithEmail(fullName: string, email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      // Note: User record in public.users table will be created automatically
      // by the database trigger when the auth user is created

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  static async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  static async resendConfirmation(email: string) {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error) {
      console.error("Resend confirmation error:", error)
      throw error
    }
  }

  static async deleteAccount() {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      // Delete the user (this will trigger cascade deletion)
      const { error } = await supabase.rpc("delete_user_account")

      if (error) throw error

      // Sign out after deletion
      await this.signOut()
    } catch (error) {
      console.error("Error deleting account:", error)
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

  static async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  }
}

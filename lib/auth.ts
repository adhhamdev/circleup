import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export class AuthService {
  static async signUpWithPhone(fullName: string, contactNumber: string, password: string) {
    try {
      // First, sign up with phone (this will send OTP)
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

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  static async verifyOtp(phone: string, token: string, type: "sms" | "phone_change" = "sms") {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type,
      })

      if (error) throw error

      // Create user record in our users table after successful verification
      if (data.user && data.user.user_metadata) {
        const { error: dbError } = await supabase.from("users").upsert({
          id: data.user.id,
          full_name: data.user.user_metadata.full_name,
          contact_number: data.user.user_metadata.contact_number,
          password_hash: "supabase_managed",
        })

        if (dbError) console.error("Error creating user record:", dbError)
      }

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error("OTP verification error:", error)
      throw error
    }
  }

  static async signInWithPhone(contactNumber: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: contactNumber,
      })

      if (error) throw error
      return data
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

  static async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  }
}

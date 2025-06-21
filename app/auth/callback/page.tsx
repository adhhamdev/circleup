"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/login?error=verification_failed")
          return
        }

        if (data.session) {
          // User is authenticated, redirect to dashboard
          router.push("/dashboard")
        } else {
          // No session, redirect to login
          router.push("/login")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        router.push("/login?error=unexpected_error")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen rosca-bg flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ED321] mx-auto mb-4"></div>
        <p>Verifying your email...</p>
      </div>
    </div>
  )
}

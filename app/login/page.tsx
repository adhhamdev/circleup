"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const { signIn, resendConfirmation } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResendOption, setShowResendOption] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setShowResendOption(false)

    try {
      const { user } = await signIn(formData.email, formData.password)

      // Check if email is confirmed
      if (user && !user.email_confirmed_at) {
        setError("Please verify your email address before logging in.")
        setShowResendOption(true)
        return
      }

      router.push("/dashboard")
    } catch (err: any) {
      if (err.message.includes("Email not confirmed")) {
        setError("Please verify your email address before logging in.")
        setShowResendOption(true)
      } else if (err.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.")
      } else {
        setError(err.message || "Login failed")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    setError("")

    try {
      await resendConfirmation(formData.email)
      setError("Verification email sent! Please check your inbox.")
      setShowResendOption(false)
    } catch (err: any) {
      setError(err.message || "Failed to resend email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen rosca-bg text-white p-6">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <ChevronLeft className="w-6 h-6" />
          </Link>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-transparent border-2 border-gray-600 rounded-2xl py-4 px-4 text-white placeholder-gray-500 focus:border-[#7ED321]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-transparent border-2 border-gray-600 rounded-2xl py-4 px-4 text-white placeholder-gray-500 focus:border-[#7ED321]"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl mt-8"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-red-400">{error}</p>
                  {showResendOption && (
                    <button
                      onClick={handleResendEmail}
                      disabled={isLoading}
                      className="text-[#7ED321] font-semibold hover:underline mt-2"
                    >
                      {isLoading ? "Sending..." : "Resend verification email"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <span className="text-gray-400">{"Don't have an account? "}</span>
            <Link href="/register" className="rosca-green-text font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

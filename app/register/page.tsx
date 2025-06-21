"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Mail, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [step, setStep] = useState<"register" | "verify">("register")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const { signUp, resendConfirmation } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signUp(formData.fullName, formData.email, formData.password)
      setStep("verify")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    setError("")

    try {
      await resendConfirmation(formData.email)
      // Show success message or update UI
    } catch (err: any) {
      setError(err.message || "Failed to resend email")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "verify") {
    return (
      <div className="min-h-screen rosca-bg text-white p-6">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-8">
            <button onClick={() => setStep("register")}>
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#7ED321] rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-10 h-10 text-black" />
              </div>
              <h1 className="text-3xl font-bold">Check Your Email</h1>
              <p className="text-gray-400">
                We've sent a verification link to <span className="text-white font-semibold">{formData.email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1A2E22] rounded-2xl p-4 border border-[#7ED321]/20">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-white mb-1">Next Steps:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Check your email inbox</li>
                      <li>Click the verification link</li>
                      <li>You'll be redirected to login</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-400">
                <p>Didn't receive the email? Check your spam folder or</p>
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="rosca-green-text font-semibold hover:underline"
                >
                  {isLoading ? "Sending..." : "resend verification email"}
                </button>
              </div>
            </div>

            {error && <div className="text-red-400 text-center text-sm">{error}</div>}

            <div className="text-center">
              <Link href="/login" className="rosca-green-text font-semibold">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold">Get Started</h1>
            <p className="text-gray-400">Create an account to join your ROSCA</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-transparent border-2 border-gray-600 rounded-2xl py-4 px-4 text-white placeholder-gray-500 focus:border-[#7ED321]"
                required
              />
            </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-transparent border-2 border-gray-600 rounded-2xl py-4 px-4 text-white placeholder-gray-500 focus:border-[#7ED321]"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl mt-8"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {error && <div className="text-red-400 text-center text-sm mt-4">{error}</div>}

          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link href="/login" className="rosca-green-text font-semibold">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

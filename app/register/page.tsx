"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [step, setStep] = useState<"register" | "verify">("register")
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    password: "",
    otp: "",
  })

  const { signUp, verifyOtp } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signUp(formData.fullName, formData.contactNumber, formData.password)
      setStep("verify")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await verifyOtp(formData.contactNumber, formData.otp)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "OTP verification failed")
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
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Verify Your Phone</h1>
              <p className="text-gray-400">Enter the 6-digit code sent to {formData.contactNumber}</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-300">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="bg-transparent border-2 border-gray-600 rounded-2xl py-4 px-4 text-white placeholder-gray-500 focus:border-[#7ED321] text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || formData.otp.length !== 6}
                className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl mt-8"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>

            {error && <div className="text-red-400 text-center text-sm mt-4">{error}</div>}

            <div className="text-center">
              <button
                onClick={() => handleRegister(new Event("submit") as any)}
                className="rosca-green-text font-semibold"
                disabled={isLoading}
              >
                Resend Code
              </button>
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
              <Label htmlFor="contactNumber" className="text-gray-300">
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="Enter your contact number"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
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
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl mt-8"
            >
              {isLoading ? "Sending Code..." : "Register"}
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

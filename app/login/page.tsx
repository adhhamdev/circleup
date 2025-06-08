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

export default function LoginPage() {
  const [formData, setFormData] = useState({
    contactNumber: "",
    password: "",
  })

  const { signIn } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signIn(formData.contactNumber, formData.password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed")
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl mt-8"
            >
              {isLoading ? "Signing In..." : "Log In"}
            </Button>
          </form>

          {error && <div className="text-red-400 text-center text-sm mt-4">{error}</div>}

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

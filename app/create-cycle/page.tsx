"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft } from "lucide-react"
import { CycleService } from "@/lib/cycles"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"

export default function CreateCyclePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contribution_amount: "",
    duration_months: "12",
    max_members: "10",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError("")

    try {
      await CycleService.createCycle({
        name: formData.name,
        description: formData.description,
        contribution_amount: Number.parseFloat(formData.contribution_amount),
        duration_months: Number.parseInt(formData.duration_months),
        max_members: Number.parseInt(formData.max_members),
        created_by: user.id,
      })

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to create cycle")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen rosca-bg text-white p-6">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/dashboard">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-semibold ml-4">Create New Cycle</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Cycle Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Savings Circle"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-transparent border-2 border-gray-600 rounded-2xl py-4 px-4 text-white placeholder-gray-500 focus:border-[#7ED321]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this cycle"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-transparent border-2 border-gray-600 rounded-2xl py-4 px-4 text-white placeholder-gray-500 focus:border-[#7ED321] min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contribution_amount" className="text-gray-300">
                Monthly Contribution ($)
              </Label>
              <Input
                id="contribution_amount"
                type="number"
                placeholder="100"
                value={formData.contribution_amount}
                onChange={(e) => setFormData({ ...formData, contribution_amount: e.target.value })}
                className="bg-transparent border-2 border-gray-600 rounded-2xl py-4 px-4 text-white placeholder-gray-500 focus:border-[#7ED321]"
                required
                min="1"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_months" className="text-gray-300">
                  Duration (Months)
                </Label>
                <Input
                  id="duration_months"
                  type="number"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                  className="bg-transparent border-2 border-gray-600 rounded-2xl py-4 px-4 text-white placeholder-gray-500 focus:border-[#7ED321]"
                  required
                  min="1"
                  max="60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_members" className="text-gray-300">
                  Max Members
                </Label>
                <Input
                  id="max_members"
                  type="number"
                  value={formData.max_members}
                  onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
                  className="bg-transparent border-2 border-gray-600 rounded-2xl py-4 px-4 text-white placeholder-gray-500 focus:border-[#7ED321]"
                  required
                  min="2"
                  max="50"
                />
              </div>
            </div>

            {error && <div className="text-red-400 text-center text-sm">{error}</div>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl"
            >
              {isLoading ? "Creating Cycle..." : "Create Cycle"}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}

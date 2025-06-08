"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Calendar, CheckCircle } from "lucide-react"
import { InvitationService } from "@/lib/invitations"
import { CycleService } from "@/lib/cycles"
import { useAuth } from "@/hooks/use-auth"

export default function InvitePage() {
  const { code } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [invitation, setInvitation] = useState<any>(null)
  const [cycle, setCycle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadInvitationDetails()
  }, [code])

  const loadInvitationDetails = async () => {
    try {
      // For demo purposes, we'll simulate invitation data
      const mockInvitation = {
        id: "1",
        cycle_id: "660e8400-e29b-41d4-a716-446655440001",
        invite_code: code,
        status: "pending",
      }

      const cycleData = await CycleService.getCycleDetails(mockInvitation.cycle_id)

      setInvitation(mockInvitation)
      setCycle(cycleData)
    } catch (err: any) {
      setError(err.message || "Failed to load invitation")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptInvitation = async () => {
    if (!user || !invitation) return

    setAccepting(true)
    try {
      await InvitationService.acceptInvitation(invitation.invite_code, user.id)
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to accept invitation")
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen rosca-bg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ED321] mx-auto mb-4"></div>
          <p>Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen rosca-bg flex items-center justify-center p-6">
        <Card className="w-full max-w-sm rosca-card border-0">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Welcome to the Circle!</h2>
            <p className="text-gray-400">You've successfully joined {cycle?.name}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen rosca-bg p-6">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">You're Invited!</h1>
          <p className="text-gray-400">Join a trusted savings circle</p>
        </div>

        {cycle && (
          <Card className="rosca-card border-0 rounded-3xl mb-6">
            <CardHeader>
              <CardTitle className="text-white text-center">{cycle.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Users className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Members</p>
                  <p className="font-semibold text-white">
                    {cycle.cycle_members?.length || 0}/{cycle.max_members}
                  </p>
                </div>
                <div>
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Monthly</p>
                  <p className="font-semibold text-white">${cycle.contribution_amount}</p>
                </div>
                <div>
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="font-semibold text-white">{cycle.duration_months}mo</p>
                </div>
              </div>

              {cycle.description && (
                <div className="mt-4 p-4 bg-gray-800 rounded-2xl">
                  <p className="text-gray-300 text-sm">{cycle.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {user ? (
          <Button
            onClick={handleAcceptInvitation}
            disabled={accepting}
            className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl"
          >
            {accepting ? "Joining Circle..." : "Join Circle"}
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-400 mb-4">Sign in to join this circle</p>
            <Button
              onClick={() => router.push(`/login?redirect=/invite/${code}`)}
              className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl"
            >
              Sign In to Join
            </Button>
          </div>
        )}

        {error && <div className="text-red-400 text-center text-sm mt-4">{error}</div>}
      </div>
    </div>
  )
}

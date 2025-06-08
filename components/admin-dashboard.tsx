"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, TrendingUp, CheckCircle, Clock, MessageCircle, UserPlus } from "lucide-react"
import { InviteModal } from "./invite-modal"
import { ChatModal } from "./chat-modal"

interface AdminDashboardProps {
  cycle: any
  isAdmin: boolean
}

export function AdminDashboard({ cycle, isAdmin }: AdminDashboardProps) {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [analytics, setAnalytics] = useState({
    totalContributions: 0,
    paymentRate: 0,
    activeMembers: 0,
    pendingPayments: 0,
  })

  useEffect(() => {
    // Calculate analytics
    const totalMembers = cycle.cycle_members?.length || 0
    const totalContributions = totalMembers * cycle.contribution_amount * 3 // Assuming 3 rounds completed
    const paymentRate = 85 // Mock payment rate
    const activeMembers = totalMembers
    const pendingPayments = 2

    setAnalytics({
      totalContributions,
      paymentRate,
      activeMembers,
      pendingPayments,
    })
  }, [cycle])

  const stats = [
    {
      title: "Total Pool",
      value: `$${analytics.totalContributions.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Payment Rate",
      value: `${analytics.paymentRate}%`,
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Active Members",
      value: analytics.activeMembers,
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Pending Payments",
      value: analytics.pendingPayments,
      icon: Clock,
      color: "text-yellow-500",
    },
  ]

  const recentActivity = [
    { type: "payment", user: "Sarah Johnson", action: "made payment", amount: "$100", time: "2 hours ago" },
    { type: "join", user: "Mike Chen", action: "joined the circle", time: "1 day ago" },
    { type: "payment", user: "Emma Davis", action: "made payment", amount: "$100", time: "2 days ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="rosca-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <Card className="rosca-card border-0">
          <CardHeader>
            <CardTitle className="text-white text-lg">Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => setShowInviteModal(true)}
              className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold rounded-2xl"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Members
            </Button>
            <Button
              onClick={() => setShowChatModal(true)}
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-800 rounded-2xl"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Group Chat
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Member Status */}
      <Card className="rosca-card border-0">
        <CardHeader>
          <CardTitle className="text-white text-lg">Member Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cycle.cycle_members?.map((member: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#7ED321] rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-sm">{member.users?.full_name?.charAt(0) || "U"}</span>
                </div>
                <span className="text-white font-medium">{member.users?.full_name || "Unknown"}</span>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="rosca-card border-0">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-2xl">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                {activity.type === "payment" ? (
                  <DollarSign className="w-4 h-4 text-green-500" />
                ) : (
                  <UserPlus className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                  {activity.amount && <span className="text-green-500 ml-1">{activity.amount}</span>}
                </p>
                <p className="text-gray-400 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modals */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        cycleId={cycle.id}
        userId="current-user-id" // This should come from auth context
      />

      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        cycleId={cycle.id}
        cycleName={cycle.name}
      />
    </div>
  )
}

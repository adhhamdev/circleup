"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Plus } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useCycles } from "@/hooks/use-cycles"
import { useAuth } from "@/hooks/use-auth"
import { NotificationCenter } from "@/components/notifications"

export default function DashboardPage() {
  const { cycles, upcomingPayments, loading } = useCycles()
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen rosca-bg text-white pb-20">
        <div className="max-w-sm mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">My ROSCAs</h1>
            <div className="flex items-center space-x-2">
              <NotificationCenter />
              <Link href="/create-cycle">
                <Button size="icon" className="rosca-green hover:bg-[#6BC91A] text-black rounded-full">
                  <Plus className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Cycle</h2>
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7ED321] mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading your cycles...</p>
                </div>
              )}
              {cycles.length > 0 && (
                <Card className="rosca-card border-0 rounded-3xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Cycle 1</p>
                        <h3 className="text-xl font-bold">{cycles[0].cycles.name}</h3>
                        <p className="text-gray-400">
                          {cycles[0].cycles.max_members} members • ${cycles[0].cycles.contribution_amount} contribution
                        </p>
                        <Link href={`/cycle-details?id=${cycles[0].cycles.id}`}>
                          <Button className="rosca-green hover:bg-[#6BC91A] text-black font-semibold rounded-2xl mt-4">
                            View Details
                          </Button>
                        </Link>
                      </div>
                      <div className="w-20 h-20 bg-[#F5E6D3] rounded-2xl flex items-center justify-center">
                        <div className="w-10 h-10 bg-[#D4A574] rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Upcoming Payments</h2>
              <div className="space-y-4">
                {upcomingPayments.map((payment) => (
                  <Card key={payment.id} className="rosca-card border-0 rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{payment.cycles.name}</h3>
                            <p className="text-gray-400 text-sm">
                              Due {new Date(payment.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="rosca-green-text font-bold text-lg">${payment.amount}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        <BottomNavigation currentPage="home" />
      </div>
    </ProtectedRoute>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Calendar, Users, DollarSign, CheckCircle, Clock } from "lucide-react"

export default function CycleDetailsPage() {
  const members = [
    { name: "Liam Harper", avatar: "/placeholder-user.jpg", initials: "LH" },
    { name: "Olivia Bennett", avatar: "/placeholder-user.jpg", initials: "OB" },
    { name: "Noah Carter", avatar: "/placeholder-user.jpg", initials: "NC" },
    { name: "Ava Mitchell", avatar: "/placeholder-user.jpg", initials: "AM" },
  ]

  const paymentHistory = [
    { round: 1, member: "Liam Harper", status: "Paid", date: "Jan 15" },
    { round: 2, member: "Olivia Bennett", status: "Paid", date: "Feb 15" },
    { round: 3, member: "Noah Carter", status: "Pending", date: "Mar 15" },
  ]

  const payoutSchedule = [
    { payout: 1, member: "Liam Harper", date: "January 2024", status: "Completed" },
    { payout: 2, member: "Olivia Bennett", date: "February 2024", status: "Upcoming" },
    { payout: 3, member: "Noah Carter", date: "March 2024", status: "Scheduled" },
  ]

  return (
    <div className="min-h-screen rosca-bg text-white pb-20">
      <div className="max-w-sm mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Cycle Details</h1>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Cycle Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="rosca-card border-0 rounded-2xl">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Cycle Duration</p>
                  <p className="font-semibold">12 months</p>
                </CardContent>
              </Card>

              <Card className="rosca-card border-0 rounded-2xl">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Total Members</p>
                  <p className="font-semibold">10 members</p>
                </CardContent>
              </Card>

              <Card className="rosca-card border-0 rounded-2xl">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Contribution</p>
                  <p className="font-semibold">$100</p>
                </CardContent>
              </Card>

              <Card className="rosca-card border-0 rounded-2xl">
                <CardContent className="p-4 text-center">
                  <div className="w-6 h-6 mx-auto mb-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-400">Cycle Status</p>
                  <p className="font-semibold rosca-green-text">Active</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Members</h2>
            <div className="space-y-3">
              {members.map((member, index) => (
                <Card key={index} className="rosca-card border-0 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="ghost" className="w-full rosca-green-text">
                View All Members
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Payment History</h2>
            <div className="space-y-3">
              {paymentHistory.map((payment, index) => (
                <Card key={index} className="rosca-card border-0 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {payment.status === "Paid" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            Round {payment.round}: {payment.member}
                          </p>
                          <p className="text-sm rosca-green-text">{payment.status}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{payment.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="ghost" className="w-full rosca-green-text">
                View Full History
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Payout Schedule</h2>
            <div className="space-y-3">
              {payoutSchedule.map((payout, index) => (
                <Card key={index} className="rosca-card border-0 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            Payout {payout.payout}: {payout.member}
                          </p>
                          <p className="text-sm text-gray-400">{payout.date}</p>
                        </div>
                      </div>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          payout.status === "Completed"
                            ? "bg-green-500/20 text-green-400"
                            : payout.status === "Upcoming"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {payout.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="ghost" className="w-full rosca-green-text">
                View Full Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

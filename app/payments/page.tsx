"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, CheckCircle, CreditCard } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { PaymentModal } from "@/components/payment-modal"
import { useCycles } from "@/hooks/use-cycles"
import { ProtectedRoute } from "@/components/protected-route"

export default function PaymentsPage() {
  const { upcomingPayments, loading, makePayment } = useCycles()
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen rosca-bg text-white pb-20">
        <div className="max-w-sm mx-auto p-6">
          <div className="flex items-center mb-6">
            <Link href="/dashboard">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-semibold ml-4">Payment Management</h1>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Upcoming Payment</h2>
              {upcomingPayments.length > 0 && (
                <Card className="rosca-card border-0 rounded-3xl">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold">Cycle 1, Round 3</h3>
                        <p className="text-gray-400">
                          Due on {new Date(upcomingPayments[0].due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold">${upcomingPayments[0].amount}</span>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedPayment(upcomingPayments[0])
                          setIsModalOpen(true)
                        }}
                        className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Make Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Payment History</h2>
              <div className="space-y-4">
                <Card className="rosca-card border-0 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <div>
                          <h3 className="font-semibold">Cycle 1, Round 2</h3>
                          <p className="text-gray-400 text-sm">Paid on June 15, 2024</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">$200</span>
                        <CheckCircle className="w-5 h-5 text-green-500 ml-2 inline" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rosca-card border-0 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <div>
                          <h3 className="font-semibold">Cycle 1, Round 1</h3>
                          <p className="text-gray-400 text-sm">Paid on May 15, 2024</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">$200</span>
                        <CheckCircle className="w-5 h-5 text-green-500 ml-2 inline" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        {selectedPayment && (
          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            payment={selectedPayment}
            onPaymentSuccess={() => {
              makePayment(selectedPayment.id)
              setSelectedPayment(null)
            }}
          />
        )}

        <BottomNavigation currentPage="payments" />
      </div>
    </ProtectedRoute>
  )
}

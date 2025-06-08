"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, CreditCard, CheckCircle } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  payment: {
    id: string
    amount: number
    cycles: { name: string }
    due_date: string
  }
  onPaymentSuccess: () => void
}

export function PaymentModal({ isOpen, onClose, payment, onPaymentSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setIsSuccess(true)

    // Call success callback after a short delay
    setTimeout(() => {
      onPaymentSuccess()
      onClose()
      setIsSuccess(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm rosca-card border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Make Payment</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isSuccess ? (
            <>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-white">{payment.cycles.name}</h3>
                <p className="text-gray-400">Due: {new Date(payment.due_date).toLocaleDateString()}</p>
                <div className="text-3xl font-bold rosca-green-text">${payment.amount}</div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Default Payment Method</p>
                      <p className="text-gray-400 text-sm">•••• •••• •••• 1234</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Pay $${payment.amount}`
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
              <p className="text-gray-400">Your payment has been processed successfully.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { CycleService } from "@/lib/cycles"
import { useAuth } from "./use-auth"

export function useCycles() {
  const { user } = useAuth()
  const [cycles, setCycles] = useState<any[]>([])
  const [upcomingPayments, setUpcomingPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      const [cyclesData, paymentsData] = await Promise.all([
        CycleService.getUserCycles(user.id),
        CycleService.getUpcomingPayments(user.id),
      ])

      setCycles(cyclesData || [])
      setUpcomingPayments(paymentsData || [])
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const makePayment = async (paymentId: string) => {
    try {
      await CycleService.makePayment(paymentId)
      // Reload data after payment
      await loadUserData()
      return true
    } catch (error) {
      console.error("Error making payment:", error)
      return false
    }
  }

  return {
    cycles,
    upcomingPayments,
    loading,
    makePayment,
    refreshData: loadUserData,
  }
}

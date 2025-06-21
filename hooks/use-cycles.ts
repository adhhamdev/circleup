"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./use-auth"

interface Cycle {
  id: string
  name: string
  max_members: number
  contribution_amount: number
  status: string
}

interface CycleMember {
  id: string
  cycles: Cycle
}

interface Payment {
  id: string
  amount: number
  due_date: string
  cycles: Cycle
}

export function useCycles() {
  const { user } = useAuth()
  const [cycles, setCycles] = useState<CycleMember[]>([])
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchCycles = async () => {
      try {
        // Fetch user's cycles
        const { data: cycleMembers, error: cyclesError } = await supabase
          .from("cycle_members")
          .select(`
            id,
            cycles (
              id,
              name,
              max_members,
              contribution_amount,
              status
            )
          `)
          .eq("user_id", user.id)

        if (cyclesError) throw cyclesError

        setCycles(cycleMembers || [])

        // Fetch upcoming payments
        const { data: payments, error: paymentsError } = await supabase
          .from("payments")
          .select(`
            id,
            amount,
            due_date,
            cycles (
              id,
              name
            )
          `)
          .eq("user_id", user.id)
          .eq("status", "pending")
          .gte("due_date", new Date().toISOString())
          .order("due_date", { ascending: true })

        if (paymentsError) throw paymentsError

        setUpcomingPayments(payments || [])
      } catch (error) {
        console.error("Error fetching cycles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCycles()
  }, [user])

  return { cycles, upcomingPayments, loading }
}

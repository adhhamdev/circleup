import { supabase } from "./supabase"

export class CycleService {
  static async getUserCycles(userId: string) {
    const { data, error } = await supabase
      .from("cycle_members")
      .select(`
        *,
        cycles (
          id,
          name,
          description,
          contribution_amount,
          duration_months,
          max_members,
          status,
          created_at
        )
      `)
      .eq("user_id", userId)

    if (error) throw error
    return data
  }

  static async getCycleDetails(cycleId: string) {
    const { data, error } = await supabase
      .from("cycles")
      .select(`
        *,
        cycle_members (
          *,
          users (
            id,
            full_name
          )
        )
      `)
      .eq("id", cycleId)
      .single()

    if (error) throw error
    return data
  }

  static async getUserPayments(userId: string, cycleId?: string) {
    let query = supabase
      .from("payments")
      .select(`
        *,
        cycles (
          name
        )
      `)
      .eq("user_id", userId)
      .order("due_date", { ascending: false })

    if (cycleId) {
      query = query.eq("cycle_id", cycleId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async getUpcomingPayments(userId: string) {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        cycles (
          name
        )
      `)
      .eq("user_id", userId)
      .eq("status", "pending")
      .gte("due_date", new Date().toISOString().split("T")[0])
      .order("due_date", { ascending: true })
      .limit(5)

    if (error) throw error
    return data
  }

  static async makePayment(paymentId: string) {
    const { data, error } = await supabase
      .from("payments")
      .update({
        status: "paid",
        paid_date: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentId)
      .select()

    if (error) throw error
    return data
  }

  static async createCycle(cycleData: {
    name: string
    description?: string
    contribution_amount: number
    duration_months: number
    max_members: number
    created_by: string
  }) {
    const { data, error } = await supabase.from("cycles").insert(cycleData).select().single()

    if (error) throw error
    return data
  }

  static async joinCycle(cycleId: string, userId: string) {
    const { data, error } = await supabase
      .from("cycle_members")
      .insert({
        cycle_id: cycleId,
        user_id: userId,
      })
      .select()

    if (error) throw error
    return data
  }
}

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface User {
  id: string
  full_name: string
  contact_number: string
  created_at: string
  updated_at: string
}

export interface Cycle {
  id: string
  name: string
  description?: string
  contribution_amount: number
  duration_months: number
  max_members: number
  status: "active" | "completed" | "cancelled"
  created_by: string
  created_at: string
  updated_at: string
}

export interface CycleMember {
  id: string
  cycle_id: string
  user_id: string
  joined_at: string
  payout_order?: number
}

export interface Payment {
  id: string
  cycle_id: string
  user_id: string
  round_number: number
  amount: number
  due_date: string
  paid_date?: string
  status: "pending" | "paid" | "overdue"
  created_at: string
  updated_at: string
}

export interface Payout {
  id: string
  cycle_id: string
  recipient_id: string
  round_number: number
  amount: number
  scheduled_date: string
  paid_date?: string
  status: "scheduled" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

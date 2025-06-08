import { supabase } from "./supabase"

export interface Invitation {
  id: string
  cycle_id: string
  invited_by: string
  invite_code: string
  email?: string
  phone?: string
  status: "pending" | "accepted" | "expired"
  expires_at: string
  created_at: string
}

export class InvitationService {
  static async createInvitation(cycleId: string, invitedBy: string, contact: string, type: "email" | "phone") {
    const inviteCode = this.generateInviteCode()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const invitationData = {
      cycle_id: cycleId,
      invited_by: invitedBy,
      invite_code: inviteCode,
      [type]: contact,
      expires_at: expiresAt.toISOString(),
    }

    const { data, error } = await supabase.from("invitations").insert(invitationData).select().single()

    if (error) throw error
    return data
  }

  static async acceptInvitation(inviteCode: string, userId: string) {
    // First, get the invitation
    const { data: invitation, error: inviteError } = await supabase
      .from("invitations")
      .select("*")
      .eq("invite_code", inviteCode)
      .eq("status", "pending")
      .single()

    if (inviteError || !invitation) {
      throw new Error("Invalid or expired invitation code")
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      throw new Error("Invitation has expired")
    }

    // Add user to cycle
    const { error: memberError } = await supabase.from("cycle_members").insert({
      cycle_id: invitation.cycle_id,
      user_id: userId,
    })

    if (memberError) throw memberError

    // Update invitation status
    const { error: updateError } = await supabase
      .from("invitations")
      .update({ status: "accepted" })
      .eq("id", invitation.id)

    if (updateError) throw updateError

    return invitation
  }

  static async getCycleInvitations(cycleId: string) {
    const { data, error } = await supabase
      .from("invitations")
      .select(`
        *,
        users!invitations_invited_by_fkey (
          full_name
        )
      `)
      .eq("cycle_id", cycleId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  private static generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }
}

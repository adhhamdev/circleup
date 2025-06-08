import { supabase } from "./supabase"

export interface Message {
  id: string
  cycle_id: string
  user_id: string
  message: string
  created_at: string
  users: {
    full_name: string
  }
}

export class ChatService {
  static async sendMessage(cycleId: string, userId: string, message: string) {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        cycle_id: cycleId,
        user_id: userId,
        message: message.trim(),
      })
      .select(`
        *,
        users (
          full_name
        )
      `)
      .single()

    if (error) throw error
    return data
  }

  static async getCycleMessages(cycleId: string, limit = 50) {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        users (
          full_name
        )
      `)
      .eq("cycle_id", cycleId)
      .order("created_at", { ascending: true })
      .limit(limit)

    if (error) throw error
    return data
  }

  static subscribeToMessages(cycleId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages:${cycleId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `cycle_id=eq.${cycleId}`,
        },
        async (payload) => {
          // Fetch the complete message with user data
          const { data } = await supabase
            .from("messages")
            .select(`
              *,
              users (
                full_name
              )
            `)
            .eq("id", payload.new.id)
            .single()

          if (data) callback(data)
        },
      )
      .subscribe()
  }
}

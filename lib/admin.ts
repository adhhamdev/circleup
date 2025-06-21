import { supabase } from "./supabase"

export class AdminService {
  // Function to delete a user and all their data
  static async deleteUser(userId: string) {
    try {
      // First, delete from auth.users (this will trigger the cascade)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)

      if (authError) throw authError

      // The trigger will automatically handle deleting from public.users
      // and all related data due to CASCADE constraints

      return { success: true }
    } catch (error) {
      console.error("Error deleting user:", error)
      throw error
    }
  }

  // Function to get user with all related data (for admin purposes)
  static async getUserWithData(userId: string) {
    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select(`
          *,
          cycles:cycle_members(
            cycle:cycles(*)
          ),
          payments(*),
          payouts(*)
        `)
        .eq("id", userId)
        .single()

      if (userError) throw userError

      return user
    } catch (error) {
      console.error("Error fetching user data:", error)
      throw error
    }
  }
}

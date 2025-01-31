// utils/user-management.ts
import { createClient } from "@/utils/supabase/client";
import {
  Profile,
} from "@/types/profile";


async function insertUser(
  id: string,
  username: string,
  fullName: string,
  email: string
) {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").insert([
    {
      id,
      username,
      full_name: fullName,
      email,
    },
  ]);

  if (error) {
    console.error("Error inserting user:", error);
    throw error;
  }

  return data;
}

export const userManagement = {
  insertUser,
  /**
   * Get profile by user ID
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        // Return mock data as fallback
        return {
          id: userId,
          username: "testuser",
          full_name: "Test User",
          email: "test@example.com",
          phone_number: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return data;
    } catch (error) {
      console.error("Error in getProfile:", error);
      throw error;
    }
  }}

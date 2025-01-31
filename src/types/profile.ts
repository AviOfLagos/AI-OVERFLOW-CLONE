
export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string;
  phone_number: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// API response types
export interface ProfileResponse {
  data: Profile | null;
  error: Error | null;
}

// Form types for profile updates
export interface ProfileUpdateFormData {
  username?: string;
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
}
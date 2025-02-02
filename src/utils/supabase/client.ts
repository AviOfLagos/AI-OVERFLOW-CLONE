// src/utils/supabase/client.ts

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
  return createPagesBrowserClient();
};

// Helper function to get the current user and role
export const getCurrentUser = async () => {
  let userError;
  const supabase = createClient();
  let profileError;
  try {
    const {
      data: { session },
      error: _userError,
    } = await supabase.auth.getSession();
    userError = _userError;
    if (userError) throw userError;

    const user = session?.user;
    if (!user) return null;

    // Get user profile with role
    const { data: profile, error: _profileError } = await supabase
      .from('profiles')
      .select('role, tracks')
      .eq('id', user.id)
      .single();

    profileError = _profileError;
    if (profileError) throw profileError;

    return {
      ...user,
      role: profile?.role || 'intern',
      tracks: profile?.tracks || [],
    };
  } catch (error) {
    console.error(
      'Error getting current user:',
      error,
      userError,
      profileError
    );
    return null;
  }
};

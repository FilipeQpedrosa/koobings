import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create a single instance for direct use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Export a function to create new instances when needed
export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}; 
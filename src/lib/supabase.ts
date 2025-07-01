import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // During build time or if env vars are missing, create a dummy client
  console.warn('Supabase environment variables not found. Using dummy client.');
}

export const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co', 
  supabaseKey || 'dummy-key'
); 
// Supabase client configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  
  // Create a mock client to prevent app crashes
  const mockClient = {
    from: () => ({
      select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } }) })
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null })
    }
  };
  
  supabase = mockClient;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
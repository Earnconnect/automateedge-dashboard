import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  try {
    // Test connection
    const { data, error } = await supabase.from('clients').select('count()', { count: 'exact' })
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, we'll create it via dashboard
      console.log('Tables need to be created via Supabase dashboard')
    }
  } catch (err) {
    console.error('Database initialization error:', err)
  }
}

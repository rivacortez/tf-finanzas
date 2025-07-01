import { createClient } from '@supabase/supabase-js'
import { Database } from '@/app/core/interfaces/Database'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
)
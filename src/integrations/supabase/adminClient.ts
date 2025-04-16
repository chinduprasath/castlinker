import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qnpdieomxraerzgocofk.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucGRpZW9teHJhZXJ6Z29jb2ZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQwMjQ3MSwiZXhwIjoyMDU4OTc4NDcxfQ.XfdQlsiFVemtLqwCZ_O9vS95fX5ONr-5r539yhl-5ko"; // Replace with your service role key

// Create a Supabase client with service role access
export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 
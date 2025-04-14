
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with proper fallback values
// Make sure these match your Supabase project values
const supabaseUrl = 'https://qnpdieomxraerzgocofk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucGRpZW9teHJhZXJ6Z29jb2ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MDI0NzEsImV4cCI6MjA1ODk3ODQ3MX0.BcLb9NnIeaV6FOymxkP4pGU91uo35MiXe2cGj2P6Ea4';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

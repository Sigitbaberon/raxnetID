import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyhtvmjpzmopmtmxcnph.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95aHR2bWpwem1vcG10bXhjbnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMzc5ODQsImV4cCI6MjA3MDkxMzk4NH0.wNFn5is3qifs1jf89qYY64cUT1dVRVWmGjf_T4Z2d44';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

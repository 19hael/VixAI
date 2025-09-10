const SUPABASE_URL = 'https://jrixmbvxpdtqipkpjery.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyaXhtYnZ4cGR0cWlwa3BqZXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzM4NjEsImV4cCI6MjA3Mjg0OTg2MX0.XRBtTcknz6Gwbcj35-OqZ90ZrFFHsGZVTJGv_ya_8Mc';

let __supa = null;
export async function getSupa(){
  if(__supa) return __supa;
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.45.4');
  __supa = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return __supa;
}

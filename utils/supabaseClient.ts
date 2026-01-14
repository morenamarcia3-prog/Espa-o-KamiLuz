
import { createClient } from '@supabase/supabase-js';

// As variáveis devem ser configuradas no ambiente de execução.
// Utilizamos fallbacks sintáticos para evitar o erro "supabaseUrl is required" durante o parse inicial do código.
const supabaseUrl = (process.env as any).SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (process.env as any).SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIn0.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

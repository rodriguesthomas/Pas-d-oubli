import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uknhaqncznphikwhggvc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_n7DncgkT9YE00g-rFAVpnQ___nM0V9D'; // Colle ici la clé complète copiée

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
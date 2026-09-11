import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

const isSupabaseConfigured = () => {
  const url = config.supabase.url;
  const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
  return (
    url &&
    key &&
    !url.includes('your-project-id') &&
    !key.includes('your-anon-key') &&
    url.startsWith('https://')
  );
};

let supabase = null;

if (isSupabaseConfigured()) {
  try {
    const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
    supabase = createClient(config.supabase.url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
      },
    });
    console.log('[Supabase] Client initialized successfully.');
  } catch (err) {
    console.warn('[Supabase] Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log(
    '[Supabase] Supabase credentials not yet provided in .env. Running with integrated fallback data provider.'
  );
}

export { supabase, isSupabaseConfigured };

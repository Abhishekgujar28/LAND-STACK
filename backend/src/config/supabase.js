/**
 * Land Stack — Supabase Client Factory
 * 
 * THREE separate clients with different privilege levels:
 * 1. supabaseAnon    — public/anonymous operations (no RLS bypass)
 * 2. supabaseAdmin   — trusted server-side operations (bypasses RLS — use sparingly)
 * 3. createAuthClient(token) — per-request client with user JWT (RLS enforced)
 * 
 * CRITICAL RULE: Normal user-facing requests MUST use createAuthClient(token),
 * never supabaseAdmin, so that RLS policies are enforced at the database level.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

// ─── Configuration Check ───────────────────────────────────────────────────────
export const isSupabaseConfigured = () => {
  const url = config.supabase.url;
  const key = config.supabase.anonKey;
  return (
    url &&
    key &&
    !url.includes('your-project-id') &&
    !key.includes('your-anon-key') &&
    url.startsWith('https://')
  );
};

// ─── Data Provider Mode: Strict Database-Only ─────────────────────────────────
export const getDataProviderMode = () => 'supabase';
export const isSupabaseMode = () => true;
export const isMockMode = () => false;

// ─── Resilient Fetch with Timeout & Auto-Retry for Socket Resets ───────────────
async function resilientFetch(url, options = {}, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      const isTransient =
        err.name === 'AbortError' ||
        err.code === 'ECONNRESET' ||
        err.code === 'ETIMEDOUT' ||
        err.message?.includes('fetch failed');

      if (attempt < retries && isTransient) {
        console.warn(`[Supabase Fetch] Retrying (${attempt + 1}/${retries}) after glitch: ${err.message}`);
        await new Promise((res) => setTimeout(res, 250 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}

// ─── Anonymous Client ──────────────────────────────────────────────────────────
// Used for public endpoints that don't require authentication.
// Respects RLS policies marked for anon role.
let _supabaseAnon = null;

export function getSupabaseAnon() {
  if (!isSupabaseConfigured()) return null;
  if (_supabaseAnon) return _supabaseAnon;

  try {
    _supabaseAnon = createClient(config.supabase.url, config.supabase.anonKey, {
      global: {
        fetch: resilientFetch,
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return _supabaseAnon;
  } catch (err) {
    console.error('[Supabase] Failed to create anon client:', err.message);
    return null;
  }
}

// ─── Admin / Service-Role Client ───────────────────────────────────────────────
// ONLY for trusted server-side operations:
//   - Creating/updating user profiles during auth
//   - Admin operations
//   - Background jobs
//   - Audit event insertion
// NEVER use for normal user-facing data reads/writes.
let _supabaseAdmin = null;

export function getSupabaseAdmin() {
  if (!isSupabaseConfigured() || !config.supabase.serviceRoleKey) return null;
  if (_supabaseAdmin) return _supabaseAdmin;

  try {
    _supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      global: {
        fetch: resilientFetch,
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return _supabaseAdmin;
  } catch (err) {
    console.error('[Supabase] Failed to create admin client:', err.message);
    return null;
  }
}

// ─── Authenticated User Client ─────────────────────────────────────────────────
// Creates a per-request Supabase client with the user's JWT.
// This ensures every query passes through RLS with the user's identity.
// Call this from middleware/controllers after extracting the JWT from the cookie.
export function createAuthClient(accessToken) {
  if (!isSupabaseConfigured()) return null;
  if (!accessToken) return null;

  return createClient(config.supabase.url, config.supabase.anonKey, {
    global: {
      fetch: resilientFetch,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// ─── Legacy Compat ─────────────────────────────────────────────────────────────
// The old `supabase` export used the service-role key for everything.
// During migration, modules still using `import { supabase }` get the admin client.
// TODO: Remove this once all modules are migrated to use the proper clients.
export const supabase = null; // Force migration — old code must update imports

// Initialize clients on module load
if (isSupabaseConfigured()) {
  getSupabaseAnon();
  if (config.supabase.serviceRoleKey) {
    getSupabaseAdmin();
  }
  console.log('[Supabase] Clients initialized (anon + admin).');
} else {
  console.log('[Supabase] Not configured. Running in mock mode.');
}

import { createClient } from '@supabase/supabase-js';

export const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    : null;

/**
 * Supabase is intentionally optional for the demo build. Add the public project
 * URL and publishable key in Vercel when persistence/auth is enabled.
 */

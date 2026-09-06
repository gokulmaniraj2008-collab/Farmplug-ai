import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

/**
 * Request-scoped Supabase client for Server Components and Route Handlers.
 *
 * Auth is cookie based for SSR. We also forward an Authorization bearer token
 * when a legacy/mobile client sends one, so existing WebView API calls remain
 * compatible while the application moves toward cookie-based SSR auth.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const authorization = requestHeaders.get('authorization');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error('Supabase server configuration is incomplete.');
  }

  return createServerClient(url, publishableKey, {
    global: authorization
      ? { headers: { Authorization: authorization } }
      : undefined,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always mutate cookies. A request proxy
          // can persist refreshed cookies when one is configured.
        }
      },
    },
  });
}

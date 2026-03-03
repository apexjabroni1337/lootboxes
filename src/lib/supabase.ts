import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key (for cron jobs, admin operations)
// Uses cache: 'no-store' to bypass Next.js Data Cache on every request
export function createServerClient() {
    return createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
              global: {
                        fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
                                    return fetch(url, { ...options, cache: 'no-store' as RequestCache });
                        },
              },
      }
        );
}

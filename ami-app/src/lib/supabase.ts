import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export type AppSupabaseClient = SupabaseClient<Database>;

function readEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to .env.local (see .env.local.example).`,
    );
  }
  return value;
}

/**
 * Browser-side anon client. Safe to import from Client Components.
 * Singleton so we don't create a new client on every render.
 */
let browserClient: AppSupabaseClient | undefined;

export function getSupabaseBrowserClient(): AppSupabaseClient {
  if (!browserClient) {
    browserClient = createClient<Database>(
      readEnv("NEXT_PUBLIC_SUPABASE_URL"),
      readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }
  return browserClient;
}

/**
 * Fresh client per call — for use inside Server Components, Route Handlers,
 * and Server Actions where module-level singletons can leak between requests.
 */
export function createSupabaseServerClient(): AppSupabaseClient {
  return createClient<Database>(
    readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

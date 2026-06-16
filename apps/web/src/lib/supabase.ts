import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export type AppSupabaseClient = SupabaseClient<Database>;

type PublicEnvName = "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY";
type ServerEnvName = "SUPABASE_SERVICE_ROLE_KEY";

function readEnv(name: PublicEnvName | ServerEnvName): string {
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

/**
 * Service-role client — bypasses RLS. Use ONLY in trusted server contexts
 * (Route Handlers, server-only scripts). Never import from Client Components.
 * The service-role key must stay out of the browser bundle; this helper throws
 * loudly if the env var is missing so we fail fast in misconfigured deploys.
 *
 * Used by:
 *   • /api/recommend — needs to read the `embedding` column (server-side only).
 *   • scripts/backfill-embeddings.ts — needs to UPDATE rows past RLS.
 */
export function createSupabaseServiceRoleClient(): AppSupabaseClient {
  return createClient<Database>(
    readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    readEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

/**
 * Shared clients + small HTTP helpers for the ingestion pipeline:
 *   • Supabase service-role client (bypasses RLS to insert pending_review rows
 *     and upload to Storage).
 *   • CLIP worker /enrich call.
 *   • A polite fetch with a real User-Agent and a configurable per-host delay.
 */

import { createClient } from "@supabase/supabase-js";

import type { Database } from "../../../apps/web/src/types/database";
import type { EnrichResult } from "./types";

function reqEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env var: ${name}`);
    process.exit(1);
  }
  return v;
}

export const SUPABASE_URL = reqEnv("SUPABASE_URL");
const SERVICE_ROLE = reqEnv("SUPABASE_SERVICE_ROLE_KEY");
export const WORKER_URL = process.env.CLIP_WORKER_URL ?? "http://localhost:8000";
export const STORAGE_BUCKET = "inspiration-images";

/** Be a good citizen: identify ourselves and throttle. */
export const USER_AGENT =
  process.env.INGEST_USER_AGENT ??
  "AMIByArhamBot/0.1 (+https://amibyarham.com; inspiration indexing)";
export const REQUEST_DELAY_MS = Number(process.env.INGEST_DELAY_MS ?? 1200);

export const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Polite GET — sets UA, follows redirects, throws on non-2xx. */
export async function politeFetch(url: string): Promise<Response> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`GET ${url} → ${res.status}`);
  }
  return res;
}

/** Download an image and return its bytes + content type. */
export async function downloadImage(
  url: string,
): Promise<{ bytes: Uint8Array; contentType: string }> {
  const res = await politeFetch(url);
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.length === 0) throw new Error(`empty image body: ${url}`);
  return { bytes, contentType };
}

/** Call the CLIP worker /enrich endpoint with raw image bytes (base64). */
export async function enrichImage(bytes: Uint8Array): Promise<EnrichResult> {
  const base64 = Buffer.from(bytes).toString("base64");
  const res = await fetch(`${WORKER_URL}/enrich`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_base64: base64 }),
  });
  if (!res.ok) {
    throw new Error(`worker /enrich ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as EnrichResult;
}

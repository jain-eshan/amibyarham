/**
 * One-off (re-runnable) backfill: for every approved `inspiration_images` row
 * that doesn't have an embedding yet, call the CLIP worker to compute the
 * 512-dim image embedding (and optionally a zero-shot tag set), then write
 * everything back via the Supabase service-role client.
 *
 * Usage:
 *   SUPABASE_URL=https://...supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   CLIP_WORKER_URL=http://localhost:8000 \
 *   npx tsx scripts/backfill-embeddings.ts [--tags] [--limit 200]
 *
 * Flags:
 *   --tags         Also call /tag and fill empty taxonomy columns.
 *   --limit N      Cap rows per run (default: 500). The script is idempotent
 *                  so you can re-run until everything is embedded.
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "../ami-app/src/types/database";

type Row = Database["public"]["Tables"]["inspiration_images"]["Row"];

function reqEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env var: ${name}`);
    process.exit(1);
  }
  return v;
}

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  if (i === -1) return undefined;
  return process.argv[i + 1];
}

const TAGS = process.argv.includes("--tags");
const LIMIT = Number(arg("--limit") ?? 500);
const SUPABASE_URL = reqEnv("SUPABASE_URL");
const SERVICE_ROLE = reqEnv("SUPABASE_SERVICE_ROLE_KEY");
const WORKER = process.env.CLIP_WORKER_URL ?? "http://localhost:8000";

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type EmbedResp = { embedding: number[] };
type TagResp = {
  jewelry_type: string | null;
  metal: string[];
  styles: string[];
  stones: string[];
  motif: string[];
  occasions: string[];
};

async function workerCall<T>(path: "/embed" | "/tag", imageUrl: string): Promise<T> {
  const res = await fetch(`${WORKER}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!res.ok) {
    throw new Error(`worker ${path} ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

async function fetchPending(): Promise<Row[]> {
  const { data, error } = await supabase
    .from("inspiration_images")
    .select("*")
    .eq("status", "approved")
    .is("embedding", null)
    .limit(LIMIT);
  if (error) throw error;
  return (data ?? []) as Row[];
}

function isEmptyArr(arr: string[] | null | undefined): boolean {
  return !arr || arr.length === 0;
}

async function main() {
  console.log(
    `[backfill] worker=${WORKER} tags=${TAGS} limit=${LIMIT} target=approved+null-embedding`,
  );
  const rows = await fetchPending();
  console.log(`[backfill] ${rows.length} row(s) need embeddings`);

  let ok = 0;
  let fail = 0;
  for (const row of rows) {
    try {
      const embed = await workerCall<EmbedResp>("/embed", row.image_url);
      const update: Database["public"]["Tables"]["inspiration_images"]["Update"] = {
        embedding: `[${embed.embedding.join(",")}]`,
      };

      if (TAGS) {
        const tags = await workerCall<TagResp>("/tag", row.image_url);
        // Only fill in facets that are currently empty — we never overwrite
        // human-curated tags on existing rows.
        if (!row.jewelry_type && tags.jewelry_type) update.jewelry_type = tags.jewelry_type;
        if (isEmptyArr(row.metals) && tags.metal.length) update.metals = tags.metal;
        if (isEmptyArr(row.styles) && tags.styles.length) update.styles = tags.styles;
        if (isEmptyArr(row.stones) && tags.stones.length) update.stones = tags.stones;
        if (isEmptyArr(row.motif) && tags.motif.length) update.motif = tags.motif;
        if (isEmptyArr(row.occasions) && tags.occasions.length) update.occasions = tags.occasions;
      }

      const { error } = await supabase
        .from("inspiration_images")
        .update(update)
        .eq("id", row.id);
      if (error) throw error;

      ok++;
      if (ok % 10 === 0) console.log(`[backfill]   ${ok}/${rows.length}`);
    } catch (err) {
      fail++;
      console.error(`[backfill] ${row.id} failed:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`[backfill] done — ok=${ok} fail=${fail}`);
}

main().catch((err) => {
  console.error("[backfill] fatal:", err);
  process.exit(1);
});

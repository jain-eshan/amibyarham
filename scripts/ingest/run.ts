/**
 * Phase 3 ingestion CLI.
 *
 * Usage:
 *   SUPABASE_URL=https://...supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   CLIP_WORKER_URL=http://localhost:8000 \
 *   npx tsx scripts/ingest/run.ts danish [--brand "Maria Black"] \
 *       [--max-products 25] [--limit 50] [--dry-run]
 *
 * Lanes:
 *   danish   Lane B — Danish/Scandinavian brand catalogs (schema.org JSON-LD).
 *            (Lanes A/Pinterest and C/stock are documented in
 *             docs/ingestion-n8n.md and scaffold next.)
 *
 * Everything inserted lands `status='pending_review'` for human approval in
 * Supabase Studio — nothing auto-publishes.
 */

import { collectDanish } from "./lanes/danish";
import { ingest } from "./pipeline";
import type { SourceCandidate } from "./types";

function flag(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}

function num(name: string, fallback: number): number {
  const v = flag(name);
  return v === undefined ? fallback : Number(v);
}

async function main() {
  const lane = process.argv[2];
  const dryRun = process.argv.includes("--dry-run");
  const limit = num("--limit", Infinity);

  let candidates: SourceCandidate[];
  switch (lane) {
    case "danish":
      candidates = await collectDanish({
        brand: flag("--brand"),
        maxProducts: num("--max-products", 25),
      });
      break;
    default:
      console.error(
        `Unknown lane "${lane ?? ""}". Available: danish` +
          ` (Pinterest/stock lanes are documented in docs/ingestion-n8n.md).`,
      );
      process.exit(1);
  }

  console.log(`[ingest] ${candidates.length} candidate(s) collected`);
  const stats = await ingest(candidates, { dryRun, limit });
  console.log(
    `[ingest] done — seen=${stats.seen} inserted=${stats.inserted} ` +
      `duplicate=${stats.skippedDuplicate} failed=${stats.failed}` +
      (dryRun ? " (dry-run, nothing written)" : ""),
  );
}

main().catch((err) => {
  console.error("[ingest] fatal:", err);
  process.exit(1);
});

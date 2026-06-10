/**
 * Shared ingestion pipeline. Lane collectors hand it `SourceCandidate[]`; it
 * runs the legitimate-first flow for each:
 *
 *   1. Skip if the exact source_url is already in the catalog.
 *   2. Download the image bytes (polite UA).
 *   3. Enrich via the CLIP worker (embedding + pHash + zero-shot tags).
 *   4. Skip if the pHash already exists (collapse the same piece across sources).
 *   5. Upload the image to Supabase Storage.
 *   6. Insert a `pending_review` row with full provenance, embedding, and the
 *      merged tag set (brand structured data wins over CLIP guesses).
 *
 * Nothing here auto-publishes — every row lands `pending_review` for a human to
 * approve in Supabase Studio.
 */

import {
  downloadImage,
  enrichImage,
  REQUEST_DELAY_MS,
  sleep,
  STORAGE_BUCKET,
  supabase,
} from "./clients";
import { mapMaterial } from "./material-map";
import type { IngestStats, SourceCandidate } from "./types";

const JEWELRY_TYPES = [
  "Ring",
  "Necklace",
  "Earrings",
  "Bracelet",
  "Maang Tikka",
  "Set",
];

/** Best-effort native-category → our jewelry_type, else null. */
function mapJewelryType(nativeCategory: string | null): string | null {
  if (!nativeCategory) return null;
  const c = nativeCategory.toLowerCase();
  if (/ring/.test(c)) return "Ring";
  if (/necklace|pendant|choker|chain/.test(c)) return "Necklace";
  if (/earring|stud|hoop|chandbali|jhumk/.test(c)) return "Earrings";
  if (/bracelet|bangle|cuff/.test(c)) return "Bracelet";
  if (/tikka|maang/.test(c)) return "Maang Tikka";
  if (/\bset\b|bridal\s*set/.test(c)) return "Set";
  return null;
}

function extensionFor(contentType: string): string {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  return "jpg";
}

async function sourceUrlExists(sourceUrl: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("inspiration_images")
    .select("id")
    .eq("source_url", sourceUrl)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}

async function phashExists(phash: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("inspiration_images")
    .select("id")
    .eq("phash", phash)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}

export type IngestOptions = {
  /** Don't write — just log what would be inserted. */
  dryRun?: boolean;
  /** Cap rows actually inserted this run. */
  limit?: number;
};

export async function ingest(
  candidates: SourceCandidate[],
  opts: IngestOptions = {},
): Promise<IngestStats> {
  const stats: IngestStats = {
    seen: 0,
    inserted: 0,
    skippedDuplicate: 0,
    failed: 0,
  };
  const limit = opts.limit ?? Infinity;

  for (const cand of candidates) {
    if (stats.inserted >= limit) break;
    stats.seen++;
    try {
      if (await sourceUrlExists(cand.sourceUrl)) {
        stats.skippedDuplicate++;
        continue;
      }

      const { bytes, contentType } = await downloadImage(cand.imageUrl);
      const enriched = await enrichImage(bytes);

      if (await phashExists(enriched.phash)) {
        stats.skippedDuplicate++;
        continue;
      }

      // Merge tags: brand structured data (native material/category) wins over
      // the worker's zero-shot guesses on metals/stones/jewelry_type.
      const native = mapMaterial(cand.nativeMaterial, cand.nativeCategory);
      const metals = native.metals.length ? native.metals : enriched.metal;
      const stones = native.stones.length ? native.stones : enriched.stones;
      const jewelryType =
        mapJewelryType(cand.nativeCategory) ??
        (enriched.jewelry_type && JEWELRY_TYPES.includes(enriched.jewelry_type)
          ? enriched.jewelry_type
          : null);

      if (opts.dryRun) {
        console.log(
          `[dry-run] would insert ${cand.sourceUrl} → type=${jewelryType} ` +
            `metals=[${metals.join(",")}] stones=[${stones.join(",")}] ` +
            `styles=[${enriched.styles.join(",")}] phash=${enriched.phash}`,
        );
        stats.inserted++;
        await sleep(REQUEST_DELAY_MS);
        continue;
      }

      const storagePath = `ingested/${enriched.phash}.${extensionFor(contentType)}`;
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, bytes, { contentType, upsert: true });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

      const { error: insertError } = await supabase
        .from("inspiration_images")
        .insert({
          image_url: publicUrl,
          alt_text: cand.altText,
          category: cand.nativeCategory,
          jewelry_type: jewelryType,
          metals,
          stones,
          styles: enriched.styles,
          motif: enriched.motif,
          occasions: enriched.occasions,
          source_name: cand.sourceName,
          source_url: cand.sourceUrl,
          attribution: cand.attribution,
          license_status: cand.licenseStatus,
          phash: enriched.phash,
          is_own_catalog: cand.isOwnCatalog ?? false,
          status: "pending_review",
          embedding: `[${enriched.embedding.join(",")}]`,
        });
      if (insertError) throw insertError;

      stats.inserted++;
      console.log(`[ingest] + ${cand.sourceName}: ${cand.sourceUrl}`);
    } catch (err) {
      stats.failed++;
      console.error(
        `[ingest] ! ${cand.sourceUrl}:`,
        err instanceof Error ? err.message : err,
      );
    }

    // Throttle between candidates regardless of outcome.
    await sleep(REQUEST_DELAY_MS);
  }

  return stats;
}

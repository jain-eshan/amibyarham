/**
 * Pipeline integration test — validates Supabase connectivity, Storage upload,
 * and inspiration_images insert with mock enrichment data.
 *
 * Skips the CLIP worker (not reachable in this environment) and uses synthetic
 * embeddings + tags. All rows land as `pending_review`.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   npx tsx ingest/test-pipeline.ts [--dry-run] [--cleanup]
 */

import {
  supabase,
  SUPABASE_URL,
  STORAGE_BUCKET,
} from "./clients";

const TEST_SOURCE_PREFIX = "https://test.example.com/products/";

type TestProduct = {
  slug: string;
  altText: string;
  category: string;
  material: string;
  jewelryType: string;
  metals: string[];
  stones: string[];
  styles: string[];
  motif: string[];
  occasions: string[];
};

const TEST_PRODUCTS: TestProduct[] = [
  {
    slug: "gold-ring-001",
    altText: "18k Gold Solitaire Ring",
    category: "Rings",
    material: "18 karat gold",
    jewelryType: "Ring",
    metals: ["18k Gold"],
    stones: ["Diamond"],
    styles: ["Minimalist", "Modern"],
    motif: [],
    occasions: ["Engagement", "Everyday"],
  },
  {
    slug: "silver-necklace-002",
    altText: "Sterling Silver Chain Necklace",
    category: "Necklaces",
    material: "sterling silver",
    jewelryType: "Necklace",
    metals: ["White Gold"],
    stones: [],
    styles: ["Minimalist"],
    motif: ["Geometric"],
    occasions: ["Everyday"],
  },
  {
    slug: "rose-gold-earrings-003",
    altText: "Rose Gold Stud Earrings",
    category: "Earrings",
    material: "rose gold",
    jewelryType: "Earrings",
    metals: ["Rose Gold"],
    stones: ["Pearl"],
    styles: ["Modern"],
    motif: ["Floral"],
    occasions: ["Everyday", "Wedding"],
  },
  {
    slug: "emerald-bracelet-004",
    altText: "Emerald Tennis Bracelet",
    category: "Bracelets",
    material: "18k gold with emerald",
    jewelryType: "Bracelet",
    metals: ["18k Gold"],
    stones: ["Emerald"],
    styles: ["Statement"],
    motif: [],
    occasions: ["Wedding", "Statement"],
  },
  {
    slug: "diamond-pendant-005",
    altText: "Diamond Solitaire Pendant",
    category: "Necklaces",
    material: "platinum with diamond",
    jewelryType: "Necklace",
    metals: ["Platinum"],
    stones: ["Diamond"],
    styles: ["Art Deco", "Vintage"],
    motif: ["Geometric"],
    occasions: ["Engagement"],
  },
];

function syntheticEmbedding(): number[] {
  return Array.from({ length: 512 }, () => (Math.random() - 0.5) * 0.1);
}

function syntheticPhash(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(16, "0");
}

// 4x4 BMP — valid image the DB schema doesn't care about (Storage upload test).
function tinyBmp(r: number, g: number, b: number): Uint8Array {
  const width = 4, height = 4;
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const pixelDataSize = rowSize * height;
  const fileSize = 54 + pixelDataSize;
  const buf = new Uint8Array(fileSize);
  const dv = new DataView(buf.buffer);

  buf[0] = 0x42; buf[1] = 0x4d; // "BM"
  dv.setUint32(2, fileSize, true);
  dv.setUint32(10, 54, true);
  dv.setUint32(14, 40, true);
  dv.setInt32(18, width, true);
  dv.setInt32(22, height, true);
  dv.setUint16(26, 1, true);
  dv.setUint16(28, 24, true);
  dv.setUint32(34, pixelDataSize, true);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = 54 + y * rowSize + x * 3;
      buf[offset] = b;
      buf[offset + 1] = g;
      buf[offset + 2] = r;
    }
  }
  return buf;
}

const COLORS: [number, number, number][] = [
  [212, 175, 55],   // gold
  [192, 192, 192],  // silver
  [183, 110, 121],  // rose gold
  [80, 200, 120],   // emerald green
  [230, 230, 250],  // diamond white
];

async function cleanup() {
  console.log("[test] cleaning up test rows…");
  const { data, error } = await supabase
    .from("inspiration_images")
    .delete()
    .like("source_url", `${TEST_SOURCE_PREFIX}%`)
    .select("id");
  if (error) {
    console.error("[test] cleanup error:", error.message);
  } else {
    console.log(`[test] deleted ${data?.length ?? 0} test row(s)`);
  }

  for (const p of TEST_PRODUCTS) {
    const phash = syntheticPhash(p.slug);
    await supabase.storage.from(STORAGE_BUCKET).remove([`ingested/${phash}.bmp`]);
  }
  console.log("[test] removed test images from storage");
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const doCleanup = process.argv.includes("--cleanup");

  if (doCleanup) {
    await cleanup();
    return;
  }

  console.log(`[test] SUPABASE_URL = ${SUPABASE_URL}`);
  console.log(`[test] mode = ${dryRun ? "dry-run" : "live insert"}`);

  // Step 1: verify Supabase connectivity
  console.log("\n[test] 1/4 — checking Supabase connectivity…");
  const { count, error: countErr } = await supabase
    .from("inspiration_images")
    .select("id", { count: "exact", head: true });
  if (countErr) {
    console.error("[test] FAIL — cannot query inspiration_images:", JSON.stringify(countErr));
    process.exit(1);
  }
  console.log(`[test] ✓ connected — ${count ?? 0} existing row(s) in inspiration_images`);

  // Step 2: verify Storage bucket exists
  console.log("\n[test] 2/4 — checking Storage bucket…");
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
  if (bucketErr) {
    console.error("[test] FAIL — cannot list buckets:", bucketErr.message);
    process.exit(1);
  }
  const bucket = buckets?.find((b) => b.name === STORAGE_BUCKET);
  if (!bucket) {
    console.error(`[test] FAIL — bucket "${STORAGE_BUCKET}" not found. Available:`, buckets?.map(b => b.name));
    process.exit(1);
  }
  console.log(`[test] ✓ bucket "${STORAGE_BUCKET}" exists`);

  // Step 3: upload test images + insert rows
  console.log(`\n[test] 3/4 — inserting ${TEST_PRODUCTS.length} test product(s)…`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < TEST_PRODUCTS.length; i++) {
    const p = TEST_PRODUCTS[i];
    const sourceUrl = `${TEST_SOURCE_PREFIX}${p.slug}`;
    const phash = syntheticPhash(p.slug);
    const embedding = syntheticEmbedding();
    const [r, g, b] = COLORS[i % COLORS.length];
    const imageBytes = tinyBmp(r, g, b);
    const storagePath = `ingested/${phash}.bmp`;

    // Check for existing source_url
    const { data: existing } = await supabase
      .from("inspiration_images")
      .select("id")
      .eq("source_url", sourceUrl)
      .limit(1)
      .maybeSingle();

    if (existing) {
      console.log(`[test]   skip (exists): ${p.altText}`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(
        `[test]   [dry-run] would insert: ${p.altText} → ` +
          `type=${p.jewelryType} metals=[${p.metals}] stones=[${p.stones}]`,
      );
      inserted++;
      continue;
    }

    // Upload image
    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, imageBytes, { contentType: "image/bmp", upsert: true });
    if (uploadErr) {
      console.error(`[test]   upload failed (${p.slug}):`, uploadErr.message);
      failed++;
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

    // Insert row
    const { error: insertErr } = await supabase.from("inspiration_images").insert({
      image_url: publicUrl,
      alt_text: p.altText,
      category: p.category,
      jewelry_type: p.jewelryType,
      metals: p.metals,
      stones: p.stones,
      styles: p.styles,
      motif: p.motif,
      occasions: p.occasions,
      source_name: "Test Brand",
      source_url: sourceUrl,
      attribution: "Test Brand (pipeline test)",
      license_status: "editorial",
      phash,
      is_own_catalog: false,
      status: "pending_review",
      embedding: `[${embedding.join(",")}]`,
    });

    if (insertErr) {
      console.error(`[test]   insert failed (${p.slug}):`, insertErr.message);
      failed++;
      continue;
    }

    console.log(`[test]   ✓ ${p.altText}`);
    inserted++;
  }

  // Step 4: verify rows landed
  console.log(`\n[test] 4/4 — verification…`);
  const { data: rows, error: verifyErr } = await supabase
    .from("inspiration_images")
    .select("id, alt_text, jewelry_type, metals, styles, status")
    .like("source_url", `${TEST_SOURCE_PREFIX}%`);

  if (verifyErr) {
    console.error("[test] verification query failed:", verifyErr.message);
  } else {
    console.log(`[test] ${rows?.length ?? 0} test row(s) now in DB:`);
    for (const row of rows ?? []) {
      console.log(
        `[test]   id=${row.id} status=${row.status} type=${row.jewelry_type} ` +
          `metals=${JSON.stringify(row.metals)} — ${row.alt_text}`,
      );
    }
  }

  console.log(
    `\n[test] done — inserted=${inserted} skipped=${skipped} failed=${failed}` +
      (dryRun ? " (dry-run, nothing written)" : ""),
  );

  if (inserted > 0 && !dryRun) {
    console.log(
      "[test] ✓ all rows are pending_review — approve them in Supabase Studio to go live",
    );
    console.log("[test] to clean up test data: npx tsx ingest/test-pipeline.ts --cleanup");
  }
}

main().catch((err) => {
  console.error("[test] fatal:", err);
  process.exit(1);
});

import { createSupabaseServerClient } from "@/lib/supabase";
import type { InspirationImage } from "@/types/database";

/**
 * A single card in the swipe deck. When `isFromDb` is true, `id` is a real
 * `inspiration_images.id` (uuid) and the favorite can be persisted into
 * `request_favorite_items` with a valid FK. When false, the card is part of the
 * baked-in fallback deck (no DB row), so a "like" is recorded only as a note on
 * the custom request.
 */
export type InspirationItem = {
  id: string;
  imageUrl: string | null;
  altText: string;
  category: string | null;
  /** Structured facets the Filter-First flow filters on. */
  jewelryType: string | null;
  occasions: string[];
  metals: string[];
  styles: string[];
  /** Extra taxonomy from CLIP zero-shot tagging (Phase 2). */
  stones: string[];
  motif: string[];
  /** Smart-Onboarding facets (Step 3). All optional — null/empty = unconstrained. */
  metalColors: string[];
  diamondShapes: string[];
  caratWeight: number | null;
  karatage: string[];
  itemWeightGrams: number | null;
  priceInr: number | null;
  certifications: string[];
  /** Provenance — shown as caption attribution for scraped inspiration. */
  sourceName: string | null;
  sourceUrl: string | null;
  attribution: string | null;
  /** Visual treatment for fallback cards that have no photo. */
  glyph: string;
  gradient: string;
  isFromDb: boolean;
};

/**
 * Curated fallback deck. Used when `inspiration_images` is empty (e.g. before
 * the studio has uploaded real photography). Each card is a typographic
 * treatment consistent with the rest of the site — a serif glyph over a warm
 * gradient — so the swipe engine is always demonstrable.
 */
type FallbackCard = Omit<
  InspirationItem,
  | "isFromDb"
  | "imageUrl"
  | "stones"
  | "motif"
  | "sourceName"
  | "sourceUrl"
  | "attribution"
  | "metalColors"
  | "diamondShapes"
  | "caratWeight"
  | "karatage"
  | "itemWeightGrams"
  | "priceInr"
  | "certifications"
> & Partial<
  Pick<
    InspirationItem,
    | "metalColors"
    | "diamondShapes"
    | "caratWeight"
    | "karatage"
    | "itemWeightGrams"
    | "priceInr"
    | "certifications"
    | "stones"
  >
>;

const FALLBACK_DECK: readonly FallbackCard[] = [
  {
    id: "fallback-solitaire-halo",
    altText: "Solitaire halo ring concept",
    category: "Rings",
    jewelryType: "Ring",
    occasions: ["Engagement", "Wedding"],
    metals: ["18k Gold", "White Gold"],
    styles: ["Solitaire", "Halo"],
    metalColors: ["White Gold"],
    diamondShapes: ["Round"],
    caratWeight: 1.2,
    karatage: ["18K"],
    itemWeightGrams: 4,
    priceInr: 2_400_000,
    certifications: ["GIA"],
    stones: ["Diamond"],
    glyph: "◯",
    gradient: "linear-gradient(150deg, #efe9de 0%, #e8d8cc 55%, #cc785c 140%)",
  },
  {
    id: "fallback-emerald-cut",
    altText: "Emerald-cut pendant concept",
    category: "Pendants",
    jewelryType: "Pendant",
    occasions: ["Statement", "Everyday"],
    metals: ["White Gold", "18k Gold"],
    styles: ["Bezel", "Vintage"],
    metalColors: ["White Gold"],
    diamondShapes: ["Emerald"],
    caratWeight: 0.8,
    karatage: ["18K"],
    itemWeightGrams: 3,
    priceInr: 950_000,
    certifications: ["IGI"],
    stones: ["Diamond"],
    glyph: "▢",
    gradient: "linear-gradient(150deg, #f5f0e8 0%, #e6dfd8 60%, #5db8a6 150%)",
  },
  {
    id: "fallback-jadau-chandbali",
    altText: "Jadau chandbali earrings concept",
    category: "Earrings",
    jewelryType: "Earrings",
    occasions: ["Wedding", "Statement"],
    metals: ["22k Gold", "Rose Gold"],
    styles: ["Jadau", "Polki"],
    metalColors: ["Yellow Gold", "Rose Gold"],
    karatage: ["22K"],
    itemWeightGrams: 12,
    priceInr: 380_000,
    glyph: "☾",
    gradient: "linear-gradient(150deg, #efe9de 0%, #e8d8b8 55%, #e8a55a 145%)",
  },
  {
    id: "fallback-tennis-bracelet",
    altText: "Tennis bracelet concept",
    category: "Bracelets",
    jewelryType: "Bracelet",
    occasions: ["Everyday", "Statement"],
    metals: ["18k Gold", "White Gold"],
    styles: ["Pavé"],
    metalColors: ["White Gold"],
    diamondShapes: ["Round"],
    caratWeight: 3.5,
    karatage: ["18K"],
    itemWeightGrams: 8,
    priceInr: 1_800_000,
    certifications: ["GIA"],
    stones: ["Diamond"],
    glyph: "⋯",
    gradient: "linear-gradient(150deg, #f5f0e8 0%, #e6dfd8 60%, #a9583e 150%)",
  },
  {
    id: "fallback-polki-choker",
    altText: "Polki choker concept",
    category: "Necklaces",
    jewelryType: "Necklace",
    occasions: ["Wedding"],
    metals: ["22k Gold"],
    styles: ["Polki", "Jadau"],
    metalColors: ["Yellow Gold"],
    karatage: ["22K"],
    itemWeightGrams: 35,
    priceInr: 2_200_000,
    glyph: "❖",
    gradient: "linear-gradient(150deg, #efe9de 0%, #e3d6c4 55%, #cc785c 150%)",
  },
  {
    id: "fallback-eternity-band",
    altText: "Eternity band concept",
    category: "Rings",
    jewelryType: "Ring",
    occasions: ["Wedding", "Everyday"],
    metals: ["18k Gold", "Rose Gold", "White Gold"],
    styles: ["Pavé", "Minimalist"],
    metalColors: ["Rose Gold", "White Gold", "Yellow Gold"],
    diamondShapes: ["Round"],
    caratWeight: 1.0,
    karatage: ["18K"],
    itemWeightGrams: 3,
    priceInr: 720_000,
    certifications: ["IGI"],
    stones: ["Diamond"],
    glyph: "∞",
    gradient: "linear-gradient(150deg, #f5f0e8 0%, #e8e0d2 60%, #8e8b82 150%)",
  },
  {
    id: "fallback-pear-drop",
    altText: "Pear-drop pendant concept",
    category: "Pendants",
    jewelryType: "Pendant",
    occasions: ["Engagement", "Everyday"],
    metals: ["Rose Gold", "18k Gold"],
    styles: ["Bezel", "Minimalist"],
    metalColors: ["Rose Gold"],
    diamondShapes: ["Pear"],
    caratWeight: 0.5,
    karatage: ["18K"],
    itemWeightGrams: 2,
    priceInr: 280_000,
    certifications: ["IGI"],
    stones: ["Diamond"],
    glyph: "◇",
    gradient: "linear-gradient(150deg, #efe9de 0%, #e6dfd8 55%, #5db8a6 145%)",
  },
  {
    id: "fallback-stud-classic",
    altText: "Classic gold stud earrings",
    category: "Earrings",
    jewelryType: "Earrings",
    occasions: ["Everyday"],
    metals: ["18k Gold", "22k Gold"],
    styles: ["Minimalist"],
    metalColors: ["Yellow Gold"],
    karatage: ["18K", "22K"],
    itemWeightGrams: 1.8,
    priceInr: 32_000,
    glyph: "✦",
    gradient: "linear-gradient(150deg, #f5f0e8 0%, #e8d8cc 60%, #e8a55a 150%)",
  },
  {
    id: "fallback-bridal-polki-set",
    altText: "Bridal polki set concept",
    category: "Sets",
    jewelryType: "Set",
    occasions: ["Wedding"],
    metals: ["22k Gold"],
    styles: ["Polki", "Jadau", "Statement"],
    metalColors: ["Yellow Gold"],
    karatage: ["22K"],
    itemWeightGrams: 65,
    priceInr: 4_500_000,
    glyph: "❂",
    gradient: "linear-gradient(150deg, #efe9de 0%, #e8d8b8 55%, #e8a55a 150%)",
  },
  {
    id: "fallback-maang-tikka",
    altText: "Jadau maang tikka concept",
    category: "Maang Tikka",
    jewelryType: "Maang Tikka",
    occasions: ["Wedding"],
    metals: ["22k Gold", "Rose Gold"],
    styles: ["Jadau", "Polki"],
    metalColors: ["Yellow Gold", "Rose Gold"],
    karatage: ["22K"],
    itemWeightGrams: 9,
    priceInr: 420_000,
    glyph: "✸",
    gradient: "linear-gradient(150deg, #efe9de 0%, #e3d6c4 55%, #cc785c 145%)",
  },
] as const;

function fallbackDeck(): InspirationItem[] {
  return FALLBACK_DECK.map((c) => ({
    ...c,
    imageUrl: null,
    stones: c.stones ? [...c.stones] : [],
    motif: [],
    sourceName: null,
    sourceUrl: null,
    attribution: null,
    metalColors: c.metalColors ? [...c.metalColors] : [],
    diamondShapes: c.diamondShapes ? [...c.diamondShapes] : [],
    caratWeight: c.caratWeight ?? null,
    karatage: c.karatage ? [...c.karatage] : [],
    itemWeightGrams: c.itemWeightGrams ?? null,
    priceInr: c.priceInr ?? null,
    certifications: c.certifications ? [...c.certifications] : [],
    isFromDb: false,
  }));
}

const GLYPHS = ["◯", "▢", "☾", "❖", "◇", "✦", "∞", "⋯"] as const;
const GRADIENTS = [
  "linear-gradient(150deg, #efe9de 0%, #e8d8cc 55%, #cc785c 140%)",
  "linear-gradient(150deg, #f5f0e8 0%, #e6dfd8 60%, #5db8a6 150%)",
  "linear-gradient(150deg, #efe9de 0%, #e8d8b8 55%, #e8a55a 145%)",
] as const;

function dbRowToItem(row: InspirationImage, index: number): InspirationItem {
  return {
    id: row.id,
    imageUrl: row.image_url,
    altText: row.alt_text ?? "Inspiration",
    category: row.category,
    jewelryType: row.jewelry_type ?? null,
    occasions: row.occasions ?? [],
    metals: row.metals ?? [],
    styles: row.styles ?? [],
    stones: row.stones ?? [],
    motif: row.motif ?? [],
    sourceName: row.source_name ?? null,
    sourceUrl: row.source_url ?? null,
    attribution: row.attribution ?? null,
    metalColors: row.metal_colors ?? [],
    diamondShapes: row.diamond_shapes ?? [],
    caratWeight: row.carat_weight ?? null,
    karatage: row.karatage ?? [],
    itemWeightGrams: row.item_weight_grams ?? null,
    priceInr: row.price_inr ?? null,
    certifications: row.certifications ?? [],
    glyph: GLYPHS[index % GLYPHS.length] ?? "✦",
    gradient: GRADIENTS[index % GRADIENTS.length] ?? GRADIENTS[0],
    isFromDb: true,
  };
}

/**
 * Cold-start ordering for the opening deck. Before we know a user's taste we
 * want the first cards to be (a) our strongest pieces and (b) broad across
 * jewelry types, so the swipe signal we collect is diverse rather than a run of
 * near-duplicates. We surface featured / own-catalog pieces first, then
 * round-robin the rest by category so no single type dominates the top of the
 * deck. (Phase 2's recommender takes over re-ranking once enough swipes land.)
 */
function coldStartOrder(rows: InspirationImage[]): InspirationImage[] {
  const priority = rows.filter((r) => r.featured || r.is_own_catalog);
  const rest = rows.filter((r) => !(r.featured || r.is_own_catalog));

  // Bucket the remainder by category, preserving the incoming (recency) order.
  const buckets = new Map<string, InspirationImage[]>();
  for (const row of rest) {
    const key = row.jewelry_type ?? row.category ?? "_";
    const bucket = buckets.get(key);
    if (bucket) bucket.push(row);
    else buckets.set(key, [row]);
  }

  // Round-robin across buckets so adjacent cards span different categories.
  const interleaved: InspirationImage[] = [];
  const queues = [...buckets.values()];
  let drained = false;
  while (!drained) {
    drained = true;
    for (const queue of queues) {
      const next = queue.shift();
      if (next) {
        interleaved.push(next);
        drained = false;
      }
    }
  }

  return [...priority, ...interleaved];
}

/**
 * Server-side fetch of the swipe deck. Reads approved `inspiration_images`
 * (publicly readable, gated to `status = 'approved'` by RLS + the explicit
 * filter below). Orders for cold-start diversity. Falls back to the curated
 * deck when the table is empty or the query errors, so the page always renders
 * something swipeable.
 */
export async function getInspirationDeck(): Promise<InspirationItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("inspiration_images")
      .select(
        "id, image_url, alt_text, category, jewelry_type, occasions, metals, styles, stones, motif, source_name, source_url, attribution, metal_colors, diamond_shapes, carat_weight, karatage, item_weight_grams, price_inr, certifications, featured, is_own_catalog, created_at",
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(120);

    if (error || !data || data.length === 0) {
      return fallbackDeck();
    }
    // The select is a subset of the full Row (embedding stays server-side and
    // is intentionally omitted), so widen via `unknown` for the helper types.
    return coldStartOrder(data as unknown as InspirationImage[]).map((row, i) =>
      dbRowToItem(row, i),
    );
  } catch {
    return fallbackDeck();
  }
}

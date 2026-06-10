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
const FALLBACK_DECK: readonly Omit<InspirationItem, "isFromDb" | "imageUrl">[] = [
  {
    id: "fallback-solitaire-halo",
    altText: "Solitaire halo ring concept",
    category: "Rings",
    glyph: "◯",
    gradient: "linear-gradient(150deg, #efe9de 0%, #e8d8cc 55%, #cc785c 140%)",
  },
  {
    id: "fallback-emerald-cut",
    altText: "Emerald-cut pendant concept",
    category: "Pendants",
    glyph: "▢",
    gradient: "linear-gradient(150deg, #f5f0e8 0%, #e6dfd8 60%, #5db8a6 150%)",
  },
  {
    id: "fallback-jadau-chandbali",
    altText: "Jadau chandbali earrings concept",
    category: "Earrings",
    glyph: "☾",
    gradient: "linear-gradient(150deg, #efe9de 0%, #e8d8b8 55%, #e8a55a 145%)",
  },
  {
    id: "fallback-tennis-bracelet",
    altText: "Tennis bracelet concept",
    category: "Bracelets",
    glyph: "⋯",
    gradient: "linear-gradient(150deg, #f5f0e8 0%, #e6dfd8 60%, #a9583e 150%)",
  },
  {
    id: "fallback-polki-choker",
    altText: "Polki choker concept",
    category: "Necklaces",
    glyph: "❖",
    gradient: "linear-gradient(150deg, #efe9de 0%, #e3d6c4 55%, #cc785c 150%)",
  },
  {
    id: "fallback-eternity-band",
    altText: "Eternity band concept",
    category: "Rings",
    glyph: "∞",
    gradient: "linear-gradient(150deg, #f5f0e8 0%, #e8e0d2 60%, #8e8b82 150%)",
  },
  {
    id: "fallback-pear-drop",
    altText: "Pear-drop pendant concept",
    category: "Pendants",
    glyph: "◇",
    gradient: "linear-gradient(150deg, #efe9de 0%, #e6dfd8 55%, #5db8a6 145%)",
  },
  {
    id: "fallback-stud-classic",
    altText: "Classic stud earrings concept",
    category: "Earrings",
    glyph: "✦",
    gradient: "linear-gradient(150deg, #f5f0e8 0%, #e8d8cc 60%, #e8a55a 150%)",
  },
] as const;

function fallbackDeck(): InspirationItem[] {
  return FALLBACK_DECK.map((c) => ({
    ...c,
    imageUrl: null,
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
    glyph: GLYPHS[index % GLYPHS.length] ?? "✦",
    gradient: GRADIENTS[index % GRADIENTS.length] ?? GRADIENTS[0],
    isFromDb: true,
  };
}

/**
 * Server-side fetch of the swipe deck. Reads `inspiration_images` (publicly
 * readable). Falls back to the curated deck when the table is empty or the
 * query errors, so the page always renders something swipeable.
 */
export async function getInspirationDeck(): Promise<InspirationItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("inspiration_images")
      .select("id, image_url, alt_text, category, created_at")
      .order("created_at", { ascending: false })
      .limit(40);

    if (error || !data || data.length === 0) {
      return fallbackDeck();
    }
    return data.map((row, i) => dbRowToItem(row, i));
  } catch {
    return fallbackDeck();
  }
}

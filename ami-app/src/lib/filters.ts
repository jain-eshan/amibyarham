import type { InspirationItem } from "./inspiration";

/**
 * Smart-Onboarding filter taxonomy.
 *
 * The discovery flow is a 3-step quiz:
 *  1. Core Intent      — jewelry type + budget tier (everyone)
 *  2. The Gate         — diamonds vs. gold-only (branches the rest of the quiz)
 *  3. Tailored Deep Dive — diamond-branch OR gold-branch facets only
 *
 * Filtering still runs entirely client-side over the already-loaded deck so the
 * match count on the sticky CTA updates instantly as the user toggles options.
 */

export type Branch = "diamonds" | "gold-only";

export type FacetKey =
  | "jewelryType"
  | "budgetTier"
  | "branch"
  | "metalColor"
  | "occasion"
  | "style"
  | "diamondShape"
  | "caratRange"
  | "diamondColor"
  | "diamondClarity"
  | "diamondCut"
  | "certification"
  | "karatage"
  | "weightRange";

// ─── Option vocabularies ─────────────────────────────────────────────────────

export const JEWELRY_TYPES = [
  "Ring",
  "Necklace",
  "Earrings",
  "Bracelet",
  "Pendant",
  "Set",
  "Mangalsutra",
  "Maang Tikka",
  "Nose Pin",
  "Bangle",
] as const;

export type BudgetTier = "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4";

export const BUDGET_TIERS: readonly {
  key: BudgetTier;
  label: string;
  hint: string;
  /** Inclusive lower bound in INR. */
  min: number;
  /** Exclusive upper bound in INR. `null` = open-ended. */
  max: number | null;
}[] = [
  {
    key: "Tier 1",
    label: "Tier 1 · Daily Luxury",
    hint: "Under ₹50,000",
    min: 0,
    max: 50_000,
  },
  {
    key: "Tier 2",
    label: "Tier 2 · Milestones",
    hint: "₹50,000 – ₹15,00,000",
    min: 50_000,
    max: 1_500_000,
  },
  {
    key: "Tier 3",
    label: "Tier 3 · Engagement",
    hint: "₹15,00,000 – ₹30,00,000",
    min: 1_500_000,
    max: 3_000_000,
  },
  {
    key: "Tier 4",
    label: "Tier 4 · Bespoke Statement",
    hint: "₹30,00,000+",
    min: 3_000_000,
    max: null,
  },
] as const;

export const METAL_COLORS = ["Yellow Gold", "White Gold", "Rose Gold"] as const;

export const DIAMOND_SHAPES = [
  "Round",
  "Oval",
  "Emerald",
  "Cushion",
  "Pear",
  "Radiant",
  "Princess",
  "Asscher",
  "Marquise",
  "Heart",
] as const;

/** Quick-pick brackets for the diamond carat slider. */
export const CARAT_BRACKETS: readonly {
  label: string;
  min: number;
  max: number;
}[] = [
  { label: "Under 0.5ct", min: 0, max: 0.5 },
  { label: "0.5 – 1ct", min: 0.5, max: 1 },
  { label: "1 – 2ct", min: 1, max: 2 },
  { label: "2 – 5ct", min: 2, max: 5 },
  { label: "5ct+", min: 5, max: 30 },
] as const;

export const DIAMOND_COLORS = ["D", "E", "F", "G", "H", "I", "J", "K"] as const;
export const DIAMOND_CLARITY = [
  "FL",
  "IF",
  "VVS1",
  "VVS2",
  "VS1",
  "VS2",
  "SI1",
  "SI2",
  "I1",
  "I2",
  "I3",
] as const;
export const DIAMOND_CUT = ["Good", "Very Good", "Excellent", "Super Ideal"] as const;
export const CERTIFICATIONS = ["GIA", "IGI", "HRD"] as const;

export const KARATAGE = ["14K", "18K", "22K"] as const;

export const WEIGHT_RANGES = ["0-2g", "2-5g", "5-10g", "10-20g+"] as const;

// Branch-specific style + occasion vocabularies. Mounting only the relevant
// chips per branch keeps the quiz from showing setting styles ("Halo", "Pavé")
// to a gold-only customer, per the onboarding spec.
export const DIAMOND_STYLES = [
  "Solitaire",
  "Halo",
  "Three-Stone",
  "Pavé",
  "Bezel",
  "Tension",
  "Vintage",
] as const;
export const DIAMOND_OCCASIONS = ["Engagement", "Wedding", "Everyday"] as const;

export const GOLD_STYLES = [
  "Minimalist",
  "Vintage",
  "Polki",
  "Jadau",
  "Statement",
] as const;
export const GOLD_OCCASIONS = ["Everyday", "Statement"] as const;

// ─── State ───────────────────────────────────────────────────────────────────

export type CaratRange = { min: number; max: number };

export type FilterState = {
  jewelryType: string[];
  budgetTier: BudgetTier | null;
  branch: Branch | null;
  metalColor: string[];
  occasion: string[];
  style: string[];
  diamondShape: string[];
  caratRange: CaratRange | null;
  diamondColor: string[];
  diamondClarity: string[];
  diamondCut: string[];
  certification: string[];
  karatage: string[];
  weightRange: string[];
};

export const EMPTY_FILTERS: FilterState = {
  jewelryType: [],
  budgetTier: null,
  branch: null,
  metalColor: [],
  occasion: [],
  style: [],
  diamondShape: [],
  caratRange: null,
  diamondColor: [],
  diamondClarity: [],
  diamondCut: [],
  certification: [],
  karatage: [],
  weightRange: [],
};

// ─── Matching ────────────────────────────────────────────────────────────────

/** Within-facet OR; an empty selection passes. */
function chipMatches(selected: string[], itemValues: string[]): boolean {
  if (selected.length === 0) return true;
  return selected.some((value) => itemValues.includes(value));
}

/**
 * Metal color matching maps the UI vocabulary (Yellow/White/Rose Gold) onto the
 * CLIP-emitted metals column which stores karatage-qualified names like
 * "18k Gold", "22k Gold", "White Gold", "Rose Gold", "Platinum", etc.
 * Falls back to metalColors (Smart Onboarding column) when populated.
 */
function metalColorMatches(selected: string[], item: InspirationItem): boolean {
  if (selected.length === 0) return true;
  // Prefer the dedicated metalColors column when it has data.
  if (item.metalColors.length > 0) return chipMatches(selected, item.metalColors);
  // Otherwise derive color from the CLIP metals column.
  if (item.metals.length === 0) return true; // unknown → don't exclude
  return selected.some((color) => {
    if (color === "Yellow Gold")
      return item.metals.some(
        (m) => /\d+k\s*gold/i.test(m) && !/white|rose/i.test(m),
      );
    if (color === "White Gold")
      return item.metals.some((m) => /white\s*gold/i.test(m));
    if (color === "Rose Gold")
      return item.metals.some((m) => /rose\s*gold/i.test(m));
    return item.metals.includes(color);
  });
}

/**
 * Karatage matching maps 14K/18K/22K onto the CLIP metals column which stores
 * strings like "18k Gold", "22k Gold". Falls back to the karatage column.
 */
function karatageMatches(selected: string[], item: InspirationItem): boolean {
  if (selected.length === 0) return true;
  if (item.karatage.length > 0) return chipMatches(selected, item.karatage);
  if (item.metals.length === 0) return true;
  return selected.some((k) => {
    const num = k.replace("K", "");
    return item.metals.some((m) => new RegExp(`${num}k`, "i").test(m));
  });
}

function budgetMatches(
  tier: BudgetTier | null,
  priceInr: number | null,
): boolean {
  if (!tier) return true;
  if (priceInr == null) return true; // unknown price → don't hide
  const band = BUDGET_TIERS.find((t) => t.key === tier);
  if (!band) return true;
  if (priceInr < band.min) return false;
  if (band.max != null && priceInr >= band.max) return false;
  return true;
}

function branchMatches(branch: Branch | null, stones: string[]): boolean {
  if (!branch) return true;
  const hasDiamond = stones.some((s) => s.toLowerCase().includes("diamond"));
  return branch === "diamonds" ? hasDiamond : !hasDiamond;
}

function caratMatches(
  range: CaratRange | null,
  carat: number | null,
): boolean {
  if (!range) return true;
  if (carat == null) return true;
  return carat >= range.min && carat <= range.max;
}

function weightBucket(grams: number | null): string | null {
  if (grams == null) return null;
  if (grams < 2) return "0-2g";
  if (grams < 5) return "2-5g";
  if (grams < 10) return "5-10g";
  return "10-20g+";
}

function weightRangeMatches(
  selected: string[],
  grams: number | null,
): boolean {
  if (selected.length === 0) return true;
  const bucket = weightBucket(grams);
  if (!bucket) return true;
  return selected.includes(bucket);
}

export function itemMatchesFilters(
  item: InspirationItem,
  filters: FilterState,
): boolean {
  return (
    chipMatches(filters.jewelryType, item.jewelryType ? [item.jewelryType] : []) &&
    budgetMatches(filters.budgetTier, item.priceInr) &&
    branchMatches(filters.branch, item.stones) &&
    metalColorMatches(filters.metalColor, item) &&
    chipMatches(filters.occasion, item.occasions) &&
    chipMatches(filters.style, item.styles) &&
    chipMatches(filters.diamondShape, item.diamondShapes) &&
    caratMatches(filters.caratRange, item.caratWeight) &&
    chipMatches(filters.certification, item.certifications) &&
    karatageMatches(filters.karatage, item) &&
    weightRangeMatches(filters.weightRange, item.itemWeightGrams)
    // diamondColor / diamondClarity / diamondCut are recorded as preferences
    // but not yet attached to inspiration items — they pass through.
  );
}

export function filterDeck(
  deck: InspirationItem[],
  filters: FilterState,
): InspirationItem[] {
  return deck.filter((item) => itemMatchesFilters(item, filters));
}

/** Count of constraints the user has set across all facets. */
export function totalSelected(filters: FilterState): number {
  let n = 0;
  n += filters.jewelryType.length;
  if (filters.budgetTier) n += 1;
  if (filters.branch) n += 1;
  n += filters.metalColor.length;
  n += filters.occasion.length;
  n += filters.style.length;
  n += filters.diamondShape.length;
  if (filters.caratRange) n += 1;
  n += filters.diamondColor.length;
  n += filters.diamondClarity.length;
  n += filters.diamondCut.length;
  n += filters.certification.length;
  n += filters.karatage.length;
  n += filters.weightRange.length;
  return n;
}

/** Human-readable one-liner stored alongside the lead. */
export function summarizeFilters(filters: FilterState): string {
  const parts: string[] = [];
  if (filters.jewelryType.length) parts.push(filters.jewelryType.join("/"));
  if (filters.budgetTier) parts.push(filters.budgetTier);
  if (filters.branch)
    parts.push(filters.branch === "diamonds" ? "Gold + Diamonds" : "Gold only");
  if (filters.metalColor.length) parts.push(filters.metalColor.join("/"));
  if (filters.occasion.length) parts.push(filters.occasion.join("/"));
  if (filters.style.length) parts.push(filters.style.join("/"));
  if (filters.diamondShape.length)
    parts.push(`Shape: ${filters.diamondShape.join("/")}`);
  if (filters.caratRange)
    parts.push(`${filters.caratRange.min}–${filters.caratRange.max}ct`);
  if (filters.diamondColor.length)
    parts.push(`Color ${filters.diamondColor.join("/")}`);
  if (filters.diamondClarity.length)
    parts.push(`Clarity ${filters.diamondClarity.join("/")}`);
  if (filters.diamondCut.length)
    parts.push(`Cut ${filters.diamondCut.join("/")}`);
  if (filters.certification.length)
    parts.push(filters.certification.join("/"));
  if (filters.karatage.length) parts.push(filters.karatage.join("/"));
  if (filters.weightRange.length) parts.push(filters.weightRange.join("/"));
  return parts.length > 0 ? parts.join(" · ") : "No filters — full catalogue";
}

/** Clears every Step-3 facet, used when the user revises the gate choice. */
export function resetBranchFacets(filters: FilterState): FilterState {
  return {
    ...filters,
    metalColor: [],
    occasion: [],
    style: [],
    diamondShape: [],
    caratRange: null,
    diamondColor: [],
    diamondClarity: [],
    diamondCut: [],
    certification: [],
    karatage: [],
    weightRange: [],
  };
}

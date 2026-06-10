import type { InspirationItem } from "./inspiration";

/**
 * Discovery filters — the four facets that drive the Filter-First Swipe Flow.
 *
 * The filter screen is meant to feel like a preference quiz, not a search form:
 * every facet is multi-select, and an empty facet means "no constraint" (show
 * everything). Filtering runs entirely client-side over the already-loaded deck
 * so the match count can update instantly as chips toggle — that live feedback
 * is the heart of the interaction.
 */

export type FacetKey = "jewelryType" | "occasion" | "metal" | "style";

export type Facet = {
  key: FacetKey;
  /** Section label shown above the chips. */
  label: string;
  /** One-line, quiz-style prompt under the label. */
  hint: string;
  options: readonly string[];
};

export const FACETS: readonly Facet[] = [
  {
    key: "jewelryType",
    label: "Jewelry Type",
    hint: "What are you dreaming of?",
    options: ["Ring", "Necklace", "Earrings", "Bracelet", "Maang Tikka", "Set"],
  },
  {
    key: "occasion",
    label: "Occasion",
    hint: "Where will it shine?",
    options: ["Wedding", "Engagement", "Everyday", "Statement"],
  },
  {
    key: "metal",
    label: "Metal",
    hint: "Pick your palette.",
    options: ["18k Gold", "22k Gold", "Rose Gold", "White Gold"],
  },
  {
    key: "style",
    label: "Style",
    hint: "Your aesthetic.",
    options: ["Polki", "Jadau", "Modern", "Minimalist"],
  },
] as const;

/** Selected options per facet. Empty array = facet not constraining results. */
export type FilterState = Record<FacetKey, string[]>;

export const EMPTY_FILTERS: FilterState = {
  jewelryType: [],
  occasion: [],
  metal: [],
  style: [],
};

/**
 * Within a facet the selections are OR-ed (Ring **or** Necklace); across facets
 * they are AND-ed (a Ring **and** for a Wedding). An empty selection passes.
 */
function facetMatches(selected: string[], itemValues: string[]): boolean {
  if (selected.length === 0) return true;
  return selected.some((value) => itemValues.includes(value));
}

export function itemMatchesFilters(
  item: InspirationItem,
  filters: FilterState,
): boolean {
  return (
    facetMatches(
      filters.jewelryType,
      item.jewelryType ? [item.jewelryType] : [],
    ) &&
    facetMatches(filters.occasion, item.occasions) &&
    facetMatches(filters.metal, item.metals) &&
    facetMatches(filters.style, item.styles)
  );
}

export function filterDeck(
  deck: InspirationItem[],
  filters: FilterState,
): InspirationItem[] {
  return deck.filter((item) => itemMatchesFilters(item, filters));
}

export function totalSelected(filters: FilterState): number {
  return FACETS.reduce((sum, facet) => sum + filters[facet.key].length, 0);
}

/** Human-readable one-liner for the lead record, e.g. "Ring/Necklace · Wedding". */
export function summarizeFilters(filters: FilterState): string {
  const parts = FACETS.map((facet) =>
    filters[facet.key].length > 0 ? filters[facet.key].join("/") : null,
  ).filter(Boolean) as string[];
  return parts.length > 0 ? parts.join(" · ") : "No filters — full catalogue";
}

/**
 * Maps free-text native material/category strings (from brand JSON-LD or stock
 * metadata) onto our structured facets. Brand structured data wins over CLIP
 * zero-shot tags on conflict (it's authoritative), so the pipeline applies
 * these before falling back to the worker's guesses.
 *
 * Intentionally simple substring rules — the review gate catches the long tail.
 */

type FacetGuess = { metals: string[]; stones: string[] };

const METAL_RULES: Array<[RegExp, string]> = [
  [/rose\s*gold|pink\s*gold/i, "Rose Gold"],
  [/white\s*gold/i, "White Gold"],
  [/22\s*k|22kt|22 ?karat/i, "22k Gold"],
  [/18\s*k|18kt|18 ?karat/i, "18k Gold"],
  [/14\s*k|14kt|14 ?karat/i, "18k Gold"], // nearest supported facet
  [/platinum/i, "White Gold"], // nearest supported facet
  [/(^|[^a-z])gold([^a-z]|$)/i, "18k Gold"], // generic gold → default karat
  [/gold\s*vermeil|vermeil/i, "18k Gold"],
  [/sterling\s*silver|silver/i, "White Gold"], // nearest supported facet
];

const STONE_RULES: Array<[RegExp, string]> = [
  [/lab[-\s]*grown\s*diamond|diamond/i, "Diamond"],
  [/emerald/i, "Emerald"],
  [/ruby/i, "Ruby"],
  [/sapphire/i, "Sapphire"],
  [/pearl/i, "Pearl"],
  [/polki/i, "Polki Diamond"],
  [/uncut/i, "Uncut Diamond"],
];

function applyRules(text: string, rules: Array<[RegExp, string]>): string[] {
  const out = new Set<string>();
  for (const [re, label] of rules) {
    if (re.test(text)) out.add(label);
  }
  return [...out];
}

/** Map a native material (and optionally category) string onto facets. */
export function mapMaterial(
  nativeMaterial: string | null,
  nativeCategory: string | null = null,
): FacetGuess {
  const haystack = [nativeMaterial, nativeCategory].filter(Boolean).join(" ");
  if (!haystack) return { metals: [], stones: [] };
  return {
    metals: applyRules(haystack, METAL_RULES),
    stones: applyRules(haystack, STONE_RULES),
  };
}

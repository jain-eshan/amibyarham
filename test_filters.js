/**
 * Test the filter matching logic against actual database data
 */

// Sample of actual database data
const items = [
  {
    id: "3691f475-65bd-4b55-a848-4b6e574b1a85",
    jewelryType: "Bracelet",
    metals: ["18k Gold", "Sterling Silver", "Rose Gold", "White Gold"],
    stones: ["Diamond", "Uncut Diamond"],
    styles: ["Modern", "Statement"],
    occasions: ["Statement", "Engagement", "Everyday"],
  },
  {
    id: "5ccdd2db-2761-4b0d-85ad-e037ef7157d3",
    jewelryType: "Ring",
    metals: ["18k Gold"],
    stones: ["Diamond"],
    styles: ["Minimalist", "Modern"],
    occasions: ["Engagement", "Everyday"],
  },
  {
    id: "38dbd1bc-8347-4b4b-9af4-85f542b0b9dd",
    jewelryType: "Necklace",
    metals: ["Platinum"],
    stones: ["Diamond"],
    styles: ["Art Deco", "Vintage"],
    occasions: ["Engagement"],
  },
  {
    id: "e207c92f-00cc-4274-80f2-dfbd0bd485ea",
    jewelryType: "Bracelet",
    metals: ["18k Gold"],
    stones: ["Emerald"],
    styles: ["Statement"],
    occasions: ["Wedding", "Statement"],
  },
  {
    id: "4f5ef914-d8cd-4732-9e7a-62b26987c783",
    jewelryType: "Earrings",
    metals: ["Rose Gold"],
    stones: ["Pearl"],
    styles: ["Modern"],
    occasions: ["Everyday", "Wedding"],
  },
  {
    id: "aa3040d5-459d-4da2-83f2-f32a5661a012",
    jewelryType: "Necklace",
    metals: ["White Gold"],
    stones: [],
    styles: ["Minimalist"],
    occasions: ["Everyday"],
  },
  {
    id: "6ace4bb8-c09f-4fe0-b949-0991c4e10513",
    jewelryType: "Ring",
    metals: ["Sterling Silver"],
    stones: ["Sapphire"],
    styles: [],
    occasions: ["Everyday", "Engagement", "Statement", "Wedding"],
  },
  {
    // Empty CLIP tags - common in current data
    id: "144c25ae-a34c-4c44-bd7a-cb789f0e4f8e",
    jewelryType: "Bracelet",
    metals: [],
    stones: [],
    styles: [],
    occasions: [],
  },
];

// Filter matching logic from filters.ts
function chipMatches(selected, itemValues) {
  if (selected.length === 0) return true;
  return selected.some((value) => itemValues.includes(value));
}

function branchMatches(branch, stones) {
  if (!branch) return true;
  const hasDiamond = stones.some((s) => s.toLowerCase().includes("diamond"));
  return branch === "diamonds" ? hasDiamond : !hasDiamond;
}

function itemMatchesFilters(item, filters) {
  return (
    chipMatches(filters.jewelryType, item.jewelryType ? [item.jewelryType] : []) &&
    chipMatches(filters.metalColor, item.metalColors || []) &&
    chipMatches(filters.occasion, item.occasions) &&
    chipMatches(filters.style, item.styles) &&
    branchMatches(filters.branch, item.stones)
  );
}

function filterDeck(deck, filters) {
  return deck.filter((item) => itemMatchesFilters(item, filters));
}

// Test scenarios
console.log("=== FILTER TEST RESULTS ===\n");

const tests = [
  {
    name: "Step 1: Ring only",
    filters: { jewelryType: ["Ring"], metalColor: [], occasion: [], style: [], branch: null },
  },
  {
    name: "Step 1: Bracelet only",
    filters: { jewelryType: ["Bracelet"], metalColor: [], occasion: [], style: [], branch: null },
  },
  {
    name: "Step 1: Ring + Bracelet",
    filters: { jewelryType: ["Ring", "Bracelet"], metalColor: [], occasion: [], style: [], branch: null },
  },
  {
    name: "Step 2: Diamonds branch (has Diamond in stones)",
    filters: { jewelryType: [], metalColor: [], occasion: [], style: [], branch: "diamonds" },
  },
  {
    name: "Step 2: Gold-only branch (no Diamond in stones)",
    filters: { jewelryType: [], metalColor: [], occasion: [], style: [], branch: "gold-only" },
  },
  {
    name: "Step 3: Ring + Diamonds + Minimalist style",
    filters: { jewelryType: ["Ring"], metalColor: [], occasion: [], style: ["Minimalist"], branch: "diamonds" },
  },
  {
    name: "Step 3: Bracelet + Diamonds + Statement style",
    filters: { jewelryType: ["Bracelet"], metalColor: [], occasion: ["Statement"], style: [], branch: "diamonds" },
  },
  {
    name: "Step 3: Necklace + Diamonds + Engagement occasion",
    filters: { jewelryType: ["Necklace"], metalColor: [], occasion: ["Engagement"], style: [], branch: "diamonds" },
  },
  {
    name: "Step 3: All items with Engagement occasion",
    filters: { jewelryType: [], metalColor: [], occasion: ["Engagement"], style: [], branch: null },
  },
  {
    name: "Step 3: All items with Everyday occasion",
    filters: { jewelryType: [], metalColor: [], occasion: ["Everyday"], style: [], branch: null },
  },
];

tests.forEach((test) => {
  const matches = filterDeck(items, test.filters);
  console.log(`✓ ${test.name}`);
  console.log(`  Matches: ${matches.length}/${items.length}`);
  matches.forEach((m) => {
    console.log(`    - ${m.jewelryType} (${m.metals.join(", ") || "no metals"}) [${m.stones.join(", ") || "no stones"}]`);
  });
  console.log();
});

console.log("=== CRITICAL ISSUE ===");
console.log("Many items have EMPTY CLIP tags (metals, stones, styles, occasions).");
console.log("Out of 25 approved items, only ~7 have complete metadata from CLIP.");
console.log("This suggests the CLIP worker integration failed for most items.");

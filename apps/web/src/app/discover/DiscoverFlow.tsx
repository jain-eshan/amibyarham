"use client";

import { useMemo, useState } from "react";

import {
  EMPTY_FILTERS,
  filterDeck,
  summarizeFilters,
  type FilterState,
} from "@/lib/filters";
import type { InspirationItem } from "@/lib/inspiration";

import { FilterScreen } from "./FilterScreen";
import { SwipeEngine } from "./SwipeEngine";

/**
 * Drives the Filter-First flow: the filter screen runs first and, on "Show me
 * pieces", hands a pre-filtered deck to the swipe engine. Filter state lives
 * here so "Adjust filters" can round-trip back without losing selections.
 */
export function DiscoverFlow({ deck }: { deck: InspirationItem[] }) {
  const [phase, setPhase] = useState<"filter" | "swipe">("filter");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const filteredDeck = useMemo(
    () => filterDeck(deck, filters),
    [deck, filters],
  );

  if (phase === "filter") {
    return (
      <FilterScreen
        deck={deck}
        filters={filters}
        onChange={setFilters}
        onStart={() => setPhase("swipe")}
      />
    );
  }

  return (
    <SwipeEngine
      key={summarizeFilters(filters)}
      deck={filteredDeck}
      filterSummary={summarizeFilters(filters)}
      onAdjustFilters={() => setPhase("filter")}
    />
  );
}

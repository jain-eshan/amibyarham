"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

import { Button } from "@/components/Button";
import {
  FACETS,
  filterDeck,
  totalSelected,
  type FacetKey,
  type FilterState,
} from "@/lib/filters";
import type { InspirationItem } from "@/lib/inspiration";

/**
 * Preference-quiz style filter screen. Full-screen, cream background, every
 * facet multi-select. The match count on the CTA recomputes on every toggle —
 * instant because we filter the already-loaded deck in the browser — which is
 * the interaction that makes the screen feel responsive and builds anticipation
 * for the swipe session.
 */
export function FilterScreen({
  deck,
  filters,
  onChange,
  onStart,
}: {
  deck: InspirationItem[];
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onStart: () => void;
}) {
  const matchCount = useMemo(
    () => filterDeck(deck, filters).length,
    [deck, filters],
  );
  const selectedCount = totalSelected(filters);
  const hasSelection = selectedCount > 0;

  const toggle = (key: FacetKey, option: string) => {
    const current = filters[key];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    onChange({ ...filters, [key]: next });
  };

  const clearAll = () =>
    onChange({ jewelryType: [], occasion: [], metal: [], style: [] });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-canvas">
      {/* Scroll region — padded so the sticky CTA never covers the last facet */}
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 pb-40 pt-10 md:pt-14">
        <header>
          <p className="caption-uppercase text-muted">Path B · Discover</p>
          <h1
            className="display-lg mt-3 text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What are you{" "}
            <em className="not-italic text-primary">dreaming of</em>?
          </h1>
          <p className="mt-4 max-w-md text-body">
            Pick as many as you like — this just curates your deck. Leave a row
            untouched to keep it open. Tweak anything and the count below updates
            live.
          </p>
        </header>

        <div className="mt-10 space-y-9">
          {FACETS.map((facet) => (
            <fieldset key={facet.key}>
              <div className="flex items-baseline justify-between gap-4">
                <legend className="caption-uppercase text-ink">
                  {facet.label}
                </legend>
                {filters[facet.key].length > 0 && (
                  <span className="text-xs text-primary">
                    {filters[facet.key].length} selected
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">{facet.hint}</p>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {facet.options.map((option) => {
                  const active = filters[facet.key].includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(facet.key, option)}
                      className={[
                        "rounded-full border px-4 py-2 text-sm transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                        active
                          ? "border-primary bg-primary text-on-primary shadow-[0_6px_18px_-8px_rgba(204,120,92,0.7)]"
                          : "border-hairline bg-surface-soft text-body hover:border-primary/50 hover:bg-surface-card",
                      ].join(" ")}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {hasSelection && (
          <button
            type="button"
            onClick={clearAll}
            className="mt-9 text-sm text-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Sticky CTA — the live count lives here */}
      <div className="sticky bottom-0 border-t border-hairline bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-6 py-4">
          <div aria-live="polite" className="min-w-0">
            <p className="flex items-baseline gap-1.5">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={matchCount}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="text-2xl text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {matchCount}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm text-muted">
                {matchCount === 1 ? "piece matches" : "pieces match"}
              </span>
            </p>
            {matchCount === 0 && (
              <p className="text-xs text-primary">
                Nothing fits all of those — loosen a filter.
              </p>
            )}
          </div>

          <Button
            onClick={onStart}
            variant="primary"
            size="lg"
            disabled={matchCount === 0}
            className="shrink-0"
          >
            {hasSelection ? "Show me pieces →" : `Show me all ${matchCount} →`}
          </Button>
        </div>
      </div>
    </div>
  );
}

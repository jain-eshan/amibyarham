"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { Button } from "@/components/Button";
import {
  BUDGET_TIERS,
  CARAT_BRACKETS,
  CERTIFICATIONS,
  DIAMOND_CLARITY,
  DIAMOND_COLORS,
  DIAMOND_CUT,
  DIAMOND_OCCASIONS,
  DIAMOND_SHAPES,
  DIAMOND_STYLES,
  GOLD_OCCASIONS,
  GOLD_STYLES,
  JEWELRY_TYPES,
  KARATAGE,
  METAL_COLORS,
  WEIGHT_RANGES,
  filterDeck,
  resetBranchFacets,
  totalSelected,
  type Branch,
  type BudgetTier,
  type CaratRange,
  type FilterState,
} from "@/lib/filters";
import type { InspirationItem } from "@/lib/inspiration";

/**
 * 3-step Smart Onboarding for /discover.
 *
 *   Step 1 — Core Intent: jewelry type + budget tier (everyone).
 *   Step 2 — The Gate:    diamonds vs. gold-only — branches the next screen.
 *   Step 3 — Tailored Deep Dive: branch-specific facets only.
 *
 * The sticky CTA at the bottom shows live "N pieces match" recomputed from
 * filterDeck — the same pattern as the previous single-screen filter.
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
  // Step is internal to the screen so DiscoverFlow doesn't need to know about
  // it. Filter state itself lives in DiscoverFlow so back-from-swipe preserves
  // selections.
  const initialStep: 1 | 2 | 3 = filters.branch
    ? 3
    : filters.jewelryType.length || filters.budgetTier
      ? 2
      : 1;
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [direction, setDirection] = useState<1 | -1>(1);

  const matchCount = useMemo(
    () => filterDeck(deck, filters).length,
    [deck, filters],
  );
  const selectedCount = totalSelected(filters);

  const go = (next: 1 | 2 | 3) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const step1Complete =
    filters.jewelryType.length > 0 && filters.budgetTier !== null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-canvas">
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 pb-40 pt-10 md:pt-14">
        <StepHeader step={step} onBack={step > 1 ? () => go((step - 1) as 1 | 2) : undefined} />

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            className="mt-10"
          >
            {step === 1 && (
              <Step1
                filters={filters}
                onChange={onChange}
              />
            )}
            {step === 2 && (
              <Step2
                filters={filters}
                onPick={(branch) => {
                  // Picking a branch wipes out any deep-dive selections from
                  // the *other* branch so they don't silently constrain the
                  // deck after the gate flip.
                  onChange({
                    ...resetBranchFacets(filters),
                    branch,
                  });
                  go(3);
                }}
              />
            )}
            {step === 3 && (
              <Step3
                filters={filters}
                onChange={onChange}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 border-t border-hairline bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-6 py-4">
          <CtaCount
            step={step}
            matchCount={matchCount}
            selectedCount={selectedCount}
          />

          {step === 1 && (
            <Button
              onClick={() => go(2)}
              variant="primary"
              size="lg"
              disabled={!step1Complete}
              className="shrink-0"
            >
              Continue →
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={onStart}
              variant="primary"
              size="lg"
              disabled={matchCount === 0}
              className="shrink-0"
            >
              {selectedCount > 0
                ? `Show me pieces →`
                : `Show me all ${matchCount} →`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function StepHeader({
  step,
  onBack,
}: {
  step: 1 | 2 | 3;
  onBack?: () => void;
}) {
  return (
    <header>
      <div className="flex items-center justify-between">
        <p className="caption-uppercase text-muted">
          Path B · Step {step} of 3
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="caption-uppercase text-muted transition-colors hover:text-primary"
          >
            ← Back
          </button>
        )}
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={[
              "h-1 flex-1 rounded-full transition-colors",
              n <= step ? "bg-primary" : "bg-surface-card",
            ].join(" ")}
          />
        ))}
      </div>
    </header>
  );
}

function CtaCount({
  step,
  matchCount,
  selectedCount,
}: {
  step: 1 | 2 | 3;
  matchCount: number;
  selectedCount: number;
}) {
  if (step === 2) {
    return (
      <p className="text-sm text-muted">
        Pick a path to keep going — you can change it later.
      </p>
    );
  }
  if (step === 1) {
    return (
      <p className="text-sm text-muted">
        {selectedCount === 0
          ? "Pick a piece + budget to continue."
          : "Looking good. Next: the gate."}
      </p>
    );
  }
  return (
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
  );
}

// ─── Step 1: Core Intent ─────────────────────────────────────────────────────

function Step1({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const toggleType = (value: string) => {
    const current = filters.jewelryType;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, jewelryType: next });
  };

  const setBudget = (tier: BudgetTier) => {
    onChange({
      ...filters,
      budgetTier: filters.budgetTier === tier ? null : tier,
    });
  };

  return (
    <div className="space-y-12">
      <div>
        <h1
          className="display-lg text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What are you{" "}
          <em className="not-italic text-primary">looking to create</em>?
        </h1>
        <p className="mt-3 max-w-md text-body">
          Pick as many shapes as you&rsquo;d love to see. We&rsquo;ll show you
          pieces across all of them.
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {JEWELRY_TYPES.map((type) => (
            <Chip
              key={type}
              active={filters.jewelryType.includes(type)}
              onClick={() => toggleType(type)}
            >
              {type}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <h2
          className="display-sm text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What is your{" "}
          <em className="not-italic text-primary">estimated budget</em>?
        </h2>
        <p className="mt-3 max-w-md text-body">
          One tier helps us anchor the deck. You can always sway up or down.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BUDGET_TIERS.map((tier) => {
            const active = filters.budgetTier === tier.key;
            return (
              <button
                key={tier.key}
                type="button"
                onClick={() => setBudget(tier.key)}
                aria-pressed={active}
                className={[
                  "rounded-2xl border px-5 py-4 text-left transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "border-primary bg-primary text-on-primary shadow-[0_10px_24px_-12px_rgba(204,120,92,0.7)]"
                    : "border-hairline bg-surface-soft text-body hover:border-primary/50",
                ].join(" ")}
              >
                <p
                  className="text-base"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {tier.label}
                </p>
                <p
                  className={[
                    "mt-1 text-sm",
                    active ? "text-on-primary/85" : "text-muted",
                  ].join(" ")}
                >
                  {tier.hint}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: The Gate ────────────────────────────────────────────────────────

function Step2({
  filters,
  onPick,
}: {
  filters: FilterState;
  onPick: (branch: Branch) => void;
}) {
  return (
    <div>
      <h1
        className="display-lg text-ink"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Designing with{" "}
        <em className="not-italic text-primary">diamonds</em>, or keeping it
        classic with <em className="not-italic text-primary">gold only</em>?
      </h1>
      <p className="mt-4 max-w-md text-body">
        This decides the next set of questions — diamond specs, or pure gold
        craftsmanship.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <GateCard
          label="Gold + Diamonds"
          glyph="◆"
          description="Show me shapes, carats and settings."
          active={filters.branch === "diamonds"}
          onClick={() => onPick("diamonds")}
        />
        <GateCard
          label="Gold Only"
          glyph="❂"
          description="Pure gold — karat, weight and silhouette."
          active={filters.branch === "gold-only"}
          onClick={() => onPick("gold-only")}
        />
      </div>
    </div>
  );
}

function GateCard({
  label,
  glyph,
  description,
  active,
  onClick,
}: {
  label: string;
  glyph: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "group flex aspect-[5/4] flex-col items-center justify-center rounded-2xl border p-8 text-center transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        active
          ? "border-primary bg-primary text-on-primary shadow-[0_18px_40px_-18px_rgba(204,120,92,0.7)]"
          : "border-hairline bg-surface-soft text-ink hover:border-primary hover:bg-surface-card",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={active ? "text-on-primary" : "text-primary"}
        style={{ fontFamily: "var(--font-display)", fontSize: "4rem" }}
      >
        {glyph}
      </span>
      <p
        className="mt-4 text-xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </p>
      <p
        className={[
          "mt-2 max-w-[22ch] text-sm",
          active ? "text-on-primary/85" : "text-muted",
        ].join(" ")}
      >
        {description}
      </p>
    </button>
  );
}

// ─── Step 3: Tailored Deep Dive ──────────────────────────────────────────────

function Step3({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  if (filters.branch === "diamonds") {
    return <DiamondBranchPanel filters={filters} onChange={onChange} />;
  }
  if (filters.branch === "gold-only") {
    return <GoldBranchPanel filters={filters} onChange={onChange} />;
  }
  // Defensive fallback — shouldn't be reachable because Step 2 always sets a
  // branch before advancing.
  return null;
}

function DiamondBranchPanel({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const toggle = (
    key: "metalColor" | "diamondShape" | "style" | "occasion" |
         "diamondColor" | "diamondClarity" | "diamondCut" | "certification",
    value: string,
  ) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const pickCarat = (bracket: CaratRange) => {
    const same =
      filters.caratRange?.min === bracket.min &&
      filters.caratRange?.max === bracket.max;
    onChange({ ...filters, caratRange: same ? null : bracket });
  };

  return (
    <div className="space-y-9">
      <header>
        <h1
          className="display-lg text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The <em className="not-italic text-primary">Diamond Explorer</em>
        </h1>
        <p className="mt-3 max-w-md text-body">
          Just the basics — shape and carat carry most of the look. Tweak the
          rest only if it matters to you.
        </p>
      </header>

      <Fieldset label="Metal Color" hint="Pick your palette.">
        <ChipRow
          options={METAL_COLORS}
          selected={filters.metalColor}
          onToggle={(v) => toggle("metalColor", v)}
        />
      </Fieldset>

      <Fieldset label="Diamond Shape" hint="The silhouette of the stone.">
        <ChipRow
          options={DIAMOND_SHAPES}
          selected={filters.diamondShape}
          onToggle={(v) => toggle("diamondShape", v)}
        />
      </Fieldset>

      <Fieldset label="Carat Weight" hint="A range, not a fixed size.">
        <ChipRow
          options={CARAT_BRACKETS.map((b) => b.label)}
          selected={
            filters.caratRange
              ? [
                  CARAT_BRACKETS.find(
                    (b) =>
                      b.min === filters.caratRange!.min &&
                      b.max === filters.caratRange!.max,
                  )?.label ?? "",
                ].filter(Boolean)
              : []
          }
          onToggle={(label) => {
            const bracket = CARAT_BRACKETS.find((b) => b.label === label);
            if (bracket) pickCarat({ min: bracket.min, max: bracket.max });
          }}
        />
      </Fieldset>

      <Fieldset label="Style" hint="The setting language.">
        <ChipRow
          options={DIAMOND_STYLES}
          selected={filters.style}
          onToggle={(v) => toggle("style", v)}
        />
      </Fieldset>

      <Fieldset label="Occasion" hint="Where will it shine?">
        <ChipRow
          options={DIAMOND_OCCASIONS}
          selected={filters.occasion}
          onToggle={(v) => toggle("occasion", v)}
        />
      </Fieldset>

      <details className="group rounded-xl border border-hairline bg-surface-soft px-5 py-4">
        <summary className="caption-uppercase flex cursor-pointer items-center justify-between text-ink">
          Advanced Diamond Specs
          <span className="text-xs text-muted transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <p className="mt-2 text-sm text-muted">
          Most shoppers skip these — open only if FL vs. VVS2 matters to you.
        </p>

        <div className="mt-6 space-y-7">
          <Fieldset label="Color" hint="D (colorless) → K (warm).">
            <ChipRow
              options={DIAMOND_COLORS}
              selected={filters.diamondColor}
              onToggle={(v) => toggle("diamondColor", v)}
            />
          </Fieldset>
          <Fieldset label="Clarity" hint="Inclusion grade.">
            <ChipRow
              options={DIAMOND_CLARITY}
              selected={filters.diamondClarity}
              onToggle={(v) => toggle("diamondClarity", v)}
            />
          </Fieldset>
          <Fieldset label="Cut" hint="Light performance.">
            <ChipRow
              options={DIAMOND_CUT}
              selected={filters.diamondCut}
              onToggle={(v) => toggle("diamondCut", v)}
            />
          </Fieldset>
          <Fieldset label="Certification" hint="Lab grading body.">
            <ChipRow
              options={CERTIFICATIONS}
              selected={filters.certification}
              onToggle={(v) => toggle("certification", v)}
            />
          </Fieldset>
        </div>
      </details>
    </div>
  );
}

function GoldBranchPanel({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const toggle = (
    key: "karatage" | "metalColor" | "weightRange" | "style" | "occasion",
    value: string,
  ) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="space-y-9">
      <header>
        <h1
          className="display-lg text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The <em className="not-italic text-primary">Fine Gold</em> path
        </h1>
        <p className="mt-3 max-w-md text-body">
          Pure gold craft — choose karatage, color and the silhouette that
          speaks to you.
        </p>
      </header>

      <Fieldset label="Karatage" hint="Gold purity.">
        <ChipRow
          options={KARATAGE}
          selected={filters.karatage}
          onToggle={(v) => toggle("karatage", v)}
        />
      </Fieldset>

      <Fieldset label="Metal Color" hint="Pick your palette.">
        <ChipRow
          options={METAL_COLORS}
          selected={filters.metalColor}
          onToggle={(v) => toggle("metalColor", v)}
        />
      </Fieldset>

      <Fieldset label="Weight Range" hint="Gross weight of the piece.">
        <ChipRow
          options={WEIGHT_RANGES}
          selected={filters.weightRange}
          onToggle={(v) => toggle("weightRange", v)}
        />
      </Fieldset>

      <Fieldset label="Style" hint="The craft language.">
        <ChipRow
          options={GOLD_STYLES}
          selected={filters.style}
          onToggle={(v) => toggle("style", v)}
        />
      </Fieldset>

      <Fieldset label="Occasion" hint="Where will it shine?">
        <ChipRow
          options={GOLD_OCCASIONS}
          selected={filters.occasion}
          onToggle={(v) => toggle("occasion", v)}
        />
      </Fieldset>
    </div>
  );
}

// ─── Shared primitives ───────────────────────────────────────────────────────

function Fieldset({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="caption-uppercase text-ink">{label}</legend>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

function ChipRow({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => (
        <Chip
          key={option}
          active={selected.includes(option)}
          onClick={() => onToggle(option)}
        >
          {option}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "rounded-full border px-4 py-2 text-sm transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        active
          ? "border-primary bg-primary text-on-primary shadow-[0_6px_18px_-8px_rgba(204,120,92,0.7)]"
          : "border-hairline bg-surface-soft text-body hover:border-primary/50 hover:bg-surface-card",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// Directional slide between steps. Matches the convention in SubmitForm.
const slideVariants = {
  enter: (direction: 1 | -1) => ({
    x: direction === 1 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 1 | -1) => ({
    x: direction === 1 ? -40 : 40,
    opacity: 0,
  }),
};

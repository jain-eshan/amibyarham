"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useDrag } from "@use-gesture/react";
import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { InspirationItem } from "@/lib/inspiration";

// ─── Contact schema ──────────────────────────────────────────────────────────

const contactSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  whatsapp: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z
    .union([z.string().email("Enter a valid email"), z.literal("")])
    .optional(),
});

type ContactData = z.infer<typeof contactSchema>;

// ─── Tuning ──────────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 110; // px past which a release commits
const FLING_VELOCITY = 0.4; // px/ms that also commits regardless of distance

// Re-ranking thresholds. Wait for ≥5 swipes (with ≥1 like) before the first
// recommendation call so the taste vector isn't noise. After that, refresh
// every 5 further swipes so the deck keeps adapting as the user signals more.
const RERANK_INITIAL_SWIPES = 5;
const RERANK_REFRESH_EVERY = 5;

const inputCls =
  "w-full rounded-lg border border-hairline bg-canvas px-4 py-3 text-ink " +
  "placeholder:text-muted/50 outline-none transition " +
  "focus:border-primary focus:ring-1 focus:ring-primary";

type HistoryEntry = { item: InspirationItem; liked: boolean };

export function SwipeEngine({
  deck: initialDeck,
  filterSummary,
  onAdjustFilters,
}: {
  deck: InspirationItem[];
  /** Human-readable filter recap, recorded with the submitted board. */
  filterSummary?: string;
  /** Returns to the filter screen, preserving the user's selections. */
  onAdjustFilters?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [favorites, setFavorites] = useState<InspirationItem[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [phase, setPhase] = useState<"swipe" | "review" | "done">("swipe");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deck, setDeck] = useState<InspirationItem[]>(initialDeck);

  // Stable per-mount session id so swipe_events / recommend calls correlate.
  // crypto.randomUUID is widely available in modern browsers; gracefully fall
  // back to a non-uuid string if it isn't (the event logger silently drops it).
  const sessionIdRef = useRef<string>("");
  if (!sessionIdRef.current) {
    sessionIdRef.current =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s-${Math.random().toString(36).slice(2)}-${Date.now()}`;
  }

  // Re-rank bookkeeping: decisions accumulated per session, plus the count of
  // swipes at the last successful /api/recommend call so we can refresh on a
  // fixed cadence rather than every swipe.
  const likedIdsRef = useRef<string[]>([]);
  const dislikedIdsRef = useRef<string[]>([]);
  const seenIdsRef = useRef<string[]>([]);
  const totalSwipesRef = useRef(0);
  const lastRerankAtRef = useRef(0);
  const isRerankingRef = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const likeOpacity = useTransform(x, [40, 130], [0, 1]);
  const nopeOpacity = useTransform(x, [-40, -130], [0, 1]);

  const atEnd = index >= deck.length;
  const topCard = deck[index];

  // ─── Recommendation splice ────────────────────────────────────────────────
  // Fire after a configurable swipe budget (with ≥1 like) and splice the ranked
  // tail into deck[index+1 …]. De-dupes against already-seen ids so the user
  // never re-sees a card mid-flow. Fully non-blocking; failures are silent.

  const maybeRerank = useCallback(async () => {
    if (isRerankingRef.current) return;
    if (likedIdsRef.current.length === 0) return;
    const total = totalSwipesRef.current;
    if (total < RERANK_INITIAL_SWIPES) return;
    if (total - lastRerankAtRef.current < RERANK_REFRESH_EVERY) return;

    isRerankingRef.current = true;
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          likedIds: likedIdsRef.current,
          dislikedIds: dislikedIdsRef.current,
          seenIds: seenIdsRef.current,
          limit: 30,
        }),
      });
      if (!res.ok) return;
      const { items } = (await res.json()) as {
        items: Array<Omit<InspirationItem, "glyph" | "gradient" | "isFromDb">>;
      };
      if (!items || items.length === 0) return;

      const seenSet = new Set(seenIdsRef.current);
      const ranked: InspirationItem[] = items
        .filter((it) => !seenSet.has(it.id))
        .map((it) => ({
          ...it,
          glyph: "✦",
          gradient:
            "linear-gradient(150deg, #efe9de 0%, #e8d8cc 55%, #cc785c 140%)",
          isFromDb: true,
        }));

      setDeck((current) => {
        const keepPrefix = current.slice(0, index + 1);
        const futureSeenIds = new Set([
          ...seenIdsRef.current,
          ...keepPrefix.map((c) => c.id),
        ]);
        const dedupedTail = ranked.filter((it) => !futureSeenIds.has(it.id));
        // Preserve any not-yet-shown cards we haven't recommended over,
        // appended after the ranked block so the user doesn't run dry.
        const remainingOld = current
          .slice(index + 1)
          .filter((it) => !dedupedTail.some((r) => r.id === it.id));
        return [...keepPrefix, ...dedupedTail, ...remainingOld];
      });
      lastRerankAtRef.current = totalSwipesRef.current;
    } catch {
      // Silent — re-rank is best-effort.
    } finally {
      isRerankingRef.current = false;
    }
  }, [index]);

  // ─── Commit a decision and advance ────────────────────────────────────────

  const commit = useCallback(
    (liked: boolean) => {
      const item = deck[index];
      if (!item) return;
      if (liked) setFavorites((prev) => [...prev, item]);
      setHistory((prev) => [...prev, { item, liked }]);

      // Track taste signal for /api/recommend (DB-backed cards only — fallback
      // ids aren't uuids and have no embedding).
      if (item.isFromDb) {
        if (liked) likedIdsRef.current.push(item.id);
        else dislikedIdsRef.current.push(item.id);
        seenIdsRef.current.push(item.id);
      }
      totalSwipesRef.current += 1;

      // Fire-and-forget event log. Never blocks the swipe.
      if (item.isFromDb) {
        void fetch("/api/swipe-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            imageId: item.id,
            decision: liked ? "like" : "pass",
            position: index,
          }),
        }).catch(() => {});
      }

      setIndex((i) => i + 1);
      x.set(0);
      void maybeRerank();
    },
    [deck, index, x, maybeRerank],
  );

  const flingAndCommit = useCallback(
    (liked: boolean) => {
      const target = (liked ? 1 : -1) * (typeof window !== "undefined" ? window.innerWidth : 800);
      animate(x, target, {
        type: "tween",
        duration: 0.28,
        ease: [0.32, 0, 0.67, 0],
        onComplete: () => commit(liked),
      });
    },
    [x, commit],
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1]!;
      if (last.liked) {
        setFavorites((favs) => favs.filter((f) => f.id !== last.item.id));
      }
      // Roll back the taste-signal refs so a re-rank after an undo reflects the
      // user's revised intent, not the discarded swipe.
      if (last.item.isFromDb) {
        const popIfMatches = (arr: string[]) => {
          const i = arr.lastIndexOf(last.item.id);
          if (i !== -1) arr.splice(i, 1);
        };
        popIfMatches(last.liked ? likedIdsRef.current : dislikedIdsRef.current);
        popIfMatches(seenIdsRef.current);
      }
      totalSwipesRef.current = Math.max(0, totalSwipesRef.current - 1);

      setIndex((i) => Math.max(0, i - 1));
      x.set(0);
      return prev.slice(0, -1);
    });
  }, [x]);

  // ─── Gesture binding (drives the framer-motion x value) ───────────────────

  const bind = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx], last }) => {
      if (atEnd) return;
      if (active) {
        x.set(mx);
        return;
      }
      if (last) {
        const passedDistance = Math.abs(mx) > SWIPE_THRESHOLD;
        const passedVelocity = vx > FLING_VELOCITY;
        if (passedDistance || passedVelocity) {
          flingAndCommit(dx > 0 || (mx > 0 && passedVelocity));
        } else {
          animate(x, 0, { type: "spring", stiffness: 500, damping: 32 });
        }
      }
    },
    { filterTaps: true, axis: "x" },
  );

  // ─── Review / submit ──────────────────────────────────────────────────────
  // The board shows when the user submitted (done), tapped "review", or ran out
  // of cards. Derived rather than a render-time setState so there's no transient
  // double render.

  const showBoard = phase === "done" || phase === "review" || atEnd;

  if (showBoard) {
    return (
      <ReviewBoard
        favorites={favorites}
        phase={phase === "done" ? "done" : "review"}
        canResume={!atEnd}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onRemove={(id) => setFavorites((f) => f.filter((x) => x.id !== id))}
        onResume={() => {
          setSubmitError(null);
          x.set(0);
          setPhase("swipe");
        }}
        onRestart={() => {
          setIndex(0);
          setFavorites([]);
          setHistory([]);
          setSubmitError(null);
          setDeck(initialDeck);
          likedIdsRef.current = [];
          dislikedIdsRef.current = [];
          seenIdsRef.current = [];
          totalSwipesRef.current = 0;
          lastRerankAtRef.current = 0;
          x.set(0);
          setPhase("swipe");
        }}
        onSubmit={async (data) => {
          setIsSubmitting(true);
          setSubmitError(null);
          try {
            const supabase = getSupabaseBrowserClient();

            const { data: lead, error: leadError } = await supabase
              .from("leads")
              .insert({
                full_name: data.fullName,
                whatsapp_number: data.whatsapp,
                email: data.email || null,
              })
              .select("id")
              .single();
            if (leadError ?? !lead) {
              throw new Error(leadError?.message ?? "Failed to save your details");
            }

            const filterPrefix = filterSummary
              ? `Filters — ${filterSummary}. `
              : "";
            const summary =
              filterPrefix +
              (favorites.length > 0
                ? `Swipe board — ${favorites.length} favourite${favorites.length === 1 ? "" : "s"}: ` +
                  favorites
                    .map((f) => `${f.altText}${f.category ? ` (${f.category})` : ""}`)
                    .join("; ")
                : "Swipe board — no favourites selected");

            const { data: request, error: requestError } = await supabase
              .from("custom_requests")
              .insert({
                lead_id: lead.id,
                request_type: "swipe_board",
                design_notes: summary,
              })
              .select("id")
              .single();
            if (requestError ?? !request) {
              throw new Error(requestError?.message ?? "Failed to save your board");
            }

            const dbFavorites = favorites.filter((f) => f.isFromDb);
            if (dbFavorites.length > 0) {
              const { error: favError } = await supabase
                .from("request_favorite_items")
                .insert(
                  dbFavorites.map((f) => ({
                    request_id: request.id,
                    image_id: f.id,
                  })),
                );
              if (favError) throw new Error(favError.message);
            }

            fetch("/api/notify-submission", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fullName: data.fullName,
                whatsapp: data.whatsapp,
                email: data.email || undefined,
                requestType: "swipe_board",
                designNotes: summary,
                favoriteCount: favorites.length,
              }),
            }).catch(() => {});

            setPhase("done");
          } catch (err) {
            setSubmitError(
              err instanceof Error
                ? err.message
                : "Something went wrong — please try again.",
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    );
  }

  // ─── Swipe view ───────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {onAdjustFilters ? (
            <button
              type="button"
              onClick={onAdjustFilters}
              className="caption-uppercase text-muted transition-colors hover:text-primary"
            >
              ‹ Filters
            </button>
          ) : (
            <p className="caption-uppercase text-muted">Path B</p>
          )}
          <h1 className="display-sm mt-1 text-ink">Find your piece</h1>
          {filterSummary && filterSummary !== "No filters — full catalogue" && (
            <p className="mt-1 max-w-[16rem] truncate text-xs text-muted">
              {filterSummary}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl text-primary" style={{ fontFamily: "var(--font-display)" }}>
            {favorites.length}
          </p>
          <p className="caption-uppercase text-muted">Saved</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-surface-card">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(index / Math.max(deck.length, 1)) * 100}%` }}
        />
      </div>

      {/* Card stack */}
      <div className="relative mt-8 flex-1">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
          {/* Render up to 3 cards back-to-front */}
          {deck
            .slice(index, index + 3)
            .map((item, stackPos) => {
              const isTop = stackPos === 0;
              return isTop ? (
                <div
                  key={item.id}
                  {...bind()}
                  className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
                  style={{ touchAction: "none" }}
                >
                  <motion.div className="h-full w-full" style={{ x, rotate }}>
                    <Card item={item} likeOpacity={likeOpacity} nopeOpacity={nopeOpacity} />
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  key={item.id}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    scale: 1 - stackPos * 0.04,
                    y: stackPos * 14,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ zIndex: -stackPos }}
                >
                  <Card item={item} />
                </motion.div>
              );
            })
            .reverse()}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <CircleButton
          ariaLabel="Pass"
          onClick={() => !atEnd && flingAndCommit(false)}
          variant="pass"
        >
          ✕
        </CircleButton>
        <CircleButton
          ariaLabel="Undo last"
          onClick={undo}
          variant="undo"
          disabled={history.length === 0}
        >
          ↺
        </CircleButton>
        <CircleButton
          ariaLabel="Save to favourites"
          onClick={() => !atEnd && flingAndCommit(true)}
          variant="like"
        >
          ♥
        </CircleButton>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Swipe right to save, left to pass.{" "}
        {favorites.length > 0 && (
          <button
            type="button"
            onClick={() => setPhase("review")}
            className="text-primary underline underline-offset-4"
          >
            Review {favorites.length} saved →
          </button>
        )}
      </p>
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────

function Card({
  item,
  likeOpacity,
  nopeOpacity,
}: {
  item: InspirationItem;
  likeOpacity?: MotionValue<number>;
  nopeOpacity?: MotionValue<number>;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-[0_18px_50px_-20px_rgba(20,20,19,0.35)]">
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.altText}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: item.gradient }}
        >
          <span
            aria-hidden
            className="text-ink/25"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(6rem, 22vw, 11rem)" }}
          >
            {item.glyph}
          </span>
        </div>
      )}

      {/* Caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-5 pt-12">
        {item.category && (
          <p className="caption-uppercase text-on-dark/80">{item.category}</p>
        )}
        <p
          className="mt-1 text-on-dark"
          style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.2 }}
        >
          {item.altText}
        </p>
      </div>

      {/* Swipe affordance stamps */}
      {likeOpacity && (
        <motion.div
          style={{ opacity: likeOpacity }}
          className="pointer-events-none absolute left-5 top-5 -rotate-12 rounded-md border-2 border-success px-3 py-1 text-sm font-bold uppercase tracking-wider text-success"
        >
          Saved
        </motion.div>
      )}
      {nopeOpacity && (
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="pointer-events-none absolute right-5 top-5 rotate-12 rounded-md border-2 border-error px-3 py-1 text-sm font-bold uppercase tracking-wider text-error"
        >
          Pass
        </motion.div>
      )}
    </div>
  );
}

// ─── Circle control button ────────────────────────────────────────────────────

function CircleButton({
  children,
  ariaLabel,
  onClick,
  variant,
  disabled,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  onClick: () => void;
  variant: "pass" | "like" | "undo";
  disabled?: boolean;
}) {
  const styles: Record<typeof variant, string> = {
    pass: "border-hairline text-error hover:border-error hover:bg-error/5 h-14 w-14 text-xl",
    like: "border-hairline text-primary hover:border-primary hover:bg-primary/5 h-16 w-16 text-2xl",
    undo: "border-hairline text-muted hover:border-muted hover:bg-surface-card h-12 w-12 text-lg",
  };
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex items-center justify-center rounded-full border bg-canvas transition-all",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        styles[variant],
      ].join(" ")}
    >
      <span aria-hidden>{children}</span>
    </button>
  );
}

// ─── Review board + submission ────────────────────────────────────────────────

function ReviewBoard({
  favorites,
  phase,
  canResume,
  isSubmitting,
  submitError,
  onRemove,
  onResume,
  onRestart,
  onSubmit,
}: {
  favorites: InspirationItem[];
  phase: "review" | "done";
  canResume: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onRemove: (id: string) => void;
  onResume: () => void;
  onRestart: () => void;
  onSubmit: (data: ContactData) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactData>({ resolver: zodResolver(contactSchema) });

  const heading = useMemo(() => {
    if (phase === "done") return "Your board is on its way.";
    return favorites.length > 0
      ? "Your favourites board"
      : "You didn't save anything yet";
  }, [phase, favorites.length]);

  if (phase === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center px-6 text-center"
      >
        <span className="text-5xl text-primary">✦</span>
        <h2 className="display-lg mt-6 text-ink" style={{ fontFamily: "var(--font-display)" }}>
          {heading}
        </h2>
        <p className="mt-4 max-w-sm text-body">
          We&rsquo;ll review your {favorites.length} saved piece
          {favorites.length === 1 ? "" : "s"} and reach out on WhatsApp within 24
          hours.
        </p>
        <Button href="/" variant="secondary" size="lg" className="mt-10">
          Back to home →
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="display-md text-ink" style={{ fontFamily: "var(--font-display)" }}>
        {heading}
      </h1>

      {favorites.length === 0 ? (
        <div className="mt-6">
          <p className="text-body">
            Head back and swipe right on a few pieces you love — then send us the
            board.
          </p>
          <Button
            onClick={canResume ? onResume : onRestart}
            variant="primary"
            size="lg"
            className="mt-8"
          >
            ← Back to swiping
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-body">
            These caught your eye. Remove any that slipped in, then send us your
            board.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-hairline"
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.altText}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ background: item.gradient }}
                  >
                    <span
                      aria-hidden
                      className="text-ink/25"
                      style={{ fontFamily: "var(--font-display)", fontSize: "4rem" }}
                    >
                      {item.glyph}
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-2">
                  <p className="text-xs text-on-dark">{item.altText}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${item.altText}`}
                  onClick={() => onRemove(item.id)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-canvas/90 text-ink opacity-0 transition-opacity hover:bg-canvas group-hover:opacity-100 focus-visible:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {canResume && (
            <button
              type="button"
              onClick={onResume}
              className="mt-5 text-sm text-muted underline underline-offset-4 transition-colors hover:text-ink"
            >
              ← Keep swiping for more
            </button>
          )}

          {/* Contact form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 border-t border-hairline pt-10">
            <h2 className="display-sm text-ink" style={{ fontFamily: "var(--font-display)" }}>
              Send us your board
            </h2>
            <p className="mt-2 text-sm text-body">
              We&rsquo;ll reply on WhatsApp within 24 hours.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-muted">Full name *</label>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Priya Mehta"
                  autoComplete="name"
                  className={inputCls}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-primary">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted">WhatsApp number *</label>
                <div className="flex items-stretch gap-2">
                  <span className="flex items-center rounded-lg border border-hairline bg-surface-card px-3 text-sm text-muted">
                    +91
                  </span>
                  <input
                    {...register("whatsapp")}
                    type="tel"
                    placeholder="9876543210"
                    autoComplete="tel-national"
                    maxLength={10}
                    inputMode="numeric"
                    className={inputCls}
                  />
                </div>
                {errors.whatsapp && (
                  <p className="mt-1 text-sm text-primary">{errors.whatsapp.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted">
                  Email <span className="text-muted/60">(optional)</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="priya@example.com"
                  autoComplete="email"
                  className={inputCls}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-primary">{errors.email.message}</p>
                )}
              </div>
            </div>

            {submitError && (
              <div className="mt-6 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              className="mt-8"
            >
              {isSubmitting
                ? "Sending…"
                : `Send my board of ${favorites.length} →`}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

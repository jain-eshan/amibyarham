"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "@/components/Button";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    // overflow-visible so the hand bleeds down into the dark diamond section
    <section className="relative z-10 overflow-x-clip bg-canvas pt-20 pb-0 md:pt-32">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 items-end gap-8 px-6">
        {/* ── Left: copy ────────────────────────────────────────────────── */}
        <div className="col-span-12 pb-20 md:col-span-7 md:pb-section">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="caption-uppercase inline-block text-muted"
          >
            Est. 2026 — Bespoke Atelier
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.05, ease: easeOut }}
            className="display-xl mt-6 max-w-[18ch] text-ink"
          >
            Heirlooms born of{" "}
            <em className="not-italic text-primary">vision</em>, not of
            catalogue.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: easeOut }}
            className="mt-7 max-w-xl text-base text-body md:text-lg"
          >
            Lab-grown diamonds set in heritage gold — commissioned only for you.
            Tell us the moment; we&rsquo;ll craft the keepsake.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.32, ease: easeOut }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button href="/submit" size="lg">
              Submit Your Vision
              <Arrow />
            </Button>
            <Button href="/discover" size="lg" variant="secondary">
              Discover Inspiration
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-16 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-muted"
          >
            <span>Scroll</span>
            <span className="block h-px w-12 bg-hairline" />
          </motion.div>
        </div>

        {/* ── Right: floating hand, overflowing into dark section ────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: easeOut }}
          // Negative bottom margin pulls the hand down into the dark section
          className="col-span-12 -mb-32 md:col-span-5 md:-mb-48"
        >
          <FloatingHand />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Floating hand with prominent mouse-parallax ─────────────────────────────

function FloatingHand() {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Softer spring = more lag = more visible parallax motion
  const springX = useSpring(mouseX, { stiffness: 40, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 15 });

  // ±30px shift — significantly more prominent than before
  const imgX = useTransform(springX, [-1, 1], [-30, 30]);
  const imgY = useTransform(springY, [-1, 1], [-30, 30]);

  // Subtle counter-rotate on mouse move for extra depth
  const rotateZ = useTransform(springX, [-1, 1], [-2, 2]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ aspectRatio: "3/4" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="absolute inset-0"
        style={{ x: imgX, y: imgY, rotateZ }}
      >
        <Image
          src="/hero/hand-rings-nobg.png"
          alt="White sculptural hand wearing two delicate gold rings"
          fill
          className="object-contain object-bottom"
          priority
          sizes="(max-width: 768px) 100vw, 42vw"
        />
      </motion.div>
    </div>
  );
}

// ─── Video variant (kept for future use) ─────────────────────────────────────

export function HeroVideoArtifact() {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface-cream-strong">
      <video
        className="h-full w-full object-cover object-center"
        src="/hero/clip-goldsmith.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
      <span className="caption-uppercase absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60">
        A Modern Royal Heirloom
      </span>
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="2" y1="7" x2="12" y2="7" />
      <polyline points="8,3 12,7 8,11" />
    </svg>
  );
}

"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/Button";
import { VideoSketch } from "@/components/sections/VideoSketch";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative z-10 bg-canvas pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 items-center gap-8 px-6 md:gap-12">
        {/* ── Left: copy ────────────────────────────────────────────────── */}
        <div className="col-span-12 md:col-span-6">
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

        {/* ── Right: ring sketch video (arrows & labels baked in) ──────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.08, ease: easeOut }}
          className="col-span-12 md:col-span-6 md:max-w-[88%] md:justify-self-end"
        >
          <VideoSketch
            videoSrc="/Hero-Ring-Final.mp4"
            showOverlay={false}
            aspectRatio="4 / 3"
            objectFit="contain"
          />
        </motion.div>
      </div>
    </section>
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

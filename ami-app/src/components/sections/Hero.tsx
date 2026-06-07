"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { Button } from "@/components/Button";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const artifactY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const artifactOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-canvas pt-20 pb-16 md:pt-32 md:pb-section"
    >
      <BackdropGrid />

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-12 gap-8 px-6">
        <div className="col-span-12 md:col-span-7">
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

        <motion.div
          style={{ y: artifactY, opacity: artifactOpacity }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: easeOut }}
          className="col-span-12 md:col-span-5"
        >
          <HeroArtifact />
        </motion.div>
      </div>
    </section>
  );
}

function HeroArtifact() {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface-cream-strong">
      <div className="pointer-events-none absolute inset-6 border border-hairline" />
      <div className="pointer-events-none absolute inset-10 border-t border-hairline" />
      <div className="pointer-events-none absolute inset-10 bottom-auto top-auto" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          aria-hidden
          className="block leading-none text-ink"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "min(40vw, 320px)",
            letterSpacing: "-0.04em",
          }}
        >
          A
        </span>
      </div>

      <span className="caption-uppercase absolute bottom-6 left-1/2 -translate-x-1/2 text-muted">
        A Modern Royal Heirloom
      </span>

      <span
        aria-hidden
        className="absolute top-6 left-6 text-xs tracking-[0.25em] text-muted"
      >
        N°01
      </span>
      <span
        aria-hidden
        className="absolute top-6 right-6 text-xs tracking-[0.25em] text-muted"
      >
        ✦
      </span>
    </div>
  );
}

function BackdropGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--color-hairline-soft) 1px, transparent 1px)",
        backgroundSize: "calc((100% - 48px) / 12) 100%",
        backgroundPosition: "24px 0",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%)",
      }}
    />
  );
}

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

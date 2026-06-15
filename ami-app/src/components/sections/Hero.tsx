"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "@/components/Button";

// Switch artifact variant here as new assets arrive:
// "photo"  → sculptural hand image (Image 1A)
// "video"  → looping goldsmith clip (Clip A)
// "letter" → original "A" placeholder
const HERO_VARIANT: "photo" | "video" | "letter" = "photo";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-x-clip bg-canvas pt-20 pb-16 md:pt-32 md:pb-section">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 gap-8 px-6">
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
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: easeOut }}
          className="col-span-12 md:col-span-5"
        >
          <HeroArtifact variant={HERO_VARIANT} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Artifact variants ────────────────────────────────────────────────────────

function HeroArtifact({ variant }: { variant: "photo" | "video" | "letter" }) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface-cream-strong">
      {variant === "photo" && <PhotoArtifact />}
      {variant === "video" && <VideoArtifact />}
      {variant === "letter" && <LetterArtifact />}

      {/* Corner markers — shown on photo and letter, hidden on video for cinematic feel */}
      {variant !== "video" && (
        <>
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
          <div className="pointer-events-none absolute inset-6 border border-hairline" />
          <span className="caption-uppercase absolute bottom-6 left-1/2 -translate-x-1/2 text-muted">
            A Modern Royal Heirloom
          </span>
        </>
      )}
    </div>
  );
}

// ─── Photo: sculptural hand with mouse-parallax ───────────────────────────────

function PhotoArtifact() {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const imgX = useTransform(springX, [-1, 1], [-10, 10]);
  const imgY = useTransform(springY, [-1, 1], [-10, 10]);

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
      className="absolute inset-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="absolute inset-[-12px]"
        style={{ x: imgX, y: imgY }}
      >
        <Image
          src="/hero/hand-rings.png"
          alt="White sculptural hand wearing two delicate gold rings"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 768px) 100vw, 42vw"
        />
      </motion.div>
    </div>
  );
}

// ─── Video: looping cinematic clip ───────────────────────────────────────────

function VideoArtifact() {
  return (
    <div className="absolute inset-0">
      <video
        className="h-full w-full object-cover object-center"
        src="/hero/clip-goldsmith.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Subtle gradient at bottom for legibility if caption is ever re-enabled */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
      <span className="caption-uppercase absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60">
        A Modern Royal Heirloom
      </span>
    </div>
  );
}

// ─── Letter: original "A" placeholder ────────────────────────────────────────

function LetterArtifact() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span
        aria-hidden
        className="block leading-none text-ink"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(7rem, 16vw, 16rem)",
          letterSpacing: "-0.04em",
        }}
      >
        A
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

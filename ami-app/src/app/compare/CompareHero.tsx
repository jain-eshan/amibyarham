"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/Button";
import { VideoSketch } from "@/components/sections/VideoSketch";

const easeOut = [0.16, 1, 0.3, 1] as const;

interface CompareHeroProps {
  label: string;
  description: string;
  videoSrc: string;
  showOverlay: boolean;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
}

export function CompareHero({
  label,
  description,
  videoSrc,
  showOverlay,
  aspectRatio,
  objectFit,
}: CompareHeroProps) {
  return (
    <div>
      <div className="mb-6 border-b border-hairline pb-4">
        <span className="caption-uppercase text-primary">{label}</span>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>

      <section className="relative z-10 bg-canvas pb-16">
        <div className="mx-auto grid max-w-[1200px] grid-cols-12 items-center gap-8 md:gap-12">
          {/* Left: copy */}
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
          </div>

          {/* Right: video sketch */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.08, ease: easeOut }}
            className="col-span-12 md:col-span-6"
          >
            <VideoSketch
              videoSrc={videoSrc}
              showOverlay={showOverlay}
              aspectRatio={aspectRatio}
              objectFit={objectFit}
            />
          </motion.div>
        </div>
      </section>
    </div>
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

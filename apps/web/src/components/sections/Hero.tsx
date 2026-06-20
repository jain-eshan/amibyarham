"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/Button";
import { VideoSketch } from "@/components/sections/VideoSketch";

const easeOut = [0.16, 1, 0.3, 1] as const;

const TRUST_CUES = [
  "No commitment",
  "50-year jewellery legacy",
  "Personal design guidance",
] as const;

const FLOW = [
  {
    step: "01",
    title: "Send reference",
    body: "Screenshot, reel, board, photo",
  },
  {
    step: "02",
    title: "Feasibility check",
    body: "Craft, budget, timeline",
  },
  {
    step: "03",
    title: "Making plan",
    body: "Metal, stone, setting, next step",
  },
] as const;

export function Hero() {
  return (
    <section className="relative z-10 overflow-x-clip bg-canvas pt-20 pb-14 md:pt-28 md:pb-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-12">
        <div className="order-2 md:order-1 md:col-span-6">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.05, ease: easeOut }}
            className="display-xl max-w-[14ch] text-ink"
          >
            Custom jewellery made from{" "}
            <em className="not-italic text-primary">any reference</em>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: easeOut }}
            className="mt-6 max-w-lg text-base leading-relaxed text-body md:text-lg"
          >
            Send us your vision in a screenshot, reel, Pinterest board, or old
            family photo, and we will turn it into reality with our trusted
            karigars.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.32, ease: easeOut }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button href="/submit" size="lg">
              Send a Reference
              <Arrow />
            </Button>
            {/* <Button href="/discover" size="lg" variant="secondary">
              See Examples
            </Button> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.44, ease: easeOut }}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted"
          >
            {TRUST_CUES.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                />
                {item}
              </div>
            ))}
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.08, ease: easeOut }}
          className="order-1 md:order-2 md:col-span-6"
        >
          <div className="relative">
            <VideoSketch
              videoSrc="/Hero-Ring-Final.mp4"
              showOverlay={false}
              aspectRatio="4 / 3"
              objectFit="contain"
            />

            <div className="mt-4 hidden md:block">
              <div className="grid gap-0 border-y border-hairline-soft md:grid-cols-3">
                {FLOW.map((item) => (
                  <article
                    key={item.step}
                    className="border-hairline-soft py-4 md:border-l md:first:border-l-0 md:px-5"
                  >
                    <p className="font-mono text-[11px] tracking-[0.24em] text-muted">
                      {item.step}
                    </p>
                    <h2 className="mt-3 text-sm font-medium leading-snug text-ink">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-body">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
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

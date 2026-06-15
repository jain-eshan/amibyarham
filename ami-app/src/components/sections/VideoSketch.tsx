"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

// ─── Annotation definitions ───────────────────────────────────────────────────
// Arrow SVGs originate from the ring border, pointing outward to corner labels.
// img* props position the <image> in the 0-100 SVG viewBox.
// mirror: true flips the image horizontally so tail stays at ring edge.
// Arrow files: 1.svg (tail→UL, head→LR), 2.svg (tail→LR, head→UL), 3.svg (tail→LL, head→UR)

const ANNOTATIONS = [
  {
    id: "your-design",
    triggerAt: 2.5,
    arrow: "/3.svg",
    imgX: 54, imgY: 1, imgW: 38, imgH: 38,
    mirror: false,
    lx: 97, ly: 7, anchor: "end" as const,
    lines: ["Your Design", "Not ours. Never from a catalogue."],
  },
  {
    id: "cost",
    triggerAt: 4.0,
    arrow: "/1.svg",
    imgX: 59, imgY: 61, imgW: 38, imgH: 38,
    mirror: false,
    lx: 97, ly: 88, anchor: "end" as const,
    lines: ["60–80% Less", "Same stone. Smarter origin."],
  },
  {
    id: "craft",
    triggerAt: 6.0,
    arrow: "/1.svg",
    imgX: 2, imgY: 61, imgW: 38, imgH: 38,
    mirror: true,
    lx: 3, ly: 88, anchor: "start" as const,
    lines: ["Heritage Craft", "Hand-finished in our Delhi atelier."],
  },
  {
    id: "timeline",
    triggerAt: 8.0,
    arrow: "/2.svg",
    imgX: 5, imgY: 1, imgW: 38, imgH: 38,
    mirror: false,
    lx: 3, ly: 7, anchor: "start" as const,
    lines: ["6 Weeks", "From sketch to heirloom."],
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoSketch() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shown, setShown] = useState<ReadonlySet<string>>(new Set());

  const onTimeUpdate = useCallback(() => {
    const t = videoRef.current?.currentTime ?? 0;
    setShown((prev) => {
      let next: Set<string> | null = null;
      for (const ann of ANNOTATIONS) {
        if (t >= ann.triggerAt && !prev.has(ann.id)) {
          if (!next) next = new Set(prev);
          next.add(ann.id);
        }
      }
      return next ?? prev;
    });
  }, []);

  return (
    <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
      {/* Video with multiply blend to make white background transparent */}
      <video
        ref={videoRef}
        src="/Generate_a_smooth_second_ani.mp4"
        autoPlay
        muted
        playsInline
        loop
        onTimeUpdate={onTimeUpdate}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ display: "block", mixBlendMode: "multiply" }}
      />

      {/* ── SVG annotation overlay ─────────────────────────────────────── */}
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        {ANNOTATIONS.map((ann) => {
          const show = shown.has(ann.id);
          // Mirror: flip the image horizontally so it stays in the same bounding box
          const arrowTransform = ann.mirror
            ? `translate(${ann.imgX * 2 + ann.imgW} 0) scale(-1 1)`
            : undefined;

          return (
            <g key={ann.id}>
              {/* Hand-drawn arrow image */}
              <motion.g
                animate={{ opacity: show ? 1 : 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <image
                  href={ann.arrow}
                  x={ann.imgX}
                  y={ann.imgY}
                  width={ann.imgW}
                  height={ann.imgH}
                  transform={arrowTransform}
                />
              </motion.g>

              {/* Primary label */}
              <motion.text
                x={ann.lx}
                y={ann.ly}
                textAnchor={ann.anchor}
                fontSize="3.6"
                fill="var(--color-ink)"
                letterSpacing="0.08em"
                fontWeight="500"
                style={{ fontFamily: "var(--font-display)" } as React.CSSProperties}
                animate={{ opacity: show ? 1 : 0, y: show ? ann.ly : ann.ly + 3 }}
                initial={{ opacity: 0, y: ann.ly + 3 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {ann.lines[0]}
              </motion.text>

              {/* Secondary label */}
              <motion.text
                x={ann.lx}
                y={ann.ly + 4.8}
                textAnchor={ann.anchor}
                fontSize="2.6"
                fill="var(--color-body)"
                letterSpacing="0.02em"
                style={{ fontFamily: "var(--font-sans)" }}
                animate={{ opacity: show ? 0.7 : 0, y: show ? ann.ly + 4.8 : ann.ly + 7.8 }}
                initial={{ opacity: 0, y: ann.ly + 7.8 }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {ann.lines[1]}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

// ─── Annotation definitions ───────────────────────────────────────────────────
// Coordinates are percentages (0-100) of the overlay container, which is larger
// than the video (overflow-visible) so labels can sit outside the ring drawing.
// The ring drawing occupies roughly the center 60% of the container.

const ANNOTATIONS = [
  {
    id: "your-design",
    triggerAt: 2.5,
    lx: 97, ly: 8, anchor: "end" as const,
    pathD: "M 92,13 C 82,18 72,25 62,32",
    lines: ["Your Design", "Not ours. Never from a catalogue."],
  },
  {
    id: "cost",
    triggerAt: 4.0,
    lx: 97, ly: 42, anchor: "end" as const,
    pathD: "M 93,44 C 85,46 77,47 69,48",
    lines: ["60–80% Less", "Same stone. Smarter origin."],
  },
  {
    id: "certified",
    triggerAt: 5.5,
    lx: 97, ly: 85, anchor: "end" as const,
    pathD: "M 92,82 C 83,78 74,73 66,68",
    lines: ["IGI Certified", "Lab-grown. Identical brilliance."],
  },
  {
    id: "craft",
    triggerAt: 7.0,
    lx: 3, ly: 85, anchor: "start" as const,
    pathD: "M 8,82 C 17,78 26,73 34,68",
    lines: ["Heritage Craft", "Hand-finished in our Delhi atelier."],
  },
  {
    id: "timeline",
    triggerAt: 8.5,
    lx: 3, ly: 8, anchor: "start" as const,
    pathD: "M 8,13 C 18,18 28,25 38,32",
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
        style={{ color: "var(--color-ink)" }}
      >
        <defs>
          <marker
            id="arr"
            markerWidth="4"
            markerHeight="4"
            refX="3.5"
            refY="2"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M 0 0 L 4 2 L 0 4 Z" fill="var(--color-primary)" fillOpacity="0.75" />
          </marker>
        </defs>

        {ANNOTATIONS.map((ann) => {
          const show = shown.has(ann.id);
          return (
            <g key={ann.id}>
              {/* Primary label */}
              <motion.text
                x={ann.lx}
                y={ann.ly}
                textAnchor={ann.anchor}
                fontSize="3.6"
                fill="var(--color-ink)"
                letterSpacing="0.08em"
                fontWeight="500"
                style={
                  {
                    fontFamily: "var(--font-display)",
                  } as React.CSSProperties
                }
                animate={{ opacity: show ? 1 : 0, y: show ? 0 : 3 }}
                initial={{ opacity: 0, y: 3 }}
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
                animate={{ opacity: show ? 0.7 : 0, y: show ? 0 : 3 }}
                initial={{ opacity: 0, y: 3 }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {ann.lines[1]}
              </motion.text>

              {/* Dashed curved arrow in brand primary color */}
              <motion.path
                d={ann.pathD}
                stroke="var(--color-primary)"
                strokeWidth="0.45"
                strokeDasharray="2 2.2"
                strokeOpacity="0.6"
                fill="none"
                markerEnd="url(#arr)"
                animate={{ opacity: show ? 1 : 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

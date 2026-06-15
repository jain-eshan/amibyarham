"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

// ─── Annotation definitions ───────────────────────────────────────────────────
// Coordinates are percentages (0-100) of the square container.
// The 16:9 video is object-cover'd into a 1:1 square showing the center 720×720px.
// Ring in side-profile: stone at ~(50,30), shoulders at ~(35,50)&(65,50), band at ~(50,65).

const ANNOTATIONS = [
  {
    id: "diamond",
    triggerAt: 2.5,
    // Text label – upper right
    lx: 93, ly: 9, anchor: "end" as const,
    // Dashed arrow from label area → stone crown
    pathD: "M 90,14 C 78,18 64,24 53,30",
    lines: ["Lab-Grown Diamond", "IGI Certified · D–F Colour"],
  },
  {
    id: "setting",
    triggerAt: 4.0,
    // Text label – right
    lx: 97, ly: 41, anchor: "end" as const,
    pathD: "M 93,43 C 84,44 76,45 68,47",
    lines: ["Solitaire Setting", "4-Prong · Bespoke"],
  },
  {
    id: "gold",
    triggerAt: 5.5,
    // Text label – lower right
    lx: 93, ly: 84, anchor: "end" as const,
    pathD: "M 90,81 C 81,77 73,72 65,67",
    lines: ["18k Heritage Gold", "Hand-finished in Delhi"],
  },
  {
    id: "commission",
    triggerAt: 7.0,
    // Text label – lower left
    lx: 7, ly: 84, anchor: "start" as const,
    pathD: "M 10,81 C 19,77 27,72 35,67",
    lines: ["Commissioned", "Never catalogued"],
  },
  {
    id: "vision",
    triggerAt: 8.5,
    // Text label – upper left
    lx: 7, ly: 9, anchor: "start" as const,
    pathD: "M 10,14 C 22,18 36,24 47,30",
    lines: ["Your Vision", "Crafted in 6–8 weeks"],
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
    // 1:1 square container — object-cover crops the 16:9 video to its center
    <div className="relative w-full overflow-hidden rounded-md" style={{ aspectRatio: "1 / 1" }}>
      <video
        ref={videoRef}
        src="/Generate_a_smooth_second_ani.mp4"
        autoPlay
        muted
        playsInline
        loop
        onTimeUpdate={onTimeUpdate}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ display: "block" }}
      />

      {/* ── SVG annotation overlay ─────────────────────────────────────── */}
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute inset-0 h-full w-full"
        // SVG is square, container is square → no distortion
        style={{ color: "var(--color-ink)" }}
      >
        <defs>
          {/* Filled triangle arrowhead pointing at the ring */}
          <marker
            id="arr"
            markerWidth="4.5"
            markerHeight="4.5"
            refX="4"
            refY="2.25"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M 0 0 L 4.5 2.25 L 0 4.5 Z" fill="currentColor" fillOpacity="0.7" />
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
                fontSize="3.4"
                fill="currentColor"
                letterSpacing="0.09em"
                style={
                  {
                    fontFamily: "var(--font-display)",
                    textTransform: "uppercase",
                  } as React.CSSProperties
                }
                animate={{ opacity: show ? 1 : 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                {ann.lines[0]}
              </motion.text>

              {/* Secondary label */}
              <motion.text
                x={ann.lx}
                y={ann.ly + 4.6}
                textAnchor={ann.anchor}
                fontSize="2.8"
                fill="currentColor"
                fillOpacity="0.52"
                letterSpacing="0.04em"
                style={{ fontFamily: "var(--font-display)" }}
                animate={{ opacity: show ? 0.52 : 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                {ann.lines[1]}
              </motion.text>

              {/* Dashed curved arrow */}
              <motion.path
                d={ann.pathD}
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2.4 2"
                strokeOpacity="0.55"
                fill="none"
                markerEnd="url(#arr)"
                animate={{ opacity: show ? 1 : 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

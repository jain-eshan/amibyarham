"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

// ─── Annotation definitions ───────────────────────────────────────────────────
// Updated copy to match the manual graphic screenshot.
// Arrow SVGs: 1.svg (head→LR), 2.svg (head→UL), 3.svg (head→UR)

const ANNOTATIONS = [
  {
    id: "save",
    triggerAt: 2.5,
    arrow: "/3.svg",
    imgX: 54, imgY: 1, imgW: 38, imgH: 38,
    mirror: false,
    lx: 97, ly: 5, anchor: "end" as const,
    lines: ["Save up to 70%", "Same brilliance, a", "fraction of the price."],
  },
  {
    id: "ready",
    triggerAt: 4.0,
    arrow: "/1.svg",
    imgX: 59, imgY: 61, imgW: 38, imgH: 38,
    mirror: false,
    lx: 97, ly: 86, anchor: "end" as const,
    lines: ["Ready in 6 Weeks", "From sketch to the", "ring on your finger."],
  },
  {
    id: "handcrafted",
    triggerAt: 6.0,
    arrow: "/1.svg",
    imgX: 2, imgY: 61, imgW: 38, imgH: 38,
    mirror: true,
    lx: 3, ly: 86, anchor: "start" as const,
    lines: ["Handcrafted in Delhi", "Every piece finished by", "hand, not a machine."],
  },
  {
    id: "custom",
    triggerAt: 8.0,
    arrow: "/2.svg",
    imgX: 5, imgY: 1, imgW: 38, imgH: 38,
    mirror: false,
    lx: 3, ly: 5, anchor: "start" as const,
    lines: ["100% Custom", "Made from your idea,", "not picked off a shelf."],
  },
] as const;

interface VideoSketchProps {
  videoSrc?: string;
  showOverlay?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoSketch({
  videoSrc = "/Generate_a_smooth_second_ani.mp4",
  showOverlay = true,
}: VideoSketchProps) {
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
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        loop
        onTimeUpdate={onTimeUpdate}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ display: "block", mixBlendMode: "multiply" }}
      />

      {showOverlay && (
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          {ANNOTATIONS.map((ann) => {
            const show = shown.has(ann.id);
            const arrowTransform = ann.mirror
              ? `translate(${ann.imgX * 2 + ann.imgW} 0) scale(-1 1)`
              : undefined;

            return (
              <g key={ann.id}>
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
                  fontSize="3.2"
                  fill="var(--color-ink)"
                  letterSpacing="0.06em"
                  fontWeight="600"
                  style={{ fontFamily: "var(--font-display)" } as React.CSSProperties}
                  animate={{ opacity: show ? 1 : 0, y: show ? ann.ly : ann.ly + 3 }}
                  initial={{ opacity: 0, y: ann.ly + 3 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ann.lines[0]}
                </motion.text>

                {/* Secondary label line 1 */}
                <motion.text
                  x={ann.lx}
                  y={ann.ly + 4}
                  textAnchor={ann.anchor}
                  fontSize="2.4"
                  fill="var(--color-body)"
                  letterSpacing="0.02em"
                  style={{ fontFamily: "var(--font-sans)" }}
                  animate={{ opacity: show ? 0.7 : 0, y: show ? ann.ly + 4 : ann.ly + 7 }}
                  initial={{ opacity: 0, y: ann.ly + 7 }}
                  transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ann.lines[1]}
                </motion.text>

                {/* Secondary label line 2 */}
                <motion.text
                  x={ann.lx}
                  y={ann.ly + 7.2}
                  textAnchor={ann.anchor}
                  fontSize="2.4"
                  fill="var(--color-body)"
                  letterSpacing="0.02em"
                  style={{ fontFamily: "var(--font-sans)" }}
                  animate={{ opacity: show ? 0.7 : 0, y: show ? ann.ly + 7.2 : ann.ly + 10.2 }}
                  initial={{ opacity: 0, y: ann.ly + 10.2 }}
                  transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ann.lines[2]}
                </motion.text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

// ─── Constants ───────────────────────────────────────────────────────────────

const CX = 280;
const CY = 190;
const GIRDLE = 82;
const TABLE = 48;
const BAND_CX = 280;
const BAND_CY = 428;
const BAND_RX = 138;
const BAND_RY = 50;
const BAND_IRX = 96;
const BAND_IRY = 33;

const STAR_DEG = [0, 45, 90, 135, 180, 225, 270, 315];
const HALF_DEG = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

function pt(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
}

// ─── Variants ────────────────────────────────────────────────────────────────

type C = { delay: number; dur?: number };

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: ({ delay, dur = 1.0 }: C) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring" as const, duration: dur, bounce: 0, delay },
      opacity: { duration: 0.01, delay },
    },
  }),
};

const fade = {
  hidden: { opacity: 0 },
  visible: ({ delay }: C) => ({
    opacity: 1,
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

// ─── Component ───────────────────────────────────────────────────────────────

export function JewelrySketch() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="w-full"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 560 530"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        style={{ color: "var(--color-ink)" }}
      >
        {/* ── Girdle ──────────────────────────────────────────────── */}
        <motion.circle
          cx={CX} cy={CY} r={GIRDLE}
          stroke="currentColor" strokeWidth="1.2"
          variants={draw} custom={{ delay: 0.1, dur: 1.6 }}
        />

        {/* ── Table ───────────────────────────────────────────────── */}
        <motion.circle
          cx={CX} cy={CY} r={TABLE}
          stroke="currentColor" strokeWidth="0.85"
          variants={draw} custom={{ delay: 0.38, dur: 1.2 }}
        />

        {/* ── Culet ───────────────────────────────────────────────── */}
        <motion.circle
          cx={CX} cy={CY} r={2.5}
          fill="currentColor"
          variants={draw} custom={{ delay: 0.55, dur: 0.2 }}
        />

        {/* ── 8 star facets: table → girdle ───────────────────────── */}
        {STAR_DEG.map((deg, i) => {
          const t = pt(CX, CY, TABLE, deg);
          const g = pt(CX, CY, GIRDLE, deg);
          return (
            <motion.line
              key={`sf${i}`}
              x1={t.x} y1={t.y} x2={g.x} y2={g.y}
              stroke="currentColor" strokeWidth="0.62"
              variants={draw} custom={{ delay: 0.62 + i * 0.045, dur: 0.55 }}
            />
          );
        })}

        {/* ── 8 half-stars: center → table ────────────────────────── */}
        {HALF_DEG.map((deg, i) => {
          const t = pt(CX, CY, TABLE, deg);
          return (
            <motion.line
              key={`hs${i}`}
              x1={CX} y1={CY} x2={t.x} y2={t.y}
              stroke="currentColor" strokeWidth="0.45"
              variants={draw} custom={{ delay: 1.0 + i * 0.035, dur: 0.42 }}
            />
          );
        })}

        {/* ── 4 Prongs at NSEW ────────────────────────────────────── */}
        {[270, 90, 0, 180].map((deg, i) => {
          const p = pt(CX, CY, GIRDLE, deg);
          return (
            <motion.circle
              key={`pr${i}`}
              cx={p.x} cy={p.y} r={5.5}
              stroke="currentColor" strokeWidth="1.1" fill="none"
              variants={draw} custom={{ delay: 1.28 + i * 0.06, dur: 0.6 }}
            />
          );
        })}

        {/* ── Bridge: stone → band ────────────────────────────────── */}
        {/* SW of stone (135° in SVG = lower-left) to band upper-left */}
        <motion.path
          d={`M ${pt(CX, CY, GIRDLE - 2, 135).x.toFixed(1)},${pt(CX, CY, GIRDLE - 2, 135).y.toFixed(1)} C 208,316 175,358 175,396`}
          stroke="currentColor" strokeWidth="1.1"
          variants={draw} custom={{ delay: 1.54, dur: 0.85 }}
        />
        {/* SE of stone (45° in SVG = lower-right) to band upper-right */}
        <motion.path
          d={`M ${pt(CX, CY, GIRDLE - 2, 45).x.toFixed(1)},${pt(CX, CY, GIRDLE - 2, 45).y.toFixed(1)} C 352,316 385,358 385,396`}
          stroke="currentColor" strokeWidth="1.1"
          variants={draw} custom={{ delay: 1.54, dur: 0.85 }}
        />

        {/* ── Ring band: outer + inner ─────────────────────────────── */}
        <motion.ellipse
          cx={BAND_CX} cy={BAND_CY} rx={BAND_RX} ry={BAND_RY}
          stroke="currentColor" strokeWidth="1.2"
          variants={draw} custom={{ delay: 1.75, dur: 1.35 }}
        />
        <motion.ellipse
          cx={BAND_CX} cy={BAND_CY} rx={BAND_IRX} ry={BAND_IRY}
          stroke="currentColor" strokeWidth="0.72"
          variants={draw} custom={{ delay: 1.95, dur: 1.15 }}
        />

        {/* ── Annotation leader lines ──────────────────────────────── */}
        {/* 1. Upper right → diamond */}
        <motion.path
          d="M 332,148 L 405,100 L 535,100"
          stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5"
          variants={draw} custom={{ delay: 2.28, dur: 0.65 }}
        />
        {/* 2. East prong → setting */}
        <motion.path
          d="M 368,190 L 430,190 L 535,190"
          stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5"
          variants={draw} custom={{ delay: 2.38, dur: 0.65 }}
        />
        {/* 3. Band lower-right → gold */}
        <motion.path
          d="M 415,445 L 456,478 L 535,478"
          stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5"
          variants={draw} custom={{ delay: 2.48, dur: 0.65 }}
        />
        {/* 4. Band lower-left → commission */}
        <motion.path
          d="M 145,445 L 104,478 L 25,478"
          stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5"
          variants={draw} custom={{ delay: 2.58, dur: 0.65 }}
        />
        {/* 5. Upper left → vision */}
        <motion.path
          d="M 228,148 L 155,100 L 25,100"
          stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5"
          variants={draw} custom={{ delay: 2.68, dur: 0.65 }}
        />

        {/* ── Text labels ─────────────────────────────────────────── */}
        {/* 1. Upper right */}
        <motion.text x="535" y="93" textAnchor="end" fontSize="10.5"
          fill="currentColor" letterSpacing="0.1em"
          style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" } as React.CSSProperties}
          variants={fade} custom={{ delay: 2.85 }}>
          Lab-Grown Diamond
        </motion.text>
        <motion.text x="535" y="108" textAnchor="end" fontSize="9.5"
          fill="currentColor" letterSpacing="0.05em" fillOpacity="0.5"
          style={{ fontFamily: "var(--font-display)" }}
          variants={fade} custom={{ delay: 2.9 }}>
          IGI Certified · D–F Colour
        </motion.text>

        {/* 2. Right */}
        <motion.text x="535" y="184" textAnchor="end" fontSize="10.5"
          fill="currentColor" letterSpacing="0.1em"
          style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" } as React.CSSProperties}
          variants={fade} custom={{ delay: 2.95 }}>
          Solitaire Setting
        </motion.text>
        <motion.text x="535" y="199" textAnchor="end" fontSize="9.5"
          fill="currentColor" letterSpacing="0.05em" fillOpacity="0.5"
          style={{ fontFamily: "var(--font-display)" }}
          variants={fade} custom={{ delay: 3.0 }}>
          4-Prong · Bespoke to You
        </motion.text>

        {/* 3. Lower right */}
        <motion.text x="535" y="472" textAnchor="end" fontSize="10.5"
          fill="currentColor" letterSpacing="0.1em"
          style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" } as React.CSSProperties}
          variants={fade} custom={{ delay: 3.05 }}>
          18k Heritage Gold
        </motion.text>
        <motion.text x="535" y="487" textAnchor="end" fontSize="9.5"
          fill="currentColor" letterSpacing="0.05em" fillOpacity="0.5"
          style={{ fontFamily: "var(--font-display)" }}
          variants={fade} custom={{ delay: 3.1 }}>
          Hand-finished in Delhi
        </motion.text>

        {/* 4. Lower left */}
        <motion.text x="25" y="472" textAnchor="start" fontSize="10.5"
          fill="currentColor" letterSpacing="0.1em"
          style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" } as React.CSSProperties}
          variants={fade} custom={{ delay: 3.15 }}>
          Commissioned
        </motion.text>
        <motion.text x="25" y="487" textAnchor="start" fontSize="9.5"
          fill="currentColor" letterSpacing="0.05em" fillOpacity="0.5"
          style={{ fontFamily: "var(--font-display)" }}
          variants={fade} custom={{ delay: 3.2 }}>
          Never catalogued
        </motion.text>

        {/* 5. Upper left */}
        <motion.text x="25" y="93" textAnchor="start" fontSize="10.5"
          fill="currentColor" letterSpacing="0.1em"
          style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" } as React.CSSProperties}
          variants={fade} custom={{ delay: 3.25 }}>
          Your Vision
        </motion.text>
        <motion.text x="25" y="108" textAnchor="start" fontSize="9.5"
          fill="currentColor" letterSpacing="0.05em" fillOpacity="0.5"
          style={{ fontFamily: "var(--font-display)" }}
          variants={fade} custom={{ delay: 3.3 }}>
          Crafted in 6–8 weeks
        </motion.text>

        {/* ── Atelier mark ────────────────────────────────────────── */}
        <motion.text x="280" y="522" textAnchor="middle" fontSize="8.5"
          fill="currentColor" letterSpacing="0.22em" fillOpacity="0.28"
          style={{ fontFamily: "var(--font-display)" }}
          variants={fade} custom={{ delay: 3.5 }}>
          AMI BY ARHAM · MMXXVI
        </motion.text>
      </svg>
    </motion.div>
  );
}

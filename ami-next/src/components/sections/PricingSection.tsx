"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={REVEAL_VARIANTS}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const ROWS = [
  { label: "925 silver · 8g at today's rate", val: "Rs 720" },
  { label: "Lab-grown diamond · 0.5ct, VS1, IGI", val: "Rs 4,200" },
  { label: "Making charge · handcrafted", val: "Rs 1,800" },
  { label: "IGI certificate + packaging", val: "Rs 500" },
] as const;

export default function PricingSection() {
  return (
    <section
      id="pricing"
      style={{
        background: "var(--color-silk)",
        padding: "clamp(5rem,12vw,9rem) 0",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 clamp(1.5rem,5vw,4rem)",
        }}
      >
        <Reveal>
          <span
            style={{
              font: "500 10.5px var(--font-ui)",
              textTransform: "uppercase",
              letterSpacing: ".32em",
              color: "var(--color-oxblood)",
            }}
          >
            No surprises
          </span>
        </Reveal>

        <Reveal style={{ marginTop: 18 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(2rem,4.5vw,3.2rem)",
              lineHeight: 1.15,
              color: "var(--color-kohl)",
            }}
          >
            Here&apos;s what a piece{" "}
            <em style={{ fontStyle: "normal", color: "var(--color-oxblood)" }}>
              actually costs.
            </em>
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,320px), 1fr))",
            gap: "clamp(2rem,5vw,4rem)",
            alignItems: "center",
            marginTop: "clamp(2.5rem,5vw,3.5rem)",
          }}
        >
          <Reveal delay={0.08}>
            <p
              style={{
                fontSize: "clamp(1.05rem,1.5vw,1.2rem)",
                lineHeight: 1.8,
                color: "var(--color-kohl-soft)",
              }}
            >
              We show you the breakdown before you commit a rupee — the silver
              by weight at the day&apos;s rate, the lab-grown diamond by its
              certificate, and the karigar&apos;s making charge.{" "}
              <em style={{ fontStyle: "italic", color: "var(--color-oxblood)" }}>
                Then you decide.
              </em>
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div
              style={{
                background: "var(--color-silk-light)",
                border: "1px solid rgba(181,148,74,.25)",
                borderRadius: 10,
                padding: "clamp(1.5rem,3vw,2rem)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "1.25rem",
                  color: "var(--color-kohl)",
                  marginBottom: "1.25rem",
                }}
              >
                A solitaire ring, for instance
              </p>

              {ROWS.map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: "1rem",
                    padding: ".55rem 0",
                    borderBottom: "1px solid rgba(26,20,17,.07)",
                  }}
                >
                  <span
                    style={{ fontSize: ".98rem", color: "var(--color-kohl-soft)" }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      font: "500 .92rem var(--font-ui)",
                      color: "var(--color-kohl)",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: ".02em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.val}
                  </span>
                </div>
              ))}

              {/* total row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "1rem",
                  marginTop: ".4rem",
                  paddingTop: ".85rem",
                  borderTop: "1px solid rgba(181,148,74,.4)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "1.3rem",
                    color: "var(--color-kohl)",
                  }}
                >
                  Your piece
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.4rem",
                    color: "var(--color-oxblood)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Rs 7,220
                </span>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-script)",
                  fontSize: "1.2rem",
                  color: "var(--color-oxblood)",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                no showroom markup, no hidden fees
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

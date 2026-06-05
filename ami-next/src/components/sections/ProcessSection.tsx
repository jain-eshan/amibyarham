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

const STEPS = [
  {
    no: "01",
    title: "Share what you love",
    desc: "A Pinterest save, a photo, a sketch on paper. Tell us the occasion, the metal, the budget. Whatever you've been keeping.",
    tag: null,
  },
  {
    no: "02",
    title: "We answer with a price",
    desc: "Within a day, a mockup of your piece, a transparent cost breakdown — metal, stone, making — and the name of the karigar who will craft it.",
    tag: "a day, not a fortnight",
  },
  {
    no: "03",
    title: "Handcrafted, then home",
    desc: "Confirm, and the bench begins. Shaped by hand in 7 to 21 days. Delivered with its IGI certificate and BIS hallmark.",
    tag: "signed by its maker",
  },
] as const;

export default function ProcessSection() {
  return (
    <section
      id="process"
      style={{
        background: "var(--color-silk-light)",
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
            How it works
          </span>
        </Reveal>

        <Reveal style={{ maxWidth: 540, marginTop: 18 }}>
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
            Three steps, from a picture{" "}
            <em
              style={{ fontStyle: "normal", color: "var(--color-oxblood)" }}
            >
              to your hands.
            </em>
          </h2>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "clamp(1.02rem,1.4vw,1.14rem)",
              lineHeight: 1.8,
              color: "var(--color-kohl-soft)",
            }}
          >
            No showroom visits. No stock waiting on a shelf. Every piece begins
            with what you love, and ends with what one named pair of hands makes
            for you.
          </p>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,240px), 1fr))",
            gap: "clamp(1.5rem,3vw,2.5rem)",
            marginTop: "clamp(3rem,6vw,4.5rem)",
          }}
        >
          {STEPS.map((step, i) => (
            <Reveal key={step.no} delay={i * 0.08}>
              <div
                style={{
                  position: "relative",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(110,27,46,.18)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: "1.4rem",
                    color: "var(--color-gold)",
                  }}
                >
                  {step.no}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "1.4rem",
                    color: "var(--color-kohl)",
                    margin: ".5rem 0 .6rem",
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "var(--color-kohl-soft)",
                    maxWidth: "34ch",
                  }}
                >
                  {step.desc}
                </p>
                {step.tag && (
                  <p
                    style={{
                      fontFamily: "var(--font-script)",
                      fontSize: "1.25rem",
                      color: "var(--color-oxblood)",
                      marginTop: ".75rem",
                    }}
                  >
                    {step.tag}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

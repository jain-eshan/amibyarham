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

export default function CtaSection() {
  return (
    <section
      id="cta"
      style={{
        position: "relative",
        background: "var(--color-oxblood)",
        color: "var(--color-silk)",
        padding: "clamp(5rem,12vw,9rem) clamp(1.5rem,5vw,4rem)",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* arch pattern overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='72' height='100' viewBox='0 0 72 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 100 L12 52 Q12 42 22 38 Q30 34 36 18 Q42 34 50 38 Q60 42 60 52 L60 100' fill='none' stroke='%23B5944A' stroke-width='0.9'/%3E%3C/svg%3E")`,
          backgroundSize: "72px 100px",
          opacity: 0.08,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <Reveal>
          <span
            style={{
              font: "500 10.5px var(--font-ui)",
              textTransform: "uppercase",
              letterSpacing: ".32em",
              color: "rgba(181,148,74,.7)",
            }}
          >
            Begin
          </span>
        </Reveal>

        <Reveal style={{ marginTop: 18 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(2.2rem,5vw,3.6rem)",
              lineHeight: 1.12,
              color: "var(--color-silk)",
            }}
          >
            Show us what you love.{" "}
            <em
              style={{ fontStyle: "normal", fontWeight: 600, color: "var(--color-gold-lit)" }}
            >
              We&apos;ll make it by hand.
            </em>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p
            style={{
              fontSize: "clamp(1.02rem,1.4vw,1.16rem)",
              lineHeight: 1.8,
              color: "rgba(240,230,210,.78)",
              margin: "1.25rem auto 2.25rem",
              maxWidth: "46ch",
            }}
          >
            Send a photo, a Pinterest link, or a rough sketch. Within a day
            you&apos;ll have a mockup, a clear price, and the name of the karigar
            who will craft your piece. Take your time — we&apos;ll be here when
            you&apos;re ready.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => { window.location.href = "mailto:hello@amibyarham.com"; }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                font: "500 11px var(--font-ui)",
                textTransform: "uppercase",
                letterSpacing: ".14em",
                color: "var(--color-kohl)",
                background: "var(--color-gold-lit)",
                padding: ".85rem 1.6rem",
                borderRadius: 3,
                border: "none",
                cursor: "pointer",
                transition: "background .3s, transform .3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--color-gold)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--color-gold-lit)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              Start your piece
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <a
              href="mailto:hello@amibyarham.com"
              style={{
                font: "500 11px var(--font-ui)",
                textTransform: "uppercase",
                letterSpacing: ".14em",
                color: "rgba(240,230,210,.82)",
                border: "1px solid rgba(240,230,210,.3)",
                padding: ".85rem 1.6rem",
                borderRadius: 3,
                display: "inline-block",
                transition: "color .3s, border-color .3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--color-silk)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(240,230,210,.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(240,230,210,.82)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(240,230,210,.3)";
              }}
            >
              Write to us
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <p
            style={{
              font: "400 13px var(--font-ui)",
              color: "rgba(240,230,210,.45)",
              marginTop: "1.5rem",
              letterSpacing: ".04em",
            }}
          >
            Or write to us at hello@amibyarham.com — we reply within a day.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

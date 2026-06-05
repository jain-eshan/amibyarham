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

const ITEMS = [
  {
    title: "Forty years of family craft",
    desc: "From Rajesh Jewellers in Ashok Vihar to ami. Founder Amit Jain trained in diamonds at the Indian Diamond Institute, Surat.",
  },
  {
    title: "IGI-certified lab-grown",
    desc: "Every diamond carries an International Gemological Institute certificate. Same carbon, same fire — just without the mine.",
  },
  {
    title: "BIS hallmarked",
    desc: "Every silver and gold piece carries a BIS HUID hallmark — purity you can check yourself on the BIS Care app.",
  },
  {
    title: "Priced in full",
    desc: "Metal at the day’s rate, the stone, the making charge. Every rupee accounted for. Never “request a quote.”",
  },
] as const;

export default function TrustSection() {
  return (
    <section
      id="trust"
      style={{
        position: "relative",
        background: "var(--color-kohl)",
        color: "var(--color-silk)",
        padding: "clamp(5rem,12vw,9rem) 0",
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
          opacity: 0.06,
        }}
      />

      {/* grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          opacity: 0.11,
          mixBlendMode: "overlay",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
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
              color: "var(--color-gold)",
            }}
          >
            Our promise
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
              color: "var(--color-silk)",
            }}
          >
            Old soul, honest hands,{" "}
            <em style={{ fontStyle: "normal", color: "var(--color-gold-lit)" }}>
              modern proof.
            </em>
          </h2>
        </Reveal>

        <Reveal style={{ marginTop: "1rem", maxWidth: "46ch" }}>
          <p
            style={{
              fontSize: "clamp(1.02rem,1.4vw,1.14rem)",
              lineHeight: 1.8,
              color: "rgba(240,230,210,.78)",
            }}
          >
            Real diamonds, real certificates, real people. No showroom markup,
            no hidden cost, nothing you cannot verify yourself.
          </p>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 16,
            marginTop: "clamp(3rem,6vw,4rem)",
          }}
        >
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <TrustCard title={item.title} desc={item.desc} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustCard({ title, desc }: { title: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        if (ref.current) {
          ref.current.style.borderColor = "rgba(181,148,74,.45)";
          ref.current.style.background = "rgba(240,230,210,.05)";
          ref.current.style.transform = "translateY(-3px)";
        }
      }}
      onMouseLeave={() => {
        if (ref.current) {
          ref.current.style.borderColor = "rgba(181,148,74,.22)";
          ref.current.style.background = "rgba(240,230,210,.025)";
          ref.current.style.transform = "none";
        }
      }}
      style={{
        border: "1px solid rgba(181,148,74,.22)",
        borderRadius: 8,
        padding: 26,
        background: "rgba(240,230,210,.025)",
        transition: "border-color .3s, background .3s, transform .3s",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "1.3rem",
          color: "var(--color-gold-lit)",
          marginBottom: ".5rem",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: ".98rem",
          lineHeight: 1.65,
          color: "rgba(240,230,210,.72)",
        }}
      >
        {desc}
      </p>
    </div>
  );
}

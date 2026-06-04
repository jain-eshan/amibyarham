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
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
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

export default function StorySection() {
  return (
    <section
      id="story"
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
            The house
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
              color: "var(--color-kohl)",
              maxWidth: "16ch",
            }}
          >
            Ami means{" "}
            <strong
              style={{
                fontWeight: 600,
                fontStyle: "normal",
                color: "var(--color-oxblood)",
              }}
            >
              beloved
            </strong>{" "}
            — and the first drop of{" "}
            <strong
              style={{
                fontWeight: 600,
                fontStyle: "normal",
                color: "var(--color-oxblood)",
              }}
            >
              amrit.
            </strong>
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,340px), 1fr))",
            gap: "clamp(2rem,5vw,4.5rem)",
            marginTop: "clamp(2.5rem,5vw,3.5rem)",
          }}
        >
          <Reveal>
            <p
              className="story-dropcap"
              style={{
                fontSize: "clamp(1.02rem,1.4vw,1.16rem)",
                lineHeight: 1.82,
                marginBottom: "1.1rem",
              }}
            >
              For forty years a small silver shop in Ashok Vihar, Old Delhi,
              made jewellery the slow way — by hand, by name, by trust. Rajesh
              Jewellers. Its sons carried that trade outward: to Surat, to learn
              the language of diamonds at the Indian Diamond Institute; to the
              United Nations, to learn the worth of an honest ledger.
            </p>
            <p
              style={{
                fontSize: "clamp(1.02rem,1.4vw,1.16rem)",
                lineHeight: 1.82,
              }}
            >
              AMI is what they brought home. Not a showroom. Not a shelf of
              finished things waiting for a buyer. A house built around a single,
              old-fashioned idea — that the most precious piece you will ever own
              is the one made only for you.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <p
              style={{
                fontSize: "clamp(1.02rem,1.4vw,1.16rem)",
                lineHeight: 1.82,
                marginBottom: "1.1rem",
              }}
            >
              You arrive with a picture you have been keeping — a Pinterest save,
              a sketch, your grandmother&apos;s ring drawn from memory. We answer
              with a hand. A karigar we can name takes your wish to the bench and
              returns it as a piece: lab-grown diamond, IGI certified, BIS
              hallmarked, priced in full and without apology.
            </p>
            <p
              style={{
                fontSize: "clamp(1.02rem,1.4vw,1.16rem)",
                lineHeight: 1.82,
              }}
            >
              No fixed catalogue. No factory. No showroom markup. Old soul,
              honest hands, modern proof. A legacy small enough to be intimate,
              and sure enough to cross any border.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <blockquote
            style={{
              marginTop: "clamp(3rem,6vw,4.5rem)",
              textAlign: "center",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.5rem,3.4vw,2.2rem)",
              lineHeight: 1.3,
              color: "var(--color-oxblood)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "block",
                color: "var(--color-gold)",
                fontSize: "2.2em",
                lineHeight: 0,
                marginBottom: ".4em",
              }}
            >
              ·
            </span>
            We do not sell what we have made.
            <br />
            We make what you love.
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

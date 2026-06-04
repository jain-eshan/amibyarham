"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

const FAQS = [
  {
    q: "Is a lab-grown diamond the same quality as a mined one?",
    a: "Chemically, physically, and optically identical. Lab-grown diamonds are graded by the same four Cs — cut, colour, clarity, carat — and certified by IGI (International Gemological Institute), the same body that certifies the world's finest mined stones. The only difference is origin — and price.",
  },
  {
    q: "How long does a custom piece take?",
    a: "Most pieces take 3–5 weeks from approved design to delivery. Complex settings or multi-stone designs may take up to 8 weeks. We share progress photos at each stage — wax model, stone setting, polishing — so you're never waiting in the dark.",
  },
  {
    q: "Can I see the piece before paying in full?",
    a: "Yes. We work in stages: a small advance secures your karigar's time, the remainder is due before dispatch. You'll receive a detailed CAD render or wax model before a single stone is set. If it's not right, we revise until it is.",
  },
  {
    q: "What do IGI certification and BIS hallmarking guarantee?",
    a: "IGI certifies the diamond — cut, colour, clarity, and carat weight — from an independent gemological lab. BIS hallmarking certifies the metal purity (18KT, 22KT, or 925 silver) through a government-recognised assay centre. Both are independently verifiable.",
  },
  {
    q: "Do you ship internationally?",
    a: "We ship fully insured to over 40 countries. Customs duties and import taxes are the buyer's responsibility and vary by destination. We provide all documentation needed for smooth customs clearance.",
  },
  {
    q: "What if I want changes mid-process?",
    a: "Minor adjustments — stone size, prong style, surface finish — are usually possible up to the setting stage at no extra cost. Significant design changes after the wax is approved may incur a small rework fee. We always communicate before proceeding.",
  },
];

function FaqItem({
  q,
  a,
  index,
}: {
  q: string;
  a: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-4% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.055,
      }}
      style={{ borderBottom: "1px solid rgba(110,27,46,.13)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.4rem 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "1.25rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1.05rem,1.6vw,1.18rem)",
            color: open ? "var(--color-oxblood)" : "var(--color-kohl)",
            lineHeight: 1.4,
            transition: "color .25s",
          }}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            color: "var(--color-oxblood)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                paddingBottom: "1.5rem",
                fontSize: "clamp(0.95rem,1.3vw,1.05rem)",
                lineHeight: 1.82,
                fontFamily: "var(--font-ui)",
                color: "rgba(26,20,17,.62)",
              }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-6% 0px" });

  return (
    <section
      id="faq"
      style={{
        background: "var(--color-silk)",
        padding: "clamp(5rem,12vw,9rem) clamp(1.5rem,5vw,4rem)",
        borderTop: "1px solid rgba(110,27,46,.1)",
      }}
    >
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <div ref={headerRef}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{
              display: "block",
              font: "500 10.5px var(--font-ui)",
              textTransform: "uppercase",
              letterSpacing: ".32em",
              color: "var(--color-oxblood)",
              marginBottom: 18,
            }}
          >
            Questions
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(2rem,4.5vw,3rem)",
              color: "var(--color-kohl)",
              lineHeight: 1.15,
              marginBottom: "clamp(2.5rem,5vw,3.5rem)",
            }}
          >
            Everything you&apos;d want to know{" "}
            <em style={{ fontStyle: "normal", color: "var(--color-oxblood)" }}>
              before you begin.
            </em>
          </motion.h2>
        </div>

        <div
          style={{ borderTop: "1px solid rgba(110,27,46,.13)" }}
        >
          {FAQS.map((faq, i) => (
            <FaqItem key={i} index={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

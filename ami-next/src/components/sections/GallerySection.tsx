"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

/* ─── piece data ─────────────────────────────────────────── */
const PIECES = [
  {
    id: "p1",
    name: "The Roshni Ring",
    type: "Solitaire · Round Brilliant",
    metal: "18KT White Gold",
    bg: "linear-gradient(145deg, #1A1411 0%, #0e0b09 100%)",
    accent: "#CBA85C",
    span: "tall",
    svgPath: "M60 80 Q60 50 80 40 Q100 30 100 10 Q100 30 120 40 Q140 50 140 80",
    label: "1.2ct F VS1 IGI",
  },
  {
    id: "p2",
    name: "Amrit Pendant",
    type: "Solitaire Drop · Pear",
    metal: "22KT Yellow Gold",
    bg: "linear-gradient(145deg, #6E1B2E 0%, #3a0e18 100%)",
    accent: "#F0E6D2",
    span: "wide",
    svgPath: "M100 20 Q130 55 100 90 Q70 55 100 20",
    label: "0.75ct G VS2 IGI",
  },
  {
    id: "p3",
    name: "Old Delhi Kada",
    type: "Bangle · Engraved",
    metal: "22KT Yellow Gold",
    bg: "linear-gradient(145deg, #2a1f14 0%, #1A1411 100%)",
    accent: "#B5944A",
    span: "normal",
    svgPath: "M60 100 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0",
    label: "BIS 916 Hallmarked",
  },
  {
    id: "p4",
    name: "Zardozi Choker",
    type: "Necklace · Collar",
    metal: "18KT Rose Gold",
    bg: "linear-gradient(145deg, #3d1a2a 0%, #1A1411 100%)",
    accent: "#CBA85C",
    span: "tall",
    svgPath: "M40 80 Q100 40 160 80",
    label: "Lab Diamond Pavé",
  },
  {
    id: "p5",
    name: "Heritage Jhumka",
    type: "Earrings · Drop",
    metal: "22KT Yellow Gold",
    bg: "linear-gradient(145deg, #1c1207 0%, #0d0b08 100%)",
    accent: "#F0E6D2",
    span: "normal",
    svgPath: "M100 30 L90 70 Q100 90 110 70 Z",
    label: "0.3ct each · I VS1",
  },
  {
    id: "p6",
    name: "Silk Eternity Band",
    type: "Band · Full Pavé",
    metal: "18KT White Gold",
    bg: "linear-gradient(145deg, #0a0808 0%, #1A1411 100%)",
    accent: "#CBA85C",
    span: "wide",
    svgPath: "M30 100 a70 20 0 1 1 140 0 a70 20 0 1 1 -140 0",
    label: "2.1ctw F-G VS IGI",
  },
];

/* ─── piece card ─────────────────────────────────────────── */
function PieceCard({
  piece,
  index,
  onOpen,
}: {
  piece: (typeof PIECES)[0];
  index: number;
  onOpen: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.07,
      }}
      style={{
        gridRow: piece.span === "tall" ? "span 2" : "span 1",
        gridColumn: piece.span === "wide" ? "span 2" : "span 1",
      }}
    >
      <motion.button
        onClick={() => onOpen(piece.id)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          height: piece.span === "tall" ? "100%" : "auto",
          minHeight: piece.span === "tall" ? 360 : 220,
          background: piece.bg,
          border: "1px solid rgba(181,148,74,.16)",
          borderRadius: 6,
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        {/* SVG jewelry silhouette */}
        <svg
          viewBox="0 0 200 140"
          style={{
            width: "55%",
            maxWidth: 160,
            opacity: hovered ? 0.95 : 0.7,
            transition: "opacity .4s",
          }}
        >
          <path
            d={piece.svgPath}
            fill="none"
            stroke={piece.accent}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* decorative dots */}
          <circle cx="100" cy="10" r="3" fill={piece.accent} opacity="0.7" />
          <circle cx="100" cy="10" r="6" fill="none" stroke={piece.accent} strokeWidth="0.8" opacity="0.4" />
        </svg>

        {/* bottom info */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "1.25rem 1.25rem 1.1rem",
            background: "linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 100%)",
            textAlign: "left",
          }}
        >
          <p
            style={{
              font: "500 10px var(--font-ui)",
              textTransform: "uppercase",
              letterSpacing: ".22em",
              color: piece.accent,
              marginBottom: 4,
              opacity: 0.85,
            }}
          >
            {piece.type}
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1rem,1.4vw,1.15rem)",
              color: "var(--color-silk)",
              lineHeight: 1.25,
            }}
          >
            {piece.name}
          </p>
        </div>

        {/* hover reveal: view */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(240,230,210,.12)",
            border: "1px solid rgba(240,230,210,.22)",
            borderRadius: 3,
            padding: "0.3rem 0.7rem",
            font: "500 10px var(--font-ui)",
            textTransform: "uppercase",
            letterSpacing: ".16em",
            color: "rgba(240,230,210,.85)",
          }}
        >
          View
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

/* ─── lightbox ───────────────────────────────────────────── */
function Lightbox({
  piece,
  onClose,
}: {
  piece: (typeof PIECES)[0] | null;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!piece) return;
    closeButtonRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [piece, onClose]);

  if (!piece) return null;

  return (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={piece.name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(10,6,4,.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          maxWidth: 520,
          background: piece.bg,
          borderRadius: 8,
          border: "1px solid rgba(181,148,74,.2)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* close */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 2,
            background: "rgba(240,230,210,.1)",
            border: "1px solid rgba(240,230,210,.18)",
            borderRadius: 4,
            padding: "0.3rem",
            cursor: "pointer",
            color: "rgba(240,230,210,.7)",
            lineHeight: 0,
            transition: "background .2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* large SVG */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 3rem 2rem",
          }}
        >
          <svg viewBox="0 0 200 140" style={{ width: "60%", maxWidth: 220 }}>
            <path
              d={piece.svgPath}
              fill="none"
              stroke={piece.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="100" cy="10" r="4" fill={piece.accent} opacity="0.8" />
            <circle cx="100" cy="10" r="8" fill="none" stroke={piece.accent} strokeWidth="0.8" opacity="0.4" />
          </svg>
        </div>

        {/* details */}
        <div
          style={{
            padding: "1.5rem 2rem 2rem",
            borderTop: `1px solid ${piece.accent}22`,
          }}
        >
          <span
            style={{
              display: "block",
              font: "500 10px var(--font-ui)",
              textTransform: "uppercase",
              letterSpacing: ".24em",
              color: piece.accent,
              opacity: 0.8,
              marginBottom: 8,
            }}
          >
            {piece.type}
          </span>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.5rem,3vw,2rem)",
              color: "var(--color-silk)",
              lineHeight: 1.2,
              marginBottom: "0.75rem",
            }}
          >
            {piece.name}
          </h3>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "1.5rem",
            }}
          >
            {[piece.metal, piece.label].map((tag) => (
              <span
                key={tag}
                style={{
                  font: "400 11px var(--font-ui)",
                  color: "rgba(240,230,210,.65)",
                  background: "rgba(240,230,210,.07)",
                  border: "1px solid rgba(240,230,210,.14)",
                  borderRadius: 3,
                  padding: "0.3rem 0.65rem",
                  letterSpacing: ".04em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <p
            style={{
              font: "400 13px var(--font-ui)",
              color: "rgba(240,230,210,.5)",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}
          >
            This piece was commissioned for a private client. Every ami piece
            begins with your story — bring yours and we&apos;ll make it by hand.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── main section ───────────────────────────────────────── */
export default function GallerySection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-6% 0px" });

  const openPiece = PIECES.find((p) => p.id === openId) ?? null;

  return (
    <>
      <section
        id="gallery"
        style={{
          background: "var(--color-kohl)",
          padding: "clamp(5rem,12vw,9rem) clamp(1.5rem,5vw,4rem)",
          position: "relative",
        }}
      >
        {/* arch overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='72' height='100' viewBox='0 0 72 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 100 L12 52 Q12 42 22 38 Q30 34 36 18 Q42 34 50 38 Q60 42 60 52 L60 100' fill='none' stroke='%23B5944A' stroke-width='0.9'/%3E%3C/svg%3E")`,
            backgroundSize: "72px 100px",
            opacity: 0.04,
          }}
        />

        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* header */}
          <div ref={headerRef} style={{ marginBottom: "clamp(2.5rem,5vw,4rem)" }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              style={{
                display: "block",
                font: "500 10.5px var(--font-ui)",
                textTransform: "uppercase",
                letterSpacing: ".32em",
                color: "rgba(181,148,74,.7)",
                marginBottom: 18,
              }}
            >
              Past commissions
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
                color: "var(--color-silk)",
                lineHeight: 1.15,
                maxWidth: "22ch",
              }}
            >
              Pieces that began with{" "}
              <em style={{ fontStyle: "normal", color: "var(--color-gold-lit)" }}>
                someone's photograph.
              </em>
            </motion.h2>
          </div>

          {/* grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gridAutoRows: "220px",
              gap: "1rem",
            }}
          >
            {PIECES.map((piece, i) => (
              <PieceCard
                key={piece.id}
                piece={piece}
                index={i}
                onOpen={setOpenId}
              />
            ))}
          </div>

          {/* footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              font: "400 12.5px var(--font-ui)",
              color: "rgba(240,230,210,.35)",
              textAlign: "center",
              marginTop: "2.5rem",
              letterSpacing: ".04em",
            }}
          >
            All pieces shown are past commissions, shared with client permission.
            Every new commission begins from scratch — yours alone.
          </motion.p>
        </div>
      </section>

      {/* lightbox */}
      <AnimatePresence>
        {openId && (
          <Lightbox piece={openPiece} onClose={() => setOpenId(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

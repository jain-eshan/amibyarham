"use client";

import { useRef } from "react";
import Image from "next/image";

const HOUSE_LINKS = [
  { label: "Our story", href: "#story" },
  { label: "How it works", href: "#process" },
  { label: "Our promise", href: "#trust" },
  { label: "Pricing", href: "#pricing" },
] as const;

const REACH_LINKS = [
  { label: "Instagram", href: "https://instagram.com/amibyarham", external: true },
  { label: "WhatsApp", href: "https://wa.me/919958863129", external: true },
  { label: "hello@amibyarham.com", href: "mailto:hello@amibyarham.com", external: false },
] as const;

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        background: "var(--color-kohl)",
        color: "var(--color-silk)",
        padding: "clamp(3.5rem,7vw,5rem) clamp(1.25rem,4vw,3rem) 2.25rem",
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

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr",
          gap: "2.5rem",
          alignItems: "start",
        }}
        className="footer-grid"
      >
        {/* Brand column */}
        <div>
          <Image
            src="/assets/ami-wordmark-silk.png"
            alt="ami by arham"
            width={160}
            height={32}
            style={{ width: 160, height: "auto" }}
          />
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "1.2rem",
              color: "var(--color-gold-lit)",
              marginTop: "1.1rem",
            }}
          >
            The beloved, made by hand.
          </p>
          <p
            style={{
              fontSize: ".95rem",
              lineHeight: 1.7,
              color: "rgba(240,230,210,.6)",
              marginTop: ".75rem",
              maxWidth: "34ch",
            }}
          >
            A house with no catalogue. You bring the piece — we make it real,
            by one named pair of hands. Old Delhi · est. 2026.
          </p>
        </div>

        {/* The house column */}
        <div>
          <p
            style={{
              font: "500 10px var(--font-ui)",
              textTransform: "uppercase",
              letterSpacing: ".2em",
              color: "var(--color-gold)",
              marginBottom: "1rem",
            }}
          >
            The house
          </p>
          {HOUSE_LINKS.map(({ label, href }) => (
            <FooterLink key={href} href={href} label={label} />
          ))}
        </div>

        {/* Reach column */}
        <div>
          <p
            style={{
              font: "500 10px var(--font-ui)",
              textTransform: "uppercase",
              letterSpacing: ".2em",
              color: "var(--color-gold)",
              marginBottom: "1rem",
            }}
          >
            Reach us
          </p>
          {REACH_LINKS.map(({ label, href, external }) => (
            <FooterLink
              key={href}
              href={href}
              label={label}
              external={external}
            />
          ))}
        </div>
      </div>

      {/* Footer base */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "2.5rem auto 0",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(181,148,74,.16)",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <span style={{ font: "400 11px var(--font-ui)", letterSpacing: ".06em", color: "rgba(240,230,210,.4)" }}>
          © 2026 Arham Diamonds. All rights reserved.
        </span>
        <span style={{ font: "400 11px var(--font-ui)", letterSpacing: ".06em", color: "rgba(240,230,210,.4)" }}>
          Made by hand in Old Delhi.
        </span>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2.25rem !important;
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{
        display: "block",
        fontSize: ".95rem",
        color: "rgba(240,230,210,.62)",
        padding: ".3rem 0",
        transition: "color .3s",
      }}
      onMouseEnter={() => {
        if (ref.current) ref.current.style.color = "var(--color-gold-lit)";
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.color = "rgba(240,230,210,.62)";
      }}
    >
      {label}
    </a>
  );
}


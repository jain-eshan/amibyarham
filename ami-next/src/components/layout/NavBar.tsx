"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const LINKS = [
  { label: "The House", href: "#story" },
  { label: "How It Works", href: "#process" },
  { label: "Our Promise", href: "#trust" },
] as const;

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
        ticking.current = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-60 transition-[background,border-color] duration-500"
      style={{
        padding: "0 clamp(1.25rem,4vw,3rem)",
        background: scrolled ? "rgba(26,20,17,.82)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(181,148,74,.16)"
          : "1px solid transparent",
      }}
    >
      <div
        className="flex items-center justify-between mx-auto"
        style={{ maxWidth: 1200, height: 74 }}
      >
        {/* Logo */}
        <a href="#" aria-label="ami by arham — home">
          <Image
            src="/assets/ami-wordmark-silk.png"
            alt="ami by arham"
            width={120}
            height={38}
            style={{ height: 38, width: "auto" }}
            priority
          />
        </a>

        {/* Right side */}
        <div
          className="flex items-center"
          style={{ gap: "clamp(1.25rem,3vw,2.25rem)" }}
        >
          <ul
            className="flex items-center list-none"
            style={{ gap: "clamp(1.25rem,3vw,2rem)" }}
          >
            {LINKS.map(({ label, href }) => (
              <li key={href} className="max-[680px]:hidden last:max-[680px]:flex">
                <a
                  href={href}
                  onClick={(e) => handleAnchor(e, href)}
                  className="transition-colors duration-300"
                  style={{
                    font: "500 11px var(--font-ui)",
                    textTransform: "uppercase",
                    letterSpacing: ".14em",
                    color: "rgba(240,230,210,.72)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--color-gold-lit)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "rgba(240,230,210,.72)")
                  }
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={() => {/* commission modal — wired when modal is built */}}
            className="transition-[background,transform] duration-300 hover:-translate-y-px"
            style={{
              font: "500 10.5px var(--font-ui)",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              color: "var(--color-kohl)",
              background: "var(--color-gold-lit)",
              padding: ".6rem 1.2rem",
              borderRadius: 3,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "var(--color-gold)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "var(--color-gold-lit)")
            }
          >
            Start your piece
          </button>
        </div>
      </div>
    </nav>
  );
}

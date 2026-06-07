"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/BrandMark";

const MENU_LINKS = [
  { label: "Our Story", href: "/story" },
  { label: "Contact", href: "/contact" },
  { label: "Admin Login", href: "/admin/login" },
] as const;

/**
 * Header: brand wordmark centered, hamburger toggle on the right that opens a
 * full-screen cream sheet with the three top-level links. Per APP_FLOW the
 * primary navigation is always hidden behind the toggle — there is no
 * persistent horizontal menu.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full border-b border-hairline-soft bg-canvas/85 backdrop-blur">
        <div className="relative mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
          {/* Left spacer keeps the wordmark visually centered without absolute positioning. */}
          <span className="w-10" aria-hidden />

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 transform"
            aria-label="AMI by Arham home"
          >
            <BrandMark size={22} />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="primary-menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <HamburgerIcon />
          </button>
        </div>
      </header>

      {open && (
        <div
          id="primary-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Primary navigation"
          className="fixed inset-0 z-50 flex flex-col bg-canvas"
        >
          <div className="flex h-16 items-center justify-between border-b border-hairline-soft px-6">
            <span className="w-10" aria-hidden />
            <BrandMark size={22} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center gap-2 px-6 pb-24">
            {MENU_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="display-lg text-ink transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="3" y1="6" x2="17" y2="6" />
      <line x1="3" y1="14" x2="17" y2="14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="4" y1="4" x2="16" y2="16" />
      <line x1="16" y1="4" x2="4" y2="16" />
    </svg>
  );
}

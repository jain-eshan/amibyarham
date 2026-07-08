import type { ReactNode } from "react";

/**
 * Elegant single-stroke glyphs for the jewellery types used across the
 * discover flow. Keyed by the JEWELRY_TYPES vocabulary in lib/filters.ts;
 * unknown types fall back to the brand spark.
 */
const GLYPHS: Record<string, ReactNode> = {
  Ring: (
    <>
      <circle cx="12" cy="14.5" r="6" />
      <path d="M12 1.5 15 4.5 12 7.5 9 4.5Z" />
    </>
  ),
  Necklace: (
    <>
      <path d="M4 4c1.5 6 5 8.5 8 8.5s6.5-2.5 8-8.5" />
      <path d="M12 12.5V15" />
      <path d="M12 15l2.4 2.4L12 19.8l-2.4-2.4Z" />
    </>
  ),
  Earrings: (
    <>
      <circle cx="8" cy="4.6" r="1.4" />
      <path d="M8 6v2.6" />
      <path d="M8 8.6c2 1 2.6 2.6 2.6 4a2.6 2.6 0 1 1-5.2 0c0-1.4.6-3 2.6-4Z" />
      <circle cx="16" cy="4.6" r="1.4" />
      <path d="M16 6v2.6" />
      <path d="M16 8.6c2 1 2.6 2.6 2.6 4a2.6 2.6 0 1 1-5.2 0c0-1.4.6-3 2.6-4Z" />
    </>
  ),
  Bracelet: (
    <>
      <ellipse cx="12" cy="12" rx="8.5" ry="5.5" />
      <circle cx="20.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  Pendant: (
    <>
      <path d="M4 3l8 8 8-8" />
      <path d="M12 11v2" />
      <path d="M12 13l3 3-3 3-3-3Z" />
    </>
  ),
  Set: (
    <>
      <path d="M12 3l2.5 2.5L12 8 9.5 5.5Z" />
      <path d="M6.5 12L9 14.5 6.5 17 4 14.5Z" />
      <path d="M17.5 12L20 14.5 17.5 17 15 14.5Z" />
    </>
  ),
  Mangalsutra: (
    <>
      <path d="M5 3c2 6 4.5 8.5 7 8.5S17 9 19 3" />
      <circle cx="7.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16.8" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      <path d="M12 11.5V14" />
      <path d="M12 14l2 2-2 2-2-2Z" />
    </>
  ),
  "Maang Tikka": (
    <>
      <path d="M5 5c3-2.5 11-2.5 14 0" />
      <path d="M12 3.8v3.4" />
      <path d="M12 7.2c2 1.2 2.8 2.8 2.8 4.2a2.8 2.8 0 1 1-5.6 0c0-1.4.8-3 2.8-4.2Z" />
    </>
  ),
  "Nose Pin": (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 5.5v2.5M12 16v2.5M5.5 12H8M16 12h2.5" />
      <path d="M8 8l1.4 1.4M14.6 14.6L16 16M16 8l-1.4 1.4M9.4 14.6L8 16" />
    </>
  ),
  Bangle: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
};

export function JewelryTypeIcon({ type }: { type: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden
    >
      {GLYPHS[type] ?? <path d="M12 4l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" />}
    </svg>
  );
}

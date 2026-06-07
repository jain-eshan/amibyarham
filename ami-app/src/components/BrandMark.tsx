import type { CSSProperties } from "react";

type BrandMarkProps = {
  /** Size of the wordmark in pixels (height of the cap-height letters). */
  size?: number;
  /** Tone — light variant is used on dark surfaces (footer). */
  tone?: "ink" | "cream";
  className?: string;
};

/**
 * Placeholder AMI by Arham wordmark. Swap with the official SVG drop-in at
 * `public/brand/ami-mark.svg` once provided.
 */
export function BrandMark({
  size = 22,
  tone = "ink",
  className,
}: BrandMarkProps) {
  const color = tone === "ink" ? "var(--color-ink)" : "var(--color-on-dark)";
  const subColor =
    tone === "ink" ? "var(--color-muted)" : "var(--color-on-dark-soft)";

  const style: CSSProperties = { color };

  return (
    <span
      aria-label="AMI by Arham"
      className={className}
      style={{ display: "inline-flex", alignItems: "baseline", gap: 8 }}
    >
      <span
        style={{
          ...style,
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: size,
          letterSpacing: "0.04em",
          lineHeight: 1,
        }}
      >
        AMI
      </span>
      <span
        style={{
          color: subColor,
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          fontSize: Math.max(10, Math.round(size * 0.45)),
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        by Arham
      </span>
    </span>
  );
}

import Image from "next/image";

type BrandMarkProps = {
  /** Rendered height of the wordmark in pixels. */
  size?: number;
  /** Tone — `cream` is used on dark surfaces (footer); `ink` on light. */
  tone?: "ink" | "cream";
  className?: string;
};

// Source SVG viewBox is 187.5 × 75 → ratio 2.5:1.
const ASPECT = 187.5 / 75;

export function BrandMark({ size = 28, tone = "ink", className }: BrandMarkProps) {
  const src = tone === "ink" ? "/brand/ami-mark-ink.svg" : "/brand/ami-mark-cream.svg";
  return (
    <Image
      src={src}
      alt="AMI by Arham"
      width={Math.round(size * ASPECT)}
      height={size}
      priority
      className={className}
      style={{ height: size, width: "auto" }}
    />
  );
}

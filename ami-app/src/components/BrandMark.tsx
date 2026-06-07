type BrandMarkProps = {
  /** Rendered height in pixels. Width derives from the SVG aspect ratio (1.5). */
  size?: number;
  /** Light variant for use on the dark footer. Wine glyphs flip to cream. */
  tone?: "ink" | "cream";
  className?: string;
};

const VIEWBOX_W = 240;
const VIEWBOX_H = 160;
const SVG_ASPECT = VIEWBOX_W / VIEWBOX_H;

/**
 * AMI by Arham wordmark. Inline SVG so we can recolour the wine glyphs to
 * cream on dark surfaces without a second asset, and so it loads with zero
 * network requests. The serif type is hard-coded into the SVG so the mark
 * never depends on whether Cormorant Garamond has finished loading.
 */
export function BrandMark({
  size = 28,
  tone = "ink",
  className,
}: BrandMarkProps) {
  const typeColor = tone === "ink" ? "#6e1b2e" : "#faf9f5";
  const goldColor = "#b5944a";
  const width = Math.round(size * SVG_ASPECT);
  const serif =
    "Cormorant Garamond, Tiempos Headline, EB Garamond, Garamond, 'Times New Roman', serif";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={size}
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      role="img"
      aria-label="AMI by Arham"
      className={className}
    >
      <text
        x="0"
        y="118"
        fontFamily={serif}
        fontSize="148"
        fontWeight={500}
        fill={typeColor}
        letterSpacing="-3"
      >
        ami
      </text>

      {/* 4-point sparkle replacing the i-dot. */}
      <path
        d="M 215 18 L 220 38 L 240 43 L 220 48 L 215 68 L 210 48 L 190 43 L 210 38 Z"
        fill={goldColor}
      />

      <text
        x={VIEWBOX_W}
        y="155"
        textAnchor="end"
        fontFamily={serif}
        fontSize="32"
        fontWeight={500}
        fill={typeColor}
      >
        by arham
      </text>
    </svg>
  );
}

type Props = {
  size?: number;
  color?: string;
  sparkleColor?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export default function BrandLogo({
  size = 180,
  color = "var(--color-oxblood)",
  sparkleColor = "var(--color-gold-lit)",
  className,
  style,
  title = "ami by arham",
}: Props) {
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={className}
      style={style}
    >
      <title>{title}</title>
      {/* four-point sparkle above the dot of the 'i' */}
      <path
        d="M180 30 L183.2 52 L205 55.2 L183.2 58.4 L180 80 L176.8 58.4 L155 55.2 L176.8 52 Z"
        fill={sparkleColor}
      />
      <text
        x="120"
        y="170"
        textAnchor="middle"
        fontFamily="var(--font-display), 'Bodoni Moda', 'Playfair Display', Georgia, serif"
        fontWeight="500"
        fontSize="148"
        fill={color}
        letterSpacing="-2"
      >
        ami
      </text>
      <text
        x="155"
        y="215"
        textAnchor="middle"
        fontFamily="var(--font-display), 'Bodoni Moda', 'Playfair Display', Georgia, serif"
        fontWeight="400"
        fontSize="34"
        fill={color}
        letterSpacing="0.5"
      >
        by arham
      </text>
    </svg>
  );
}

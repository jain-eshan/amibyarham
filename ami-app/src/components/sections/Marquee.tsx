const PHRASES = [
  "A modern royal heirloom",
  "Made for you",
  "Lab-grown brilliance",
  "Heritage gold",
  "Commissioned, never catalogued",
] as const;

export function Marquee() {
  // Duplicate for a seamless -50% translate loop.
  const items = [...PHRASES, ...PHRASES];

  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-hairline-soft bg-canvas py-10"
    >
      <div className="ami-marquee flex w-max items-center gap-12 whitespace-nowrap">
        {items.map((p, i) => (
          <span key={i} className="flex items-center gap-12">
            <span
              className="text-2xl text-ink md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {p}
            </span>
            <span className="text-primary" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

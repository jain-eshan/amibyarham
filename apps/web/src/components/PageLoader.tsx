const DEFAULT_WORDS = ["Sketching", "Setting", "Polishing"] as const;

/**
 * On-brand route loading state: a ring stroke circling like a bench sketch,
 * the brand spark breathing in the centre, and craft words cycling beneath.
 * Pure CSS (keyframes live in globals.css) so it paints instantly while the
 * route's server components render.
 */
export function PageLoader({
  words = DEFAULT_WORDS,
}: {
  words?: readonly string[];
}) {
  // Duplicate the first word at the end so the upward cycle loops seamlessly.
  const cycle = [...words, words[0]];

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-7 bg-canvas px-6"
    >
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="ami-loader-ring h-full w-full">
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth="1.5"
          />
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="58 105"
          />
        </svg>
        <span
          aria-hidden
          className="ami-loader-spark absolute inset-0 flex items-center justify-center text-xl text-primary"
        >
          ✦
        </span>
      </div>

      <div aria-hidden className="h-[1.6em] overflow-hidden text-center">
        <div className="ami-loader-words">
          {cycle.map((word, i) => (
            <p
              key={`${word}-${i}`}
              className="text-lg leading-[1.6em] text-muted"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {word}…
            </p>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

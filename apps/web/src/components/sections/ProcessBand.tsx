import { Reveal } from "@/components/Reveal";

function LotusPattern() {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  const dots = petals;
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ color: "var(--color-primary)", opacity: 0.1 }}
    >
      <defs>
        <pattern id="lotus-process" x="0" y="0" width="88" height="88" patternUnits="userSpaceOnUse">
          {/* Central dot */}
          <circle cx="44" cy="44" r="2.8" fill="currentColor" />
          {/* 8 petals */}
          {petals.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 44 + Math.cos(rad) * 15;
            const cy = 44 + Math.sin(rad) * 15;
            return (
              <ellipse
                key={deg}
                cx={cx}
                cy={cy}
                rx="4"
                ry="9"
                transform={`rotate(${deg + 90}, ${cx}, ${cy})`}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
              />
            );
          })}
          {/* Outer ring */}
          <circle cx="44" cy="44" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
          {/* Tip dots */}
          {dots.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle
                key={deg}
                cx={44 + Math.cos(rad) * 28}
                cy={44 + Math.sin(rad) * 28}
                r="1.4"
                fill="currentColor"
              />
            );
          })}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lotus-process)" />
    </svg>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Share the reference",
    body: "Upload a screenshot, paste a Pinterest link, send a reel, or show us an old family photo.",
  },
  {
    n: "02",
    title: "Tell us the occasion",
    body: "Wedding, engagement, gifting, self-purchase, budget, timeline, and who needs to approve it.",
  },
  {
    n: "03",
    title: "Craftsman feasibility",
    body: "AMI reviews what can be made, what should change, and which craft or material will hold the look.",
  },
  {
    n: "04",
    title: "Consult before making",
    body: "You get a call or WhatsApp update within 24 hours before any commitment, advance, or production.",
  },
] as const;

export function ProcessBand() {
  return (
    <section className="relative overflow-hidden border-t border-hairline-soft bg-canvas py-section">
      <LotusPattern />
      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="caption-uppercase text-muted">
                How it works
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-lg mt-6 text-ink">
                First, we tell you what is{" "}
                <em className="not-italic text-primary">possible</em>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-body">
              The first step is not a sale. It is a feasibility conversation:
              can this be made, will it wear well, and what choices will affect
              the budget?
            </p>
          </Reveal>
        </div>

        <ol className="mt-16 grid gap-8 md:mt-20 md:grid-cols-4 md:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.n}>
              <Reveal delay={0.1 + i * 0.06}>
                <div className="h-full border-t-2 border-ink pt-6">
                  <span className="font-mono text-sm tracking-widest text-muted">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-lg font-medium text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-body">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

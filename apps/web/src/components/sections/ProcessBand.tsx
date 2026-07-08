import { Reveal } from "@/components/Reveal";
import { LottiePlayer } from "@/components/LottiePlayer";

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
    illustration: "reference",
    title: "Share the reference",
    body: "Upload a screenshot, paste a Pinterest link, send a reel, or show us an old family photo.",
  },
  {
    n: "02",
    illustration: "occasion",
    title: "Tell us the occasion",
    body: "Wedding, engagement, gifting, self-purchase, budget, timeline, and who needs to approve it.",
  },
  {
    n: "03",
    illustration: "feasibility",
    title: "Craftsman feasibility",
    body: "AMI reviews what can be made, what should change, and which craft or material will hold the look.",
  },
  {
    n: "04",
    illustration: "consult",
    title: "Consult before making",
    body: "You get a call or WhatsApp update within 24 hours before any commitment, advance, or production.",
  },
] as const;

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to commission custom jewellery with AMI by Arham",
  description:
    "Send a reference, share the occasion, get a craftsman feasibility review, then consult before any commitment.",
  step: STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.body,
  })),
};

export function ProcessBand() {
  return (
    <section className="relative overflow-hidden border-t border-hairline-soft bg-canvas py-16 md:py-18 lg:py-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
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

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className="overflow-hidden rounded-2xl border border-white/70 bg-[#f2eee8]/80 shadow-[10px_14px_28px_rgba(48,39,31,0.10),-10px_-10px_24px_rgba(255,255,255,0.82)] backdrop-blur-sm"
            >
              <Reveal delay={0.1 + i * 0.06}>
                <div className="grid h-full grid-rows-[auto_1fr]">
                  <div className="px-4 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg border border-hairline bg-canvas px-2.5 py-1 font-mono text-[11px] tracking-widest text-muted shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(48,39,31,0.06)]">
                        {s.n}
                      </span>
                      <span className="ml-4 block h-px flex-1 bg-hairline-soft" />
                    </div>
                    <div className="mt-4 overflow-hidden rounded-xl bg-[#f7f5f1] text-ink/45 shadow-[inset_4px_4px_12px_rgba(48,39,31,0.06),inset_-5px_-5px_14px_rgba(255,255,255,0.95)]">
                      {s.illustration === "reference" ? (
                        <div className="flex aspect-[16/10] items-center justify-center overflow-hidden">
                          <div className="scale-[1.2] w-full h-full">
                            <LottiePlayer src="/step-01-photobook.json" />
                          </div>
                        </div>
                      ) : s.illustration === "occasion" ? (
                        <div className="flex aspect-[16/10] items-center justify-center overflow-hidden">
                          <div className="scale-[1.45] w-full h-full">
                            <LottiePlayer src="/step-02-discussion.json" />
                          </div>
                        </div>
                      ) : s.illustration === "feasibility" ? (
                        <video
                          src="/process-step-03.mp4"
                          poster="/submit-feasibility-example.jpg"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="aspect-[16/10] w-full object-cover"
                        />
                      ) : (
                        <video
                          src="/process-step-04.mp4"
                          poster="/submit-response-example.jpg"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="aspect-[16/10] w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <div className="px-4 py-5 md:px-5">
                    <h3 className="text-base font-medium leading-snug text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-body">
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepIllustration({
  type,
}: {
  type: (typeof STEPS)[number]["illustration"];
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.5,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 112"
      className="h-full w-full max-w-[190px] p-4"
    >
      {type === "reference" && (
        <>
          <rect x="30" y="26" width="52" height="64" rx="4" {...common} />
          <path d="M42 74l12-14 9 9 7-8 12 13" {...common} />
          <circle cx="65" cy="43" r="5" {...common} />
          <path d="M94 38h42M94 52h32M94 66h38" {...common} />
          <path d="M34 20h54M25 30v55" {...common} opacity="0.35" />
        </>
      )}
      {type === "occasion" && (
        <>
          <rect x="38" y="22" width="104" height="70" rx="6" {...common} />
          <path d="M58 43h64M58 57h48M58 71h56" {...common} />
          <path d="M64 20v14M116 20v14" {...common} />
          <path d="M44 38h92" {...common} opacity="0.35" />
          <circle cx="132" cy="78" r="11" {...common} />
          <path d="M127 78l4 4 7-9" {...common} />
        </>
      )}
      {type === "feasibility" && (
        <>
          <path d="M49 77l26-42 26 42H49z" {...common} />
          <path d="M78 36l34 41" {...common} opacity="0.55" />
          <path d="M63 58h50M72 45h31" {...common} opacity="0.55" />
          <circle cx="121" cy="45" r="18" {...common} />
          <path d="M134 58l17 17" {...common} />
          <path d="M115 45l5 5 10-13" {...common} />
        </>
      )}
      {type === "consult" && (
        <>
          <rect x="38" y="28" width="54" height="38" rx="5" {...common} />
          <path d="M50 80l15-14h27" {...common} />
          <rect x="94" y="48" width="50" height="34" rx="5" {...common} />
          <path d="M131 93l-14-11H94" {...common} />
          <path d="M50 43h30M50 53h19M106 62h26M106 72h18" {...common} />
          <circle cx="140" cy="35" r="8" {...common} opacity="0.55" />
        </>
      )}
    </svg>
  );
}

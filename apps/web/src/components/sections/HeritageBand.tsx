import { Reveal } from "@/components/Reveal";

const SPECS = [
  ["Legacy", "50 years in jewellery"],
  ["Access", "Polki · Jadau · Diamond · Gold"],
  ["Consult", "Call or WhatsApp within 24 hours"],
  ["Assurance", "Hallmarking and certification where applicable"],
] as const;

export function HeritageBand() {
  return (
    <section className="relative overflow-hidden bg-surface-dark py-section text-on-dark">
      <Halo />

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-12 gap-8 px-6">
        <div className="col-span-12 md:col-span-7">
          <Reveal>
            <p className="caption-uppercase text-on-dark-soft">Why trust AMI</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-[18ch] text-on-dark">
              The comfort of a{" "}
              <em className="not-italic text-accent-amber">family jeweller</em>,
              with the convenience of online.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-on-dark-soft md:text-lg">
              AMI brings Arham&rsquo;s Delhi jewellery legacy online: a real
              person to speak with, craftsmen who understand traditional and
              modern work, and clear checkpoints before anything is made.
            </p>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-5">
          <Reveal delay={0.12}>
            <div className="rounded-lg border border-white/10 bg-surface-dark-elevated p-8">
              <div className="flex items-baseline justify-between">
                <p className="caption-uppercase text-on-dark-soft">Trust signals</p>
                <span aria-hidden className="text-primary">
                  ✦
                </span>
              </div>
              <dl className="mt-6 divide-y divide-white/10">
                {SPECS.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-6 py-4"
                  >
                    <dt className="text-sm text-on-dark-soft">{k}</dt>
                    <dd
                      className="text-right text-on-dark"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 22,
                        lineHeight: 1.2,
                      }}
                    >
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Halo() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 opacity-40"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(204,120,92,0.20), transparent 60%)",
      }}
    />
  );
}

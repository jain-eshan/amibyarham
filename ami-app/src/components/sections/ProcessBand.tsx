import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Share the vision",
    body: "A link, a screenshot, or a swipe board — however it lives in your mind.",
  },
  {
    n: "02",
    title: "A conversation",
    body: "We reach out within 24 hours. Refinements happen over WhatsApp.",
  },
  {
    n: "03",
    title: "Bench & stone",
    body: "Wax, CAD, casting. Lab-grown diamonds selected and certified per piece.",
  },
  {
    n: "04",
    title: "The heirloom",
    body: "Delivered to you. Insured. Photographed for your archive.",
  },
] as const;

export function ProcessBand() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="caption-uppercase text-muted">
                From idea to heirloom
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-lg mt-6 text-ink">
                Four steps.{" "}
                <em className="not-italic text-primary">No catalogue.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-body">
              Every commission moves at your pace. No timelines we don&rsquo;t
              honour, no estimates we can&rsquo;t hold.
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

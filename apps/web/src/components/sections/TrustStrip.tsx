import { Reveal } from "@/components/Reveal";

const TRUST_POINTS = [
  {
    label: "Legacy",
    value: "50 years in jewellery",
  },
  {
    label: "Craft access",
    value: "Polki · Jadau · Diamond · Gold",
  },
  {
    label: "First answer",
    value: "Feasibility within 24 hours",
  },
  {
    label: "Assurance",
    value: "Approvals before making",
  },
] as const;

export function TrustStrip() {
  return (
    <section className="border-y border-hairline-soft bg-surface-soft py-5">
      <div className="mx-auto grid max-w-[1200px] gap-4 px-6 md:grid-cols-4">
        {TRUST_POINTS.map((point, index) => (
          <Reveal key={point.label} delay={index * 0.04}>
            <article className="flex h-full items-baseline justify-between gap-4 border-l border-hairline pl-5 md:block">
              <p className="caption-uppercase text-muted">{point.label}</p>
              <h2 className="text-right text-base font-medium text-ink md:mt-2 md:text-left">
                {point.value}
              </h2>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

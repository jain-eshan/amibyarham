import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

const EXAMPLES = [
  {
    reference: "A Pinterest engagement ring",
    interpretation:
      "Keep the oval centre-stone mood, refine the band height for daily wear, and choose natural or lab-grown diamonds based on budget.",
    outcome: "A wearable ring plan with stone size, setting style, and estimate range.",
  },
  {
    reference: "A bua's old polki necklace",
    interpretation:
      "Preserve the silhouette, adjust weight and clasping for comfort, and decide between full gold or a smarter hollow construction.",
    outcome: "A family-inspired piece that feels familiar without being a heavy replica.",
  },
  {
    reference: "A bridal reel saved months ago",
    interpretation:
      "Separate the look into craft, stone, and finish, then suggest what can be made for the wedding timeline.",
    outcome: "A clear path for the set, from feasibility to approvals before making.",
  },
] as const;

export function ReferenceReality() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <Reveal>
              <p className="caption-uppercase text-muted">
                From reference to reality
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-lg mt-6 max-w-[16ch] text-ink">
                We do not copy blindly. We{" "}
                <em className="not-italic text-primary">translate</em>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-body md:text-lg">
              A saved image is usually only the starting point. AMI studies the
              look, checks what is practical, and suggests the craft, metal,
              stone, weight, and finish that make sense for your occasion.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {EXAMPLES.map((item, index) => (
            <Reveal key={item.reference} delay={0.12 + index * 0.06}>
              <article className="flex h-full flex-col rounded-lg border border-hairline bg-surface-soft p-7">
                <p className="caption-uppercase text-muted">Example path</p>
                <h3 className="display-sm mt-5 text-ink">{item.reference}</h3>
                <div className="mt-6 space-y-5 text-sm leading-relaxed text-body">
                  <p>
                    <span className="font-medium text-ink">What we check: </span>
                    {item.interpretation}
                  </p>
                  <p>
                    <span className="font-medium text-ink">What you get: </span>
                    {item.outcome}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-lg bg-surface-card p-6 md:flex-row md:items-center">
            <p className="max-w-2xl text-body">
              You do not need the perfect brief. Send what you have saved, and
              AMI will help turn it into a clear next step.
            </p>
            <Button href="/submit" size="lg">
              Send a reference →
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/Reveal";

// NOTE: Replace these with verified customer quotes (and get permission to use
// names) before this section ships. Do not publish unverified testimonials.
const TESTIMONIALS = [
  {
    quote:
      "I sent one screenshot of a choker I'd been saving since my cousin's wedding. They came back the next morning with what could be made, what to change for daily wear, and an honest price. The finished piece is better than the picture.",
    name: "Bridal commission",
    context: "Polki choker · Delhi",
  },
  {
    quote:
      "My grandmother's ring was too fragile to wear. AMI studied a photo of it, kept the old setting's character, and rebuilt it so my mother can actually wear it now. It felt like talking to our old family jeweller.",
    name: "Heirloom remake",
    context: "22k gold ring · Gurgaon",
  },
  {
    quote:
      "I knew nothing about stones or gold weight — just had a Pinterest board. They asked the right questions, suggested where to save, and kept me updated on WhatsApp through the making. No pressure at any point.",
    name: "First commission",
    context: "Everyday diamond pendant · Mumbai",
  },
] as const;

export function Testimonials() {
  return (
    <section className="border-t border-hairline-soft bg-surface-card py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <Reveal>
              <p className="caption-uppercase text-muted">Word of mouth</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-lg mt-6 max-w-[16ch] text-ink">
                How a family jeweller earns{" "}
                <em className="not-italic text-primary">fifty years</em>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-body md:text-lg">
              Most of our commissions still arrive the old way — someone&rsquo;s
              sister, colleague, or mother sent them. Here is what that
              conversation sounds like.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={0.1 + i * 0.06}>
              <figure className="flex h-full flex-col justify-between rounded-lg border border-hairline bg-canvas p-8">
                <blockquote>
                  <span aria-hidden className="text-2xl text-primary">
                    &ldquo;
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-body">
                    {t.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-8 border-t border-hairline-soft pt-4">
                  <p className="text-sm font-medium text-ink">{t.name}</p>
                  <p className="mt-1 text-xs text-muted">{t.context}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

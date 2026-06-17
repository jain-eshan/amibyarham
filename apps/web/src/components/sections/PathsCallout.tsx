import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

export function PathsCallout() {
  return (
    <section className="bg-canvas pb-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <p className="caption-uppercase text-muted">Before you begin</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display-lg mt-6 max-w-3xl text-ink">
            Ask what is possible before you commit.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["No pressure", "The first response is feasibility and direction, not a demand for an advance."],
            ["Family friendly", "Loop in a partner, parent, or family member before finalising the piece."],
            ["Clear checkpoints", "Design, material, quote, and production move only after your approval."],
          ].map(([title, body], index) => (
            <Reveal key={title} delay={0.08 + index * 0.06}>
              <article className="h-full rounded-lg border border-hairline bg-surface-soft p-6">
                <h3 className="text-base font-medium text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-body">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          <Reveal delay={0.1}>
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-lg bg-primary p-10 text-on-primary md:p-12">
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="caption-uppercase opacity-80">Start here</p>
                  <span aria-hidden className="opacity-60">
                    ✦
                  </span>
                </div>
                <h3 className="display-md mt-6 text-on-primary">
                  Send Your Reference
                </h3>
                <p className="mt-5 max-w-sm text-base opacity-90">
                  Share the photo, link, reel, or board. We&rsquo;ll review it
                  with our craftsmen and tell you what can be made within your
                  occasion, timeline, and budget. No commitment to ask.
                </p>
              </div>
              <Button
                href="/submit"
                variant="primary-on-coral"
                size="lg"
                className="mt-10 self-start"
              >
                Send reference →
              </Button>
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -bottom-24 h-56 w-56 rounded-full bg-white/5 transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </article>
          </Reveal>

          <Reveal delay={0.18}>
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-hairline bg-canvas p-10 text-ink md:p-12">
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="caption-uppercase text-muted">Browse first</p>
                  <span aria-hidden className="text-primary">
                    ✦
                  </span>
                </div>
                <h3 className="display-md mt-6 text-ink">
                  Build an inspiration board
                </h3>
                <p className="mt-5 max-w-sm text-base text-body">
                  Swipe through styles for rings, polki, jadau, diamonds, gold,
                  and everyday fine jewellery. Send the board when it starts to
                  feel like you.
                </p>
              </div>
              <Button href="/discover" size="lg" className="mt-10 self-start">
                Discover inspiration →
              </Button>
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -bottom-24 h-56 w-56 rounded-full bg-surface-card transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

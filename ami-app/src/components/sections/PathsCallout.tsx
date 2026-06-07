import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

export function PathsCallout() {
  return (
    <section className="bg-canvas pb-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <p className="caption-uppercase text-muted">The decision</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display-lg mt-6 max-w-3xl text-ink">
            Two ways to <em className="not-italic text-primary">begin</em>.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          <Reveal delay={0.1}>
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-lg bg-primary p-10 text-on-primary md:p-12">
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="caption-uppercase opacity-80">Path A</p>
                  <span aria-hidden className="opacity-60">
                    ✦
                  </span>
                </div>
                <h3 className="display-md mt-6 text-on-primary">
                  Submit Your Vision
                </h3>
                <p className="mt-5 max-w-sm text-base opacity-90">
                  You already have the piece in your head. Send the reference —
                  Pinterest link, Instagram reel, or screenshot. Quote within
                  24 hours.
                </p>
              </div>
              <Button
                href="/submit"
                variant="primary-on-coral"
                size="lg"
                className="mt-10 self-start"
              >
                Start with a reference →
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
                  <p className="caption-uppercase text-muted">Path B</p>
                  <span aria-hidden className="text-brand-gold">
                    ✦
                  </span>
                </div>
                <h3 className="display-md mt-6 text-ink">
                  Discover Inspiration
                </h3>
                <p className="mt-5 max-w-sm text-base text-body">
                  Swipe through the studio&rsquo;s curated catalogue. Right for
                  love, left for not-today. Send us the board when it feels
                  like you.
                </p>
              </div>
              <Button href="/discover" size="lg" className="mt-10 self-start">
                Open the swipe engine →
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

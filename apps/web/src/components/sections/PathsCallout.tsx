import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

export function PathsCallout() {
  return (
    <section className="bg-canvas pb-section">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal delay={0.1}>
          <article className="group relative flex flex-col justify-between overflow-hidden rounded-lg bg-primary p-10 text-on-primary md:p-12">
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
      </div>
    </section>
  );
}

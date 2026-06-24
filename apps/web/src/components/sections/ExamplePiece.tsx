import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";

export function ExamplePiece() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <p className="caption-uppercase text-muted">The kind of piece we make</p>
        </Reveal>

        <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_48px_1fr]">
          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-hairline-soft bg-surface-soft p-6 md:p-8">
              <p className="caption-uppercase text-muted">The reference</p>
              <p className="mt-4 text-lg font-medium leading-snug text-ink">
                A reel saved from a Sabyasachi shoot
              </p>
              <p className="mt-3 text-sm leading-relaxed text-body">
                A jhumka worn by the model — polki work, heavy, 22kt gold. Saved
                to Instagram. The exact piece, not something inspired by it.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="rotate-90 text-muted md:rotate-0"
                aria-hidden
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <polyline points="14,6 20,12 14,18" />
              </svg>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
              <p className="caption-uppercase text-primary/70">The piece</p>
              <p className="mt-4 text-lg font-medium leading-snug text-ink">
                Polki jhumka in 22kt gold
              </p>
              <p className="mt-3 text-sm leading-relaxed text-body">
                Made to match the reference. Three weeks to complete. This is the
                kind of commission AMI is built for.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <p className="mt-6 text-xs text-muted">
            This is an example of the type of piece we make — not a specific past
            order. Every commission starts with your reference.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-8">
            <Button href="/submit" size="lg">
              Send your reference
              <Arrow />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="2" y1="7" x2="12" y2="7" />
      <polyline points="8,3 12,7 8,11" />
    </svg>
  );
}

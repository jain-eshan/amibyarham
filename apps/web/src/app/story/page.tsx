import type { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "AMI by Arham brings a 50-year-old Delhi jewellery legacy online. Master karigars, five generations of craft, and your reference made real — in gold, diamonds, polki, or jadau.",
  alternates: { canonical: "/story" },
};

export default function StoryPage() {
  return (
    <>
      {/* ── Hero: the legacy ─────────────────────────────────────── */}
      <section className="bg-canvas py-section">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="caption-uppercase text-muted">
              A 50-Year Delhi Jewellery Legacy
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display-xl mt-6 max-w-[18ch] text-ink">
              Your family jeweller,{" "}
              <em className="not-italic text-primary">now online</em>.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-body md:text-lg">
              For fifty years, families in Delhi have walked into Arham&rsquo;s
              with a photograph, an heirloom, or just an idea — and walked out
              with jewellery made exactly for them. AMI by Arham brings that
              same relationship online: the trust of a jeweller who knows your
              family, without needing to be in Delhi to reach him.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── The Craftsmen ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface-dark py-section text-on-dark">
        <GoldHalo />
        <div className="relative mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <Reveal>
              <p className="caption-uppercase text-on-dark-soft">The Craftsmen</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-lg mt-6 max-w-3xl text-on-dark">
                Benches that have made jewellery for{" "}
                <em className="not-italic text-accent-amber">five generations</em>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-on-dark-soft md:text-lg">
                Our karigar families in Delhi practise the same hand-setting,
                filigree, polki, and jadau techniques their forefathers
                perfected. Between them, there is very little they have not
                made — which is why we can look at almost any reference and
                tell you honestly whether it can be made, and how.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-4 max-w-2xl text-on-dark-soft md:text-lg">
                Gold, silver, diamonds, polki, jadau, modern minimal or full
                bridal — the craft network behind AMI covers them all. Your
                reference goes to the bench that knows that style best.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/submit-feasibility-example.jpg"
                alt="Karigar's workbench with a 22K gold bar, loupe, ruby and diamonds, and handwritten project notes"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Your Vision ──────────────────────────────────────────── */}
      <section className="border-t border-hairline bg-canvas py-section">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="caption-uppercase text-muted">Your Vision</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-3xl text-ink">
              Bring a Pinterest board.{" "}
              <em className="not-italic text-primary">Leave with your piece.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-body md:text-lg">
              A screenshot, a reel, an old family photo, or a board you have
              been saving for years — that is all we need to begin. We study
              the reference, understand your occasion and budget, and reply
              within 24 hours over call or WhatsApp with what can be made and
              what it would take.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-2xl text-body md:text-lg">
              AMI means &ldquo;friend&rdquo; — and that is how every piece
              begins. Not as a transaction, but as a conversation with a
              jeweller who treats your story as seriously as the stone.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Materials, honestly ──────────────────────────────────── */}
      <section className="border-t border-hairline bg-surface-card py-section">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="caption-uppercase text-muted">Materials, Honestly</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-3xl text-ink">
              The same look can be made{" "}
              <em className="not-italic text-primary">more than one way</em>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-body md:text-lg">
              18k and 22k gold, natural diamonds, polki, coloured stones — and
              where it makes sense for your budget, lab-grown diamonds, which
              share the exact crystal lattice, hardness, and fire of mined
              stones. We tell you plainly where to spend, where to simplify,
              and which choices protect the look you fell for.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-2xl text-body md:text-lg">
              Whatever the route, purity and certification are confirmed before
              production begins — hallmarked gold and certified stones, the way
              a family jeweller has always done it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── The Team / Founder ───────────────────────────────────── */}
      <section className="border-t border-hairline bg-canvas py-section">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="caption-uppercase text-muted">The Studio</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-3xl text-ink">
              Young sensibility.{" "}
              <em className="not-italic text-primary">Deep craft tradition.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-body md:text-lg">
              AMI by Arham is led by a generation that grew up scrolling
              Pinterest mood boards and studying gemology in the same breath.
              We speak the language of modern design — clean lines, considered
              proportions — while drawing on a craft lineage that predates the
              brands most people know.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-2xl text-body md:text-lg">
              Our studio in Delhi is where these two worlds meet: a place where
              a 3D CAD render sits next to a karigar&rsquo;s hand-filed wax
              mould, and both are treated with equal reverence. The result is
              jewellery that feels both timeless and unmistakably yours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="border-t border-hairline bg-surface-card py-section">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <Reveal>
            <h2 className="display-md text-ink">Ready to begin?</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-4 max-w-lg text-body md:text-lg">
              Whether you have a vision pinned to a board or just the spark of
              an idea — we would love to hear it.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/submit" size="lg">
                Send Your Reference
              </Button>
              <Button href="/discover" variant="secondary" size="lg">
                Browse Inspiration
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* Decorative radial halo for the dark craftsmen section */
function GoldHalo() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 opacity-40"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(232,165,90,0.18), transparent 60%)",
      }}
    />
  );
}

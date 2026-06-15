import type { Metadata } from "next";

import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Five generations of karigar tradition meet modern lab-grown diamond science. Discover the philosophy behind AMI by Arham — bespoke, commissioned, never catalogued.",
};

export default function StoryPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-canvas py-section">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="caption-uppercase text-muted">
              Est. 2026 — Bespoke Atelier
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display-xl mt-6 max-w-[18ch] text-ink">
              Where heritage meets{" "}
              <em className="not-italic text-primary">intention</em>.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-body md:text-lg">
              AMI by Arham was born from a simple conviction: the finest jewelry
              is not found in a catalogue — it is commissioned from a
              conversation. We sit at the crossing of five generations of Indian
              karigar goldsmithing tradition and the frontier science of
              lab-grown diamonds, creating modern royal heirlooms that begin and
              end with you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Philosophy ───────────────────────────────────────────── */}
      <section className="border-t border-hairline bg-canvas py-section">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="caption-uppercase text-muted">Philosophy</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-3xl text-ink">
              Every piece is commissioned.{" "}
              <em className="not-italic text-primary">Never mass-produced.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-body md:text-lg">
              We do not keep inventory. There is no showroom lined with trays of
              identical rings waiting for a buyer. Instead, you bring the
              vision — a Pinterest save, an heirloom sketch, or just a
              feeling — and we translate it into something only you will ever
              own. The process is intimate, unhurried, and entirely yours.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-2xl text-body md:text-lg">
              AMI means &ldquo;friend&rdquo; — and that is how every
              commission begins. Not as a transaction, but as a collaboration
              between you and a studio that treats your story as seriously as
              the stone.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Lab-Grown Diamonds ───────────────────────────────────── */}
      <section className="border-t border-hairline bg-surface-card py-section">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="caption-uppercase text-muted">The Stone</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-3xl text-ink">
              Same crystal lattice.{" "}
              <em className="not-italic text-primary">Ethical origin.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-body md:text-lg">
              Lab-grown diamonds are not imitations. They share the exact
              crystal lattice, hardness, and optical fire of a mined diamond —
              because they <em className="italic">are</em> diamonds, grown
              above ground in controlled environments over weeks rather than
              millennia.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-2xl text-body md:text-lg">
              The result is a stone that is chemically, physically, and
              optically identical to its mined counterpart — often with fewer
              inclusions and a larger carat weight for the same budget. No
              earth disturbed, no murky supply chain, no compromise on
              brilliance.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Heritage Gold ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface-dark py-section text-on-dark">
        <GoldHalo />
        <div className="relative mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="caption-uppercase text-on-dark-soft">The Metal</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-3xl text-on-dark">
              18k &amp; 22k heritage gold, shaped by{" "}
              <em className="not-italic text-accent-amber">master karigars</em>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-on-dark-soft md:text-lg">
              Our gold is worked by karigar families in Delhi whose benches have
              served patrons across five generations. They practise the same
              hand-setting, filigree, and polki techniques their forefathers
              perfected — refined, but never replaced, by modern tooling.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-2xl text-on-dark-soft md:text-lg">
              Whether it is a classic 22-karat jadau piece or a sleek 18-karat
              modern band, the metal carries the warmth of hands that understand
              gold the way a musician understands an instrument — intuitively,
              deeply, without hesitation.
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
              proportions, editorial presentation — while drawing on a craft
              lineage that predates the brands most people know.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-2xl text-body md:text-lg">
              Our studio in Delhi is where these two worlds meet: a place where
              a 3D CAD render sits next to a karigar&rsquo;s hand-filed wax
              mould, and both are treated with equal reverence. The result is
              jewelry that feels both timeless and unmistakably now.
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
                Submit Your Vision
              </Button>
              <Button href="/discover" variant="secondary" size="lg">
                Discover Inspiration
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* Decorative radial halo for the dark gold section */
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

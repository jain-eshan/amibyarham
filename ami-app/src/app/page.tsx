import { Button } from "@/components/Button";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-section">
      <p className="caption-uppercase text-muted">Phase 2 placeholder</p>
      <h1 className="display-xl mt-6 max-w-3xl text-ink">
        A modern royal heirloom, made for you.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-body">
        Bespoke lab-grown diamonds set in heritage gold. The full story-driven
        landing lands in Phase 3 — this page exists today to verify the design
        tokens, fonts, and shared shell render correctly.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/submit">Submit Your Vision</Button>
        <Button href="/discover" variant="secondary">
          Discover Inspiration
        </Button>
      </div>
    </section>
  );
}

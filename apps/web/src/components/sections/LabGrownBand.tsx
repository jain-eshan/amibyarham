import { Reveal } from "@/components/Reveal";

const POINTS = [
  {
    tag: "Origin",
    title: "Atom for atom.",
    body: "Identical lattice, identical brilliance — only the journey differs from a mined stone.",
  },
  {
    tag: "Conscience",
    title: "No earth disturbed.",
    body: "Cultivated above ground in weeks. Land and labour stay untouched.",
  },
  {
    tag: "Brilliance",
    title: "Larger, finer.",
    body: "Carat weights and clarities that mined budgets would never reach.",
  },
] as const;

export function LabGrownBand() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <p className="caption-uppercase text-muted">The Stone</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display-lg mt-6 max-w-3xl text-ink">
            A diamond,{" "}
            <em className="not-italic text-primary">born above ground</em>.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-body md:text-lg">
            Lab-grown is not synthetic. It is the same crystal lattice, the
            same fire — grown in a controlled environment, ready in weeks
            rather than ages.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-3">
          {POINTS.map((p, i) => (
            <Reveal key={p.tag} delay={0.15 + i * 0.08}>
              <article className="group h-full rounded-lg bg-surface-card p-8 transition-colors duration-300 hover:bg-surface-cream-strong">
                <p className="caption-uppercase text-muted">{p.tag}</p>
                <h3 className="display-sm mt-5 text-ink">{p.title}</h3>
                <p className="mt-3 text-body">{p.body}</p>
                <span
                  aria-hidden
                  className="mt-8 block h-px w-8 bg-ink/30 transition-all duration-500 group-hover:w-16 group-hover:bg-primary"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

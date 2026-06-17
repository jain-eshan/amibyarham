import { Reveal } from "@/components/Reveal";

const POINTS = [
  {
    tag: "References",
    title: "Saved somewhere.",
    body: "Pinterest boards, Instagram reels, screenshots, sketches, movie stills, and family heirloom photos.",
  },
  {
    tag: "Crafts",
    title: "Made the right way.",
    body: "Polki, jadau, diamond setting, gold work, silver, and modern fine jewellery through trusted benches.",
  },
  {
    tag: "Budgets",
    title: "One look, many routes.",
    body: "Natural stones, lab-grown diamonds, hollow gold, and material swaps can help achieve the vision responsibly.",
  },
] as const;

export function LabGrownBand() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <p className="caption-uppercase text-muted">What you can send</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display-lg mt-6 max-w-3xl text-ink">
            Your dream piece probably already{" "}
            <em className="not-italic text-primary">exists in your camera roll</em>.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-body md:text-lg">
            You do not need to know the karigar, the stone size, or the right
            gold weight before you begin. Send the reference. AMI will ask the
            right questions and bring the right craftsman into the conversation.
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

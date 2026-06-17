import { Reveal } from "@/components/Reveal";

const ROUTES = [
  {
    title: "Heritage route",
    body: "For pieces where weight, craft depth, and traditional making matter most: bridal polki, jadau, heirloom-inspired sets, and family occasions.",
  },
  {
    title: "Balanced route",
    body: "For the same visual language with practical adjustments to stone size, metal weight, clasping, finish, or daily-wear comfort.",
  },
  {
    title: "Smart-budget route",
    body: "For buyers who want the look but need options: lab-grown diamonds, hollow gold, alternate stones, or a simpler construction.",
  },
] as const;

export function BudgetGuidance() {
  return (
    <section className="bg-surface-dark py-section text-on-dark">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-[0.95fr_1.05fr] md:items-start">
        <div>
          <Reveal>
            <p className="caption-uppercase text-on-dark-soft">Budget guidance</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-[17ch] text-on-dark">
              The same vision can be made{" "}
              <em className="not-italic text-accent-amber">more than one way</em>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-on-dark-soft md:text-lg">
              Share the range you are comfortable with. AMI will tell you where
              to spend, where to simplify, and which material choices protect
              the look.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4">
          {ROUTES.map((route, index) => (
            <Reveal key={route.title} delay={0.08 + index * 0.06}>
              <article className="rounded-lg border border-white/10 bg-surface-dark-elevated p-6">
                <p className="font-medium text-on-dark">{route.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-on-dark-soft">
                  {route.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

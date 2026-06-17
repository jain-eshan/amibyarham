import { Reveal } from "@/components/Reveal";

const QUESTIONS = [
  {
    q: "Can you make jewellery from just a photo?",
    a: "Yes. A photo, reel, board, or rough sketch is enough to start. AMI will tell you what can be made and what needs to change for wearability, budget, or craft.",
  },
  {
    q: "Do I need to commit before speaking to someone?",
    a: "No. The first step is a feasibility conversation. You can ask what is possible before moving into design, quote, advance, or production.",
  },
  {
    q: "Can my family be part of the decision?",
    a: "Yes. For weddings, gifting, and high-value pieces, AMI can continue the conversation over WhatsApp or call with the people who need to approve it.",
  },
  {
    q: "What about purity and certification?",
    a: "Gold hallmarking and stone certification depend on the material and piece. AMI confirms the exact assurance before production begins.",
  },
] as const;

export function BuyerQuestions() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal>
            <p className="caption-uppercase text-muted">Before you send it</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-[15ch] text-ink">
              The questions a good jeweller should answer first.
            </h2>
          </Reveal>
        </div>

        <div className="divide-y divide-hairline">
          {QUESTIONS.map((item, index) => (
            <Reveal key={item.q} delay={0.08 + index * 0.04}>
              <article className="grid gap-3 py-6 md:grid-cols-[0.65fr_1fr]">
                <h3 className="text-base font-medium text-ink">{item.q}</h3>
                <p className="text-sm leading-relaxed text-body">{item.a}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

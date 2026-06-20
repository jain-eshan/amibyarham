import { Reveal } from "@/components/Reveal";

const QUESTIONS = [
  {
    q: "What is AMI by Arham?",
    a: "AMI by Arham is an online-first custom fine jewellery service from Arham Diamonds. You send a reference, and AMI helps translate it into a practical jewellery plan with guidance on craft, material, budget, timeline, and approvals.",
  },
  {
    q: "Can AMI make jewellery from just a photo, reel, or Pinterest board?",
    a: "Yes. A screenshot, reel, Pinterest board, old family photo, sketch, or rough idea is enough to begin. AMI first studies the reference and tells you what can be made, what should change, and what choices will affect the final piece.",
  },
  {
    q: "Will you copy the reference exactly?",
    a: "AMI does not blindly copy a reference. The team translates the look into jewellery that can actually be worn, made well, and suited to your budget, occasion, metal, stone, weight, and finish preferences.",
  },
  {
    q: "Do I need to commit before speaking to someone?",
    a: "No. The first step is a feasibility conversation. You can ask what is possible before moving into design, quote, advance, or production.",
  },
  {
    q: "What happens after I send a reference?",
    a: "AMI reviews the reference, checks craft feasibility, understands the occasion and budget, and then suggests a direction. You may receive questions about stone choice, metal, size, weight, approvals, and timeline before a making plan is finalised.",
  },
  {
    q: "What kind of jewellery can AMI help with?",
    a: "AMI can help with custom rings, engagement rings, bridal jewellery, necklaces, earrings, bracelets, everyday fine jewellery, polki, jadau, diamond, gold, and lab-grown diamond pieces, depending on feasibility and budget.",
  },
  {
    q: "Can you work with natural diamonds and lab-grown diamonds?",
    a: "Yes. AMI can discuss both natural and lab-grown diamond options where they make sense for the design. The right choice depends on your budget, desired look, certification expectations, and how the piece will be worn.",
  },
  {
    q: "Can you remake an old family jewellery piece?",
    a: "In many cases, yes. AMI can study an old family piece or photo and suggest how to preserve the feeling while improving comfort, weight, clasping, proportions, or durability. Final feasibility depends on the original piece and desired changes.",
  },
  {
    q: "How does pricing or budgeting work?",
    a: "AMI first understands the look, material, stone, size, and level of craft involved. The same visual direction can often be made in more than one way, so AMI can explain where to spend, where to simplify, and which choices protect the look.",
  },
  {
    q: "How long does custom jewellery take?",
    a: "Timelines depend on the design, craft, stones, approvals, and occasion date. AMI starts by checking feasibility and then shares a practical making plan before you commit to production.",
  },
  {
    q: "Can my family be part of the decision?",
    a: "Yes. For weddings, gifting, and high-value pieces, AMI can continue the conversation over WhatsApp or call with the people who need to approve the design, budget, or final direction.",
  },
  {
    q: "What about purity and certification?",
    a: "Gold hallmarking and stone certification depend on the material, stone, and piece. AMI confirms the exact assurance, certification, and purity details before production begins.",
  },
  {
    q: "Where is AMI based, and can I use it online?",
    a: "AMI is backed by Arham Diamonds in Delhi and is designed to work online first. You can begin by sending your reference digitally, then continue the conversation through the channel that makes sense for your piece.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUESTIONS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export function BuyerQuestions() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal>
            <p className="caption-uppercase text-muted">FAQs</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-[15ch] text-ink">
              Questions a good jeweller should answer first.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-body">
              Clear answers before you share a reference, approve a design, or
              commit to production.
            </p>
          </Reveal>
        </div>

        <div className="border-t border-hairline">
          {QUESTIONS.map((item, index) => (
            <Reveal key={item.q} delay={0.08 + index * 0.04}>
              <details
                className="group border-b border-hairline py-5"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium text-ink marker:hidden">
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className="text-xl font-light leading-none text-muted transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pt-4 text-sm leading-relaxed text-body">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

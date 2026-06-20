import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { HOME_FAQS, type Faq } from "@/lib/faqs";

type BuyerQuestionsProps = {
  faqs?: readonly Faq[];
  headingAs?: "h1" | "h2";
  showAllLink?: boolean;
};

export function BuyerQuestions({
  faqs = HOME_FAQS,
  headingAs = "h2",
  showAllLink = false,
}: BuyerQuestionsProps) {
  const Heading = headingAs;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className="border-t border-hairline-soft bg-canvas py-16 md:py-section">
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
            <Heading className="display-lg mt-6 max-w-[15ch] text-ink">
              Questions a good jeweller should answer first.
            </Heading>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-body">
              Clear answers before you share a reference, approve a design, or
              commit to production.
            </p>
          </Reveal>
        </div>

        <div>
          <div className="border-t border-hairline">
            {faqs.map((item, index) => (
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

          {showAllLink && (
            <Reveal delay={0.24}>
              <Button href="/faqs" size="lg" variant="secondary" className="mt-8">
                See all FAQs
                <Arrow />
              </Button>
            </Reveal>
          )}
        </div>
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

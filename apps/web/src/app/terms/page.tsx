import type { Metadata } from "next";

import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for AMI by Arham custom jewellery commissions — quotes, payments, cancellations, and delivery.",
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    title: "The Service",
    content: [
      "AMI by Arham is a custom jewellery commissioning service operated by Arham Diamonds, Delhi. When you send a reference (a photo, link, board, or description), we review it and respond with a feasibility assessment. Sending a reference is free and creates no obligation — for you or for us — to proceed with a commission.",
    ],
  },
  {
    title: "Quotes and Pricing",
    content: [
      "Any price signal shared in the first feasibility response is an estimate, not a binding quote. A final quote is confirmed in writing (over WhatsApp or email) once the design, materials, stones, weight, and timeline are agreed. Gold and stone prices fluctuate; a quote is valid for the period stated with it.",
    ],
  },
  {
    title: "Orders, Advance, and Payment",
    content: [
      "A commission begins only after you approve the final design and quote and pay the agreed advance. The advance amount, payment schedule, and payment methods are confirmed in writing before any making starts. The remaining balance is due before delivery unless agreed otherwise.",
    ],
  },
  {
    title: "Cancellations and Refunds",
    content: [
      "Because every piece is made to order, cancellation terms depend on how far the work has progressed:",
    ],
    list: [
      "Before production begins: you may cancel and the advance is refunded, less any costs already incurred (for example, stones sourced specifically for your piece).",
      "After production begins: the advance is generally non-refundable, as materials and bench time are committed to your design.",
      "If we are unable to deliver the agreed piece, you receive a full refund of amounts paid.",
      "Custom-made jewellery cannot be returned for a refund after delivery, except in the case of a manufacturing defect or a piece that does not match the approved design.",
    ],
  },
  {
    title: "Shipping and Delivery",
    content: [
      "Delivery timelines are agreed per commission and depend on the design, craft, and stones involved. Pieces are shipped fully insured within India, or can be collected in Delhi by arrangement. We confirm the delivery method, timeline, and any charges in writing before production begins. Please inspect your piece on delivery and report any issue to us within 48 hours.",
    ],
  },
  {
    title: "Purity and Certification",
    content: [
      "Gold hallmarking and stone certification applicable to your piece are confirmed in writing before production begins, and the relevant certificates accompany the finished piece.",
    ],
  },
  {
    title: "Your References",
    content: [
      "You confirm that any reference you share is for personal use in a custom commission. We translate references into original pieces suited to your material, budget, and wear — we do not claim ownership of your references, and we will not share your references or personal details publicly without your consent.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "Our liability in connection with any commission is limited to the amount you have paid for that commission. Nothing in these terms limits rights you hold under applicable consumer protection law in India.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These terms are governed by the laws of India, and the courts of Delhi have jurisdiction over any dispute.",
    ],
  },
  {
    title: "Contact",
    content: [
      "Questions about these terms? Write to us — we are happy to explain anything before you commit.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <section className="bg-canvas py-20 md:py-section">
      <div className="mx-auto max-w-[720px] px-6">
        <Reveal>
          <p className="caption-uppercase text-muted">Legal</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="display-lg mt-6 text-ink">Terms of Service</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-body">
            These terms explain how commissions with AMI by Arham work — from
            the first reference you send to the delivery of your finished
            piece. They are written to be read, not to be feared.
          </p>
        </Reveal>

        <div className="mt-14 space-y-12">
          {SECTIONS.map((section, i) => (
            <Reveal key={section.title} delay={0.05}>
              <div>
                <h2 className="display-sm text-ink">
                  {i + 1}. {section.title}
                </h2>
                {section.content.map((para) => (
                  <p key={para} className="mt-4 text-body leading-relaxed">
                    {para}
                  </p>
                ))}
                {"list" in section && section.list && (
                  <ul className="mt-4 space-y-2 pl-5">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="relative text-body leading-relaxed before:absolute before:-left-4 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-primary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.05}>
            <div className="rounded-lg border border-hairline bg-surface-card p-8">
              <p className="font-medium text-ink">AMI by Arham</p>
              <p className="mt-2 text-body">amibyarham@gmail.com</p>
              <p className="text-body">Q5 Model Town, Delhi, India</p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="text-sm text-muted">Last revised: July 2, 2026</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

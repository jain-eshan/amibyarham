import type { Metadata } from "next";

import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AMI by Arham collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    content: [
      "When you submit a vision, contact us, or browse our site, we may collect:",
    ],
    list: [
      "Name, email address, and contact details you provide through our forms",
      "Design references, images, and messages you share with us",
      "Device information, browser type, and pages visited (collected automatically)",
      "Cookies and similar technologies to enhance your browsing experience",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "Your information helps us craft your experience and serve you better:",
    ],
    list: [
      "To process and fulfil your bespoke commissions",
      "To respond to enquiries and provide studio support",
      "To share curated inspiration and studio updates (only with your consent)",
      "To improve our website and understand how visitors interact with it",
      "To comply with legal and regulatory obligations",
    ],
  },
  {
    title: "How We Protect Your Information",
    content: [
      "We implement appropriate technical and organisational measures to safeguard your personal information against unauthorised access, alteration, or disclosure. While no transmission over the internet is entirely secure, we take every reasonable step to protect the data you entrust to us.",
    ],
  },
  {
    title: "Sharing Your Information",
    content: [
      "We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who assist in operating our website and fulfilling commissions — always subject to strict confidentiality agreements.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "Depending on your location, you may have the right to access, correct, delete, or port your personal data. To exercise any of these rights, please reach out to us at the address below — we are happy to help.",
    ],
  },
  {
    title: "Third-Party Links",
    content: [
      "Our site may link to external platforms (Instagram, Pinterest, etc.). We are not responsible for their privacy practices and encourage you to review their policies independently.",
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      'We may update this policy from time to time. Significant changes will be posted here with an updated "Last Revised" date.',
    ],
  },
  {
    title: "Contact Us",
    content: [
      "Questions about this policy or how we handle your data? We would love to hear from you.",
    ],
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-canvas py-20 md:py-section">
      <div className="mx-auto max-w-[720px] px-6">
        <Reveal>
          <p className="caption-uppercase text-muted">Legal</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="display-lg mt-6 text-ink">Privacy Policy</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-body">
            Your privacy matters to us. This policy explains how AMI by Arham
            collects, uses, and protects your personal information when you
            visit our website and use our services.
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
            <p className="text-sm text-muted">Last revised: June 11, 2026</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

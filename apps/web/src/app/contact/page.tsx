import type { Metadata } from "next";

import { Reveal } from "@/components/Reveal";

import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AMI by Arham. Whether you have a vision or just a question — we'd love to hear from you.",
  alternates: { canonical: "/contact" },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "AMI by Arham",
  description:
    "Online-first custom fine jewellery service backed by Arham Diamonds in Delhi. Commission bespoke jewellery from any reference.",
  url: "https://www.arhamdiamonds.in",
  telephone: "+919958863129",
  email: "amibyarham@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Delhi",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.instagram.com/amibyarham/",
    "https://www.linkedin.com/company/arham-diamond",
    "https://www.facebook.com/profile.php?id=61590698912033",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+919958863129",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
};

const CHANNELS = [
  {
    label: "Email",
    value: "amibyarham@gmail.com",
    href: "mailto:amibyarham@gmail.com",
  },
  {
    label: "Instagram",
    value: "@amibyarham",
    href: "https://www.instagram.com/amibyarham/",
  },
  {
    label: "Location",
    value: "Delhi, India",
    href: undefined,
  },
  {
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/919958863129",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-canvas py-section">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <h1 className="display-xl text-ink">
              Let&rsquo;s <em className="not-italic text-primary">talk</em>.
            </h1>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-4 max-w-xl text-body md:text-lg">
              Whether you have a vision or just a question — we&rsquo;d love to
              hear from you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Contact Grid + Form ──────────────────────────────────── */}
      <section className="border-t border-hairline bg-canvas pb-section">
        <div className="mx-auto grid max-w-[1200px] gap-16 px-6 pt-16 md:grid-cols-2">
          {/* ── Left: channels ─────────────────────────────────── */}
          <div>
            <Reveal>
              <p className="caption-uppercase text-muted">Reach us</p>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {CHANNELS.map((ch, i) => (
                <Reveal key={ch.label} delay={0.06 + i * 0.06}>
                  <div className="rounded-lg bg-surface-card p-6">
                    <p className="caption-uppercase text-muted">{ch.label}</p>
                    {ch.href ? (
                      <a
                        href={ch.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block font-sans text-ink underline-offset-4 hover:text-primary hover:underline"
                      >
                        {ch.value}
                      </a>
                    ) : (
                      <p className="mt-2 text-ink">{ch.value}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ── Right: form ────────────────────────────────────── */}
          <div>
            <Reveal delay={0.1}>
              <p className="caption-uppercase text-muted">Send a message</p>
            </Reveal>
            <Reveal delay={0.16}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

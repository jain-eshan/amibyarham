import type { Metadata } from "next";

import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AMI by Arham. Whether you have a vision or just a question — we'd love to hear from you.",
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
    value: "Drop us a message",
    href: undefined,
  },
] as const;

export default function ContactPage() {
  return (
    <>
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
              <form
                className="mt-8 space-y-6"
                onSubmit={undefined}
                action="#"
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="h-11 w-full rounded-md border border-hairline bg-canvas px-4 text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-md border border-hairline bg-canvas px-4 text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us what you have in mind..."
                    className="w-full rounded-md border border-hairline bg-canvas px-4 py-3 text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <Button type="submit" size="lg" fullWidth>
                  Send Message
                </Button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

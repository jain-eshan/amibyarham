import type { Metadata } from "next";

import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist. Explore AMI by Arham's custom jewellery services instead.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-canvas py-section">
      <div className="mx-auto max-w-[720px] px-6 text-center">
        <span aria-hidden className="text-5xl text-primary">
          ✦
        </span>
        <h1 className="display-lg mt-6 text-ink">
          This page seems to have{" "}
          <em className="not-italic text-primary">wandered off</em>.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-body md:text-lg">
          The link you followed doesn&rsquo;t exist — but your dream piece
          might. Send us a reference and we&rsquo;ll tell you what can be made.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="secondary" size="lg">
            Back to home
          </Button>
          <Button href="/submit" size="lg">
            Send a Reference
          </Button>
        </div>
      </div>
    </section>
  );
}

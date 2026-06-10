import type { Metadata } from "next";

import { SubmitForm } from "./SubmitForm";

export const metadata: Metadata = {
  title: "Submit Your Vision — AMI by Arham",
  description:
    "Share your inspiration reference and get a custom jewellery quote within 24 hours.",
};

export default function SubmitPage() {
  return (
    <main>
      <div className="bg-surface-dark py-16 text-on-dark md:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <p className="caption-uppercase text-on-dark-soft">Path A</p>
          <h1
            className="display-xl mt-4 text-on-dark"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Submit your{" "}
            <em className="not-italic text-primary">vision</em>.
          </h1>
          <p className="mt-5 max-w-md text-on-dark-soft md:text-lg">
            You already have the piece in your head. Share the reference —
            Pinterest link, Instagram reel, or screenshot — and we&rsquo;ll
            come back within 24 hours with a confirmed design and quote.
          </p>
        </div>
      </div>

      <SubmitForm />
    </main>
  );
}

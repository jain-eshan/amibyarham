import type { Metadata } from "next";

import { SubmitForm } from "./SubmitForm";

export const metadata: Metadata = {
  title: "Send Your Reference",
  description:
    "Share your jewellery reference and hear what can be made within 24 hours.",
};

export default function SubmitPage() {
  return (
    <>
      <div className="bg-surface-dark py-16 text-on-dark md:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <p className="caption-uppercase text-on-dark-soft">Start with a reference</p>
          <h1
            className="display-xl mt-4 text-on-dark"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Send the piece{" "}
            <em className="not-italic text-primary">saved in your phone</em>.
          </h1>
          <p className="mt-5 max-w-md text-on-dark-soft md:text-lg">
            Share a Pinterest link, Instagram reel, screenshot, family photo,
            or rough idea. We&rsquo;ll come back within 24 hours with what can
            be made, what may need to change, and the next step.
          </p>
        </div>
      </div>

      <SubmitForm />
    </>
  );
}

import type { Metadata } from "next";

import { BuyerQuestions } from "@/components/sections/BuyerQuestions";
import { FAQS } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about commissioning custom fine jewellery with AMI by Arham.",
  alternates: { canonical: "/faqs" },
};

export default function FaqsPage() {
  return (
    <>
      <div className="sr-only">
        AMI by Arham is an online-first custom fine jewellery service from
        Arham Diamonds in Delhi. You send a reference — a photo, reel, or
        Pinterest board — and AMI translates it into a bespoke jewellery plan
        with guidance on craft, material, budget, and timeline.
      </div>
      <BuyerQuestions faqs={FAQS} headingAs="h1" />
    </>
  );
}

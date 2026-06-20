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
  return <BuyerQuestions faqs={FAQS} headingAs="h1" />;
}

import type { Metadata } from "next";

import { BudgetGuidance } from "@/components/sections/BudgetGuidance";
import { BuyerQuestions } from "@/components/sections/BuyerQuestions";
import { Hero } from "@/components/sections/Hero";
import { HeritageBand } from "@/components/sections/HeritageBand";
import { LogoIntro } from "@/components/LogoIntro";
import { MakersSection } from "@/components/sections/MakersSection";
import { Marquee } from "@/components/sections/Marquee";
import { PathsCallout } from "@/components/sections/PathsCallout";
import { ProcessBand } from "@/components/sections/ProcessBand";
import { ReferenceReality } from "@/components/sections/ReferenceReality";
import { Testimonials } from "@/components/sections/Testimonials";

export const metadata: Metadata = {
  title: { absolute: "AMI by Arham — Custom Jewellery From Any Reference" },
  description:
    "Send a screenshot, reel, or Pinterest board and AMI's master craftsmen — backed by a 50-year Delhi jewellery legacy — reply within 24 hours with feasibility, price signal, and next step.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AMI by Arham — Custom Jewellery From Any Reference",
    description:
      "Your family jeweller, online. A 50-year Delhi jewellery legacy that turns saved references into custom polki, jadau, diamond, and gold pieces.",
    url: "/",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "AMI by Arham — custom jewellery from your references",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <LogoIntro />
      <Hero />
      <ReferenceReality />
      <HeritageBand />
      <ProcessBand />
      <MakersSection />
      <BudgetGuidance />
      <Testimonials />
      <BuyerQuestions showAllLink />
      <PathsCallout />
      <Marquee />
    </>
  );
}

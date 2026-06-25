import { BudgetGuidance } from "@/components/sections/BudgetGuidance";
import { BuyerQuestions } from "@/components/sections/BuyerQuestions";
import { Hero } from "@/components/sections/Hero";
import { HeritageBand } from "@/components/sections/HeritageBand";
import { LogoIntro } from "@/components/LogoIntro";
import { Marquee } from "@/components/sections/Marquee";
import { PathsCallout } from "@/components/sections/PathsCallout";
import { ProcessBand } from "@/components/sections/ProcessBand";
import { ReferenceReality } from "@/components/sections/ReferenceReality";

export default function HomePage() {
  return (
    <>
      <LogoIntro />
      <Hero />
      <ReferenceReality />
      <HeritageBand />
      <ProcessBand />
      <BudgetGuidance />
      <BuyerQuestions showAllLink />
      <PathsCallout />
      <Marquee />
    </>
  );
}

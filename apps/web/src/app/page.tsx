import { BudgetGuidance } from "@/components/sections/BudgetGuidance";
import { BuyerQuestions } from "@/components/sections/BuyerQuestions";
import { Hero } from "@/components/sections/Hero";
import { HeritageBand } from "@/components/sections/HeritageBand";
import { LabGrownBand } from "@/components/sections/LabGrownBand";
import { LogoIntro } from "@/components/LogoIntro";
import { Marquee } from "@/components/sections/Marquee";
import { PathsCallout } from "@/components/sections/PathsCallout";
import { ProcessBand } from "@/components/sections/ProcessBand";
import { ReferenceReality } from "@/components/sections/ReferenceReality";
import { TrustStrip } from "@/components/sections/TrustStrip";

export default function HomePage() {
  return (
    <>
      <LogoIntro />
      <Hero />
      <TrustStrip />
      <LabGrownBand />
      <ProcessBand />
      <ReferenceReality />
      <BudgetGuidance />
      <HeritageBand />
      <BuyerQuestions />
      <PathsCallout />
      <Marquee />
    </>
  );
}

import { BudgetGuidance } from "@/components/sections/BudgetGuidance";
import { BuyerQuestions } from "@/components/sections/BuyerQuestions";
import { ExamplePiece } from "@/components/sections/ExamplePiece";
import { Hero } from "@/components/sections/Hero";
import { HeritageBand } from "@/components/sections/HeritageBand";
import { LabGrownBand } from "@/components/sections/LabGrownBand";
import { LogoIntro } from "@/components/LogoIntro";
import { MakersSection } from "@/components/sections/MakersSection";
import { Marquee } from "@/components/sections/Marquee";
import { PathsCallout } from "@/components/sections/PathsCallout";
import { ProcessBand } from "@/components/sections/ProcessBand";
import { ReferenceReality } from "@/components/sections/ReferenceReality";

export default function HomePage() {
  return (
    <>
      <LogoIntro />
      <Hero />
      <ExamplePiece />
      <ProcessBand />
      <LabGrownBand />
      <ReferenceReality />
      <BudgetGuidance />
      <HeritageBand />
      <BuyerQuestions showAllLink />
      <MakersSection />
      <PathsCallout />
      <Marquee />
    </>
  );
}

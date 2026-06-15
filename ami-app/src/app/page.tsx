import { DiamondShowcase } from "@/components/sections/DiamondShowcase";
import { Hero } from "@/components/sections/Hero";
import { HeritageBand } from "@/components/sections/HeritageBand";
import { LabGrownBand } from "@/components/sections/LabGrownBand";
import { Marquee } from "@/components/sections/Marquee";
import { PathsCallout } from "@/components/sections/PathsCallout";
import { ProcessBand } from "@/components/sections/ProcessBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DiamondShowcase />
      <LabGrownBand />
      <HeritageBand />
      <ProcessBand />
      <PathsCallout />
      <Marquee />
    </>
  );
}

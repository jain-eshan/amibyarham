import HeroSection from "@/components/sections/HeroSection";
import StorySection from "@/components/sections/StorySection";
import ProcessSection from "@/components/sections/ProcessSection";
import TrustSection from "@/components/sections/TrustSection";
import PricingSection from "@/components/sections/PricingSection";
import CtaSection from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <ProcessSection />
      <TrustSection />
      <PricingSection />
      <CtaSection />
    </main>
  );
}

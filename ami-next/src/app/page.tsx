import HeroSection from "@/components/sections/HeroSection";
import StorySection from "@/components/sections/StorySection";
import ProcessSection from "@/components/sections/ProcessSection";
import TrustSection from "@/components/sections/TrustSection";
import GallerySection from "@/components/sections/GallerySection";
import PricingSection from "@/components/sections/PricingSection";
import FaqSection from "@/components/sections/FaqSection";
import CtaSection from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <ProcessSection />
      <TrustSection />
      <GallerySection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}

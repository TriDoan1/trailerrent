import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { TrustBar } from "@/components/home/TrustBar";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturedCarousel />
      <HowItWorks />
    </>
  );
}

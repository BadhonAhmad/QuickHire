import HeroSection from "@/components/home/HeroSection";
import TrustedSection from "@/components/home/TrustedSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CTASection from "@/components/home/CTASection";
import FeaturedJobsSection from "@/components/home/FeaturedJobsSection";
import LatestJobsSection from "@/components/home/LatestJobsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustedSection />
      <CategoriesSection />
      <CTASection />
      <FeaturedJobsSection />
      <LatestJobsSection />
    </>
  );
}

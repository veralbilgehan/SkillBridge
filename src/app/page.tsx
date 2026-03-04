import { SiteHeader } from "@/components/ui/site-header";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { ShowcaseSection } from "@/components/sections/showcase-section";
import { FooterSection } from "@/components/sections/footer-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ShowcaseSection />
      </main>
      <FooterSection />
    </div>
  );
}

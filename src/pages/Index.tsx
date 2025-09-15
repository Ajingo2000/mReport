import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ImpactSection } from "@/components/ImpactSection";
import { DemoSection } from "@/components/DemoSection";
import { PartnershipSection } from "@/components/PartnershipSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="impact">
        <ImpactSection />
      </div>
      <div id="demo">
        <DemoSection />
      </div>
      <div id="partners">
        <PartnershipSection />
      </div>
      <Footer />
    </main>
  );
};

export default Index;

import { HeroSection, FeaturesSection, SafetySection, SupportSection, CTASection } from "@/components/landing";
import { siteContent } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection content={siteContent.hero} />
      
      {/* Features Section */}
      <div id="features">
        <FeaturesSection content={siteContent.features} />
      </div>
      
      {/* Safety Section */}
      <div id="safety">
        <SafetySection content={siteContent.safety} />
      </div>
      
      {/* Support Section */}
      <div id="support">
        <SupportSection content={siteContent.support} />
      </div>
      
      {/* Call-to-Action Section */}
      <div id="cta">
        <CTASection content={siteContent.cta} />
      </div>
    </div>
  );
}
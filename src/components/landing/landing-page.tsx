import { Navbar } from "./navbar"
import { HeroSection } from "./hero-section"
import { FeaturesSection } from "./features-section"
import { AboutSection } from "./about-section"
import { StatsSection } from "./stats-section"
import { FeedbackSection } from "./feedback-section"
import { CtaSection } from "./cta-section"
import { Footer } from "./footer"
import { DynamicBackground } from "./dynamic-background"

export function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-x-clip selection:bg-primary/20 selection:text-primary">
      {/* Global Connected Dynamic Background Canvas */}
      <DynamicBackground />

      <Navbar />
      <main className="flex-1 relative z-10">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <StatsSection />
        <FeedbackSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

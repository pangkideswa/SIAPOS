import { Navbar } from "./navbar"
import { HeroSection } from "./hero-section"
import { FeaturesSection } from "./features-section"
import { AboutSection } from "./about-section"
import { StatsSection } from "./stats-section"
import { CtaSection } from "./cta-section"
import { Footer } from "./footer"

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <StatsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

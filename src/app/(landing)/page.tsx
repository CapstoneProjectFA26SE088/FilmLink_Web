import { AIFeaturesSection } from "./_components/ai-features-section"
import { BannerShowcase } from "./_components/banner-showcase"
import { CommunitySection } from "./_components/community-section"
import { CTASection } from "./_components/cta-section"
import { FooterSection } from "./_components/footer-section"
import { HeroSection } from "./_components/hero-section"
import { LabSearchSection } from "./_components/lab-search-section"
import { StatsSection } from "./_components/stats-section"
import { WorkflowSection } from "./_components/workflow-section"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section with Soft Glow */}
      <HeroSection />

      {/* 2. Vietnam Analog Art Banner */}
      <BannerShowcase />

      {/* 3. One Continuous Workflow Stepper */}
      <WorkflowSection />

      {/* 4. AI Built for Film Photographers */}
      <AIFeaturesSection />

      {/* 5. Find the Right Film Lab (Directory & Filter) */}
      <LabSearchSection />

      {/* 6. Built Around the Film Community */}
      <CommunitySection />

      {/* 7. Platform Statistics Banner */}
      <StatsSection />

      {/* 8. Dark Aperture CTA Card */}
      <CTASection />

      {/* 9. Site Footer */}
      <FooterSection />
    </div>
  )
}

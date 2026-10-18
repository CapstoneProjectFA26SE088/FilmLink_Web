import {
  AIFeaturesSection,
  BannerShowcase,
  CommunitySection,
  CTASection,
  FooterSection,
  HeroSection,
  LabSearchSection,
  StatsSection,
  WorkflowSection,
} from "@/components/landing"

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

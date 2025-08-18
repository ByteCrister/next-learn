"use client";

import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ValuePropositionSection from "@/components/landing/ValuePropositionSection";
import DemoSection from "@/components/landing/DemoSection";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ValuePropositionSection />
      <DemoSection />
      <CTASection />
    </main>
  );
}

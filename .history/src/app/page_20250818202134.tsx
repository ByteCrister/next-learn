"use client";

import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ValuePropositionSection from "@/components/landing/ValuePropositionSection";
import DemoSection from "@/components/landing/DemoSection";
import CTASection from "@/components/landing/CTASection";

// SEO metadata
export const metadata = {
  title: "NextLearn - Organize Your Learning Journey",
  description: "NextLearn helps you build personalized roadmaps, manage study materials, and track your learning progress - all in one simple platform.",
  keywords: "learning management, study planner, course roadmap, personal learning, student tools",
  openGraph: {
    title: "NextLearn - Your Personal Learning Companion",
    description: "Take control of your learning with personalized roadmaps, organized materials, and progress tracking.",
    type: "website",
    url: "https://nextlearn.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NextLearn Dashboard Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "NextLearn - Organize Your Learning",
    description: "Build personalized roadmaps and manage your learning journey with NextLearn.",
    images: ["/twitter-image.jpg"]
  }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />

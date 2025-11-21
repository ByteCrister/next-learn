"use client";

import { Separator } from "@/components/ui/separator";
import HeroHeader from "./HeroHeader";
import LearningSection from "./LearningSection";
import ExamsSection from "./ExamsSection";
import PlanningSection from "./PlanningSection";
import SharingSection from "./SharingSection";
import FooterCTA from "./FooterCTA";

export default function FeaturePage() {

  return (
    <main className="relative min-h-screen  bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950">
      {/* Floating orbs background */}

      <HeroHeader />

      <Separator className="opacity-50" />

      <LearningSection />

      <ExamsSection />

      <PlanningSection />

      <SharingSection />


      <FooterCTA />
    </main>
  );
}

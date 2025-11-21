'use client'

import HeroSection from './HeroSection';
import StepsSection from './StepsSection';
import VideoTutorialSection from './VideoTutorialSection';

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <HeroSection />
      <StepsSection />
      <VideoTutorialSection />
    </div>
  );
}

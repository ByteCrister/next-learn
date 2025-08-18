import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features - Next-Learn Platform',
  description: 'Discover powerful features of Next-Learn including interactive learning tools, personalized roadmaps, study materials, and collaborative learning experiences.',
  keywords: 'learning features, educational tools, study platform, interactive learning, personalized education',
  openGraph: {
    title: 'Features - Next-Learn Platform',
    description: 'Explore comprehensive learning features designed for modern education',
    url: '/features',
    siteName: 'Next-Learn',
    images: [
      {
        url: '/og-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Next-Learn Features',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features - Next-Learn Platform',
    description: 'Discover powerful features of Next-Learn including interactive learning tools and personalized roadmaps',
    images: ['/og-features.jpg'],
  },
  alternates: {
    canonical: '/features',
  },
};

export default function FeaturesPage() {
  const features = [
    {
      title: "Interactive Learning",
      description: "Engage with dynamic content and interactive exercises that make learning fun and effective.",
      icon: "🎯"
    },
    {
      title: "Personalized Roadmaps",
      description: "Get custom learning paths tailored to your goals and pace with AI-powered recommendations.",
      icon: "🗺️"
    },
    {

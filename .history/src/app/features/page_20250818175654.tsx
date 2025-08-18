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
      title: "Study Materials",
      description: "Access comprehensive study materials including notes, videos, and practice exercises.",
      icon: "📚"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning progress with detailed analytics and achievement badges.",
      icon: "📊"
    },
    {
      title: "Collaborative Learning",
      description: "Connect with peers and mentors for group study sessions and knowledge sharing.",
      icon: "👥"
    },
    {
      title: "Mobile Friendly",
      description: "Learn anywhere, anytime with our responsive design that works on all devices.",
      icon: "📱"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}

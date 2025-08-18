import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Next-Learn Platform',
  description: 'Learn about Next-Learn mission, vision, and our commitment to making quality education accessible to everyone through innovative technology.',
  keywords: 'about next-learn, education mission, learning platform, educational technology, online learning',
  openGraph: {
    title: 'About Us - Next-Learn Platform',
    description: 'Discover our mission to make quality education accessible to everyone',
    url: '/about',
    siteName: 'Next-Learn',
    images: [
      {
        url: '/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'About Next-Learn',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Next-Learn Platform',
    description: 'Learn about Next-Learn mission and commitment to accessible education',
    images: ['/og-about.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const team = [
    {
      name: "Education Team",
      role: "Curriculum Design",
      description: "Experts in creating engaging and effective learning content"
    },
    {
      name: "Technology Team",
      role: "Platform Development",
      description: "Innovators building cutting-edge educational technology"
    },
    {
      name: "Support Team",
      role: "Student Success",
      description: "Dedicated to helping learners achieve their goals"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About Next-Learn
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Empowering learners worldwide through innovative educational technology and personalized learning experiences.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To make quality education accessible to everyone, regardless of their background or location. We believe that learning should be personalized, engaging, and effective.
            </p>
            <p className="text-gray-600 dark:text-gray-300">

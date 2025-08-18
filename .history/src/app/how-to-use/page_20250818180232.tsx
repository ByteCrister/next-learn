import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Use - Next-Learn Platform',
  description: 'Step-by-step guide to get started with Next-Learn. Learn how to create an account, navigate courses, track progress, and maximize your learning experience.',
  keywords: 'how to use next-learn, getting started guide, tutorial, learning platform guide, user guide',
  openGraph: {
    title: 'How to Use - Next-Learn Platform',
    description: 'Complete guide to getting started with Next-Learn platform',
    url: '/how-to-use',
    siteName: 'Next-Learn',
    images: [
      {
        url: '/og-how-to-use.jpg',
        width: 1200,
        height: 630,
        alt: 'How to Use Next-Learn',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Use - Next-Learn Platform',
    description: 'Step-by-step guide to get started with Next-Learn',
    images: ['/og-how-to-use.jpg'],
  },
  alternates: {
    canonical: '/how-to-use',
  },
};

export default function HowToUsePage() {
  const steps = [
    {
      number: 1,
      title: "Create Your Account",
      description: "Sign up for free with your email or social media account. It takes less than 2 minutes!",
      details: ["Click 'Sign Up' button", "Enter your email and create password", "Verify your email address", "Complete your profile setup"]
    },
    {
      number: 2,
      title: "Explore Courses",
      description: "Browse our extensive library of courses across various subjects and skill levels.",
      details: ["Use the search bar to find specific topics", "Filter by difficulty level and subject", "Read course descriptions and reviews", "Preview course content before enrolling"]
    },
    {
      number: 3,
      title: "Start Learning",
      description: "Enroll in courses and begin your personalized learning journey with interactive content.",
      details: ["Click 'Enroll' on your chosen course", "Follow the structured learning path", "Complete interactive exercises and quizzes", "Track your progress in real-time"]
    },
    {
      number: 4,
      title: "Track Progress",
      description: "Monitor your learning achievements and stay motivated with our progress tracking tools.",
      details: ["View your learning dashboard", "Check completion rates and scores", "Earn badges and certificates", "Set and track learning goals"]
    },
    {
      number: 5,
      title: "Engage with Community",
      description: "Connect with fellow learners and instructors to enhance your learning experience.",
      details: ["Join study groups and discussions", "Ask questions in course forums", "Share insights and resources", "Participate in collaborative projects"]
    }
  ];

  const tips = [
    "Set daily learning goals to maintain consistency",
    "Use the mobile app for learning on-the-go",
    "Take regular breaks to improve retention",
    "Engage with the community for support and motivation",
    "Review completed lessons regularly to reinforce learning"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How to Use Next-Learn
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get started with our platform in just a few simple steps. This guide will walk you through everything you need to know.
          </p>
        </section>

        {/* Steps */}
        <section className="mb-16">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">

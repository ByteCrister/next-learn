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
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Pro Tips for Success
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="text-blue-600 text-2xl mb-2">💡</div>
                <p className="text-gray-600 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Video Tutorial Placeholder */}
        <section className="mb-16">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Video Tutorial Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Watch our comprehensive video guide to get a visual walkthrough of the platform
            </p>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Video Tutorial Placeholder</span>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="text-center bg-blue-600 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="mb-6">
            Our support team is here to help you get the most out of Next-Learn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 

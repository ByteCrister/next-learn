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
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features for Modern Learning
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover how Next-Learn transforms your educational journey with cutting-edge tools and personalized experiences.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of learners who are already benefiting from our platform.
          </p>
          <a 
            href="/user-signup" 
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Get Started Now
          </a>
        </section>
      </div>
    </div>
  );
}

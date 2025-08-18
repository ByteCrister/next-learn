import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { fadeIn, slideIn, scaleIn, staggerContainer } from '@/lib/animations';

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
      icon: "📱",
      color: "from-teal-500 to-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            variants={fadeIn}
          >
            Powerful Features for Modern Learning
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            Discover how Next-Learn transforms your educational journey with cutting-edge tools and personalized experiences.
          </motion.p>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              variants={scaleIn}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className="text-4xl mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ 
                  delay: index * 0.1 + 0.2,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon}
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold text-gray-900 dark:text-white mb-3"
                variants={fadeIn}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {feature.title}
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-300"
                variants={fadeIn}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.section>

        {/* Feature Highlights */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8"
            variants={scaleIn}
          >
            <motion.h3 
              className="text-2xl font-bold mb-4"
              variants={fadeIn}
            >
              What Makes Us Different
            </motion.h3>
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={staggerContainer}
            >
              {[
                "AI-Powered Personalization",
                "Real-time Progress Tracking",
                "Interactive Learning Modules",
                "24/7 Support Community"
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-2"
                  variants={fadeIn}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className="w-2 h-2 bg-white rounded-full"
                    whileHover={{ scale: 1.5 }}
                  />
                  <span>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            variants={fadeIn}
          >
            Ready to Start Your Learning Journey?
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 mb-8"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            Join thousands of learners who are already benefiting from our platform.
          </motion.p>
          <motion.a 
            href="/user-signup" 
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
            variants={scaleIn}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.a>
        </motion.section>
      </div>
    </div>
  );
}

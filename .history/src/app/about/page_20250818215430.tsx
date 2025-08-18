import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { fadeIn, slideIn, scaleIn, staggerContainer, scrollReveal } from '@/lib/animations';

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

  const values = [
    { title: "Accessibility", description: "Making education available to everyone" },
    { title: "Innovation", description: "Constantly improving through technology" },
    { title: "Excellence", description: "Maintaining high standards in everything we do" },
    { title: "Community", description: "Building supportive learning environments" },
    { title: "Personalization", description: "Tailoring experiences to individual needs" },
    { title: "Growth", description: "Fostering continuous learning and development" }
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
            About Next-Learn
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            Empowering learners worldwide through innovative educational technology and personalized learning experiences.
          </motion.p>
        </motion.section>

        {/* Mission & Vision */}
        <motion.section 
          className="grid md:grid-cols-2 gap-12 mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            variants={slideIn.left}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
              variants={fadeIn}
            >
              Our Mission
            </motion.h2>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-4"
              variants={fadeIn}
              transition={{ delay: 0.1 }}
            >
              To make quality education accessible to everyone, regardless of their background or location. We believe that learning should be personalized, engaging, and effective.
            </motion.p>
            <motion.p 
              className="text-gray-600 dark:text-gray-300"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              Through innovative technology and expert-designed content, we're breaking down barriers to education and creating opportunities for lifelong learning.
            </motion.p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            variants={slideIn.right}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
              variants={fadeIn}
            >
              Our Vision
            </motion.h2>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-4"
              variants={fadeIn}
              transition={{ delay: 0.1 }}
            >
              A world where every individual has the tools and resources they need to achieve their educational goals and unlock their full potential.
            </motion.p>
            <motion.p 
              className="text-gray-600 dark:text-gray-300"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              We envision a future where learning is not limited by geography, economics, or traditional constraints, but is enhanced by technology and human connection.
            </motion.p>
          </motion.div>
        </motion.section>

        {/* Values */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
      </div>
    </div>
  );
}

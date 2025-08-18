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
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div>Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div>Courses Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div>Satisfaction Rate</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

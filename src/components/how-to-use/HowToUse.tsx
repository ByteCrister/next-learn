'use client'

import { Variants, motion } from "framer-motion";
import Link from "next/link";

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const containerStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function HowToUse() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How to Use Next-Learn
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get started with our platform in just a few simple steps. This guide will walk you through everything you need to know.
          </p>
        </motion.section>

        {/* Steps */}
        <motion.section
          className="mb-16"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row gap-8 items-start"
                variants={fadeUp}
                custom={index}
              >
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
                        <span className="text-gray-600 dark:text-gray-300">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Tips */}
        <motion.section
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerStagger}
        >
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8"
            variants={fadeUp}
          >
            Pro Tips for Success
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                variants={fadeUp}
                custom={index}
              >
                <div className="text-blue-600 text-2xl mb-2">💡</div>
                <p className="text-gray-600 dark:text-gray-300">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Video Tutorial Placeholder */}
        <motion.section
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
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
        </motion.section>

        {/* Support Section */}
        <motion.section
          className="text-center bg-blue-600 text-white rounded-lg p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="mb-6">
            Our support team is here to help you get the most out of Next-Learn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              View FAQ
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
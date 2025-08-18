"use client";

import { Laptop, Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";

const demos = [
  {
    icon: Laptop,
    title: "Dashboard Overview",
    description: "Your personalized learning hub with all your roadmaps, materials, and progress at a glance.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Calendar,
    title: "Calendar View",
    description: "Visual timeline of your study sessions, deadlines, and upcoming milestones.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: FileText,
    title: "File Management",
    description: "Drag-and-drop interface for organizing your study materials and resources.",
    color: "from-green-500 to-emerald-500"
  }
];

export default function DemoSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={fadeIn}
          >
            See
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> NextLearn in Action</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            variants={fadeIn}
          >
            Built with modern web technologies for a seamless learning experience.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {demos.map((demo, index) => (
            <motion.div
              key={index}
              className="group"
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Mock screenshot area */}
                <motion.div 
                  className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
          <p className="text-sm text-gray-500 dark:text-gray-400">
            * Screenshots are representative. Actual interface may vary based on your personalized setup.
          </p>
        </div>
      </div>
    </section>
  );
}

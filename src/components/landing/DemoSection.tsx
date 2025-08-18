"use client";

import { FC } from "react";
import { motion, Variants } from "framer-motion";
import { Laptop, Calendar, FileText } from "lucide-react";

interface Demo {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const demos: Demo[] = [
  {
    icon: Laptop,
    title: "Dashboard Overview",
    description:
      "Your personalized learning hub with all your roadmaps, materials, and progress at a glance.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calendar,
    title: "Calendar View",
    description:
      "Visual timeline of your study sessions, deadlines, and upcoming milestones.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FileText,
    title: "File Management",
    description:
      "Drag-and-drop interface for organizing your study materials and resources.",
    color: "from-green-500 to-emerald-500",
  },
];

// Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const DemoSection: FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={fadeInUp}
          >
            See
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              NextLearn in Action
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Built with modern web technologies for a seamless learning
            experience.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {demos.map((demo, index) => (
            <motion.div
              key={index}
              className="group"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Mock screenshot area */}
                <motion.div
                  className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className={`w-16 h-16 rounded-lg bg-gradient-to-br ${demo.color} opacity-20`}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                  <div className="absolute top-4 left-4 right-4">
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1" />
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1" />
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${demo.color} flex items-center justify-center`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <demo.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold">{demo.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {demo.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            * Screenshots are representative. Actual interface may vary based
            on your personalized setup.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;

"use client";

import { CheckCircle, UserPlus, LayoutDashboard, Target } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your account instantly with just your email.",
    step: 1
  },
  {
    icon: LayoutDashboard,
    title: "Build Your Roadmap",
    description: "Add milestones, upload files, and link resources to create your personalized learning path.",
    step: 2
  },
  {
    icon: Target,
    title: "Stay on Track",
    description: "Manage everything with your personalized dashboard and never miss a deadline.",
    step: 3
  }
];

export default function HowItWorksSection() {
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
            Get Started in
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 3 Simple Steps</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            variants={fadeIn}
          >
            No complicated setup. No learning curve. Just sign up and start organizing your learning journey.
          </motion.p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 hidden md:block"></div>
            
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="relative flex items-center mb-12 last:mb-0"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={`flex items-center w-full ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                    <motion.div 
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Step {step.step}</span>
                        <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                    </motion.div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-800 hidden md:block"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useRouter } from "next/navigation";
import routeDashboard from "@/utils/helpers/routeDashboard";

// Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const CTASection: FC = () => {
  const router = useRouter();
  const { user } = useDashboardStore();

  const handleClick = () => {
    if (user) {
      routeDashboard();
    } else {
      router.push('/signup'); 
    }
  };

  return (
    <section className="relative py-4  overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.3) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 mb-6 shadow-lg"
            variants={fadeInUp}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Trusted by 10,000+ students worldwide</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            variants={fadeInUp}
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
              Transform Your Learning
            </span>
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Journey Today
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Build personalized learning roadmaps, track progress, and achieve your goals faster than ever before.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            variants={fadeInUp}
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <Button
                onClick={handleClick}
                size="lg"
                className="relative bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 px-10 py-6 rounded-full text-lg font-bold shadow-2xl"
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => router.push('/features')}
                size="lg"
                variant="outline"
                className="bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 px-10 py-6 rounded-full text-lg font-bold"
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap gap-3 justify-center items-center mb-8"
            variants={containerVariants}
          >
            {[
              { icon: "🚀", text: "No credit card required" },
              { icon: "🎓", text: "Forever free for students" },
              { icon: "✨", text: "Cancel anytime" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full px-5 py-2.5 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors cursor-default shadow-md"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">{item.text}</span>
                <Check className="w-4 h-4 text-green-500" />
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm"
            variants={fadeInUp}
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white dark:border-gray-900"
                />
              ))}
            </div>
            <span className="font-medium">Join thousands of learners achieving their goals</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
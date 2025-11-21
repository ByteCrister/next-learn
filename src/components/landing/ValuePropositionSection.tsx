"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Shield, Heart, Users, Sparkles, Check, Quote } from "lucide-react";
import { useState, useRef } from "react";

const values = [
  {
    icon: Shield,
    title: "Built for You",
    description: "Unlike traditional LMS platforms designed for institutions, NextLearn is crafted specifically for individual learners.",
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    features: ["No admin overhead", "Personal dashboard", "Your rules"],
  },
  {
    icon: Heart,
    title: "Personalized Experience",
    description: "Everything adapts to your learning style, pace, and preferences. No unnecessary complexity or distractions.",
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    features: ["Custom layouts", "Flexible scheduling", "Distraction-free"],
  },
  {
    icon: Users,
    title: "Your Content, Your Control",
    description: "Complete ownership of your learning materials, roadmaps, and progress. You decide how to organize and access everything.",
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    features: ["100% ownership", "Export anytime", "Privacy first"],
  },
];

const ValueCard = ({ value, index }: { value: typeof values[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-br ${value.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
        style={{ transform: "translateZ(-10px)" }}
      />

      <motion.div
        className="relative h-full bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden shadow-lg group-hover:border-gray-200 dark:group-hover:border-gray-600 transition-all duration-300"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Top gradient bar */}
        <div className={`h-1.5 bg-gradient-to-r ${value.gradient}`} />

        {/* Spotlight Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, rgba(255,255,255,0.06), transparent 40%)`,
          }}
        />

        <div className="relative p-8" style={{ transform: "translateZ(20px)" }}>
          {/* Icon */}
          <motion.div
            className="relative mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-20 rounded-2xl blur-lg`} />
            <motion.div
              className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-xl`}
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <value.icon className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {value.title}
          </h3>

          {/* Decorative underline */}
          <motion.div
            className={`h-1 rounded-full bg-gradient-to-r ${value.gradient} mb-4`}
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
          />

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
            {value.description}
          </p>

          {/* Features */}
          <div className="space-y-3">
            {value.features.map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.4 + i * 0.1 }}
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${value.gradient} flex items-center justify-center`}>
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={isHovered ? {
            background: [
              "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.03) 55%, transparent 60%, transparent 100%)",
              "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.08) 55%, transparent 60%, transparent 100%)",
              "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.03) 55%, transparent 60%, transparent 100%)",
            ],
            x: [-1000, 1000],
            opacity: [0, 1, 0],
          } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Corner decoration */}
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 overflow-hidden rounded-2xl">
          <div className={`absolute inset-0 bg-gradient-to-tl ${value.gradient} transform rotate-45 translate-x-16 translate-y-16`} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ValuePropositionSection() {
  return (
    <section className="relative py-4 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(148 163 184 / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(148 163 184 / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} 
        />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
         <motion.div
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold mb-8 shadow-2xl"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(147, 51, 234, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Why Choose Us</span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gray-900 dark:text-white">Why </span>
            <span className="relative inline-block">
              <motion.span
                className="relative z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                NextLearn?
              </motion.span>
              
              {/* Animated underline */}
              <motion.svg
                className="absolute -bottom-3 left-0 w-full"
                viewBox="0 0 200 12"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.path
                  d="M0 6 Q50 0, 100 6 T200 6"
                  stroke="url(#gradient-why)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient-why" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            We're not just another learning platform.{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              We're your personal learning companion.
            </span>
          </motion.p>
        </motion.div>

        {/* Value Cards */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <ValueCard key={index} value={value} index={index} />
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div
            className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-3xl p-8 md:p-12 border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/10 to-purple-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Quote Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-xl mb-6"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
              >
                <Quote className="w-8 h-8 text-white" />
              </motion.div>

              {/* Quote Text */}
              <motion.blockquote
                className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                "Unlike traditional LMS, NextLearn isn't for admins or institutions.{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  It's built for you, the learner.
                </span>"
              </motion.blockquote>

              {/* Subtext */}
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Your content, your pace, your control.
                </p>
                <div className="flex-1 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
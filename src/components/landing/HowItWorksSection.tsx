"use client";

import { FC, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { UserPlus, LayoutDashboard, Target, CheckCircle2, Sparkles, Zap } from "lucide-react";

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
  step: number;
  features: string[];
  color: string;
  gradient: string;
  accentColor: string;
}

const steps: Step[] = [
  {
    icon: UserPlus,
    title: "Sign Up & Get Started",
    description: "Create your account instantly with just your email. No credit card, no hassle.",
    step: 1,
    features: ["Instant access", "30-second setup", "No downloads needed"],
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    accentColor: "bg-blue-500",
  },
  {
    icon: LayoutDashboard,
    title: "Build Your Roadmap",
    description: "Add milestones, upload files, and link resources to create your personalized learning path.",
    step: 2,
    features: ["Drag & drop interface", "Custom milestones", "Resource linking"],
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
    accentColor: "bg-purple-500",
  },
  {
    icon: Target,
    title: "Achieve Your Goals",
    description: "Track progress with your personalized dashboard and never miss a deadline.",
    step: 3,
    features: ["Real-time tracking", "Smart notifications", "Progress analytics"],
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500",
    accentColor: "bg-green-500",
  },
];

const StepCard = ({ step, index }: { step: Step; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), { stiffness: 300, damping: 30 });

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
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow effect behind card */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${step.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
        style={{ transform: "translateZ(-10px)" }}
      />

      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 dark:border-gray-700 group-hover:border-gray-200 dark:group-hover:border-gray-600 transition-all duration-300"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Top gradient accent bar */}
        <div className={`h-1.5 bg-gradient-to-r ${step.gradient}`} />

        {/* Spotlight Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, rgba(255,255,255,0.08), transparent 40%)`,
          }}
        />

        <div className="relative p-7" style={{ transform: "translateZ(20px)" }}>
          {/* Step Number Badge - Floating top right */}
          <motion.div
            className="absolute -top-3 -right-3 z-10"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12 + 0.3, type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="relative">
              {/* Pulse ring */}
              <motion.div
                className={`absolute inset-0 w-14 h-14 rounded-full bg-gradient-to-br ${step.gradient} opacity-40`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.2, 0.4],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Number badge */}
              <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${step.gradient} text-white font-black text-xl shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-800`}>
                {step.step}
              </div>
            </div>
          </motion.div>

          {/* Icon and Title Section */}
          <div className="flex items-start gap-4 mb-5 pr-12">
            {/* Icon with decorative elements */}
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-20 rounded-2xl blur-md`} />
              <motion.div
                className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <step.icon className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>

            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white leading-tight">
                {step.title}
              </h3>

              {/* Decorative underline */}
              <motion.div
                className={`h-1 rounded-full bg-gradient-to-r ${step.gradient}`}
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 + 0.4, duration: 0.6 }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-base mb-5 leading-relaxed">
            {step.description}
          </p>

          {/* Features List with enhanced styling */}
          <div className="space-y-3 mb-5">
            {step.features.map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 group/item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 + 0.4 + i * 0.08 }}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-md`}>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Shimmer sweep effect */}
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
          <div className={`absolute inset-0 bg-gradient-to-tl ${step.gradient} transform rotate-45 translate-x-16 translate-y-16`} />
        </div>
      </motion.div>
    </motion.div>
  );
};

const HowItWorksSection: FC = () => {
  return (
    <section className="relative py-4 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Enhanced Background Grid */}
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
          className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
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
            <span className="font-semibold text-gray-700 dark:text-gray-300">Simple Process</span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gray-900 dark:text-white">
              Get Started in{" "}
            </span>
            <br />
            <span className="relative inline-block mt-2">
              <motion.span
                className="relative z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                3 Simple Steps
              </motion.span>
              
              {/* Animated underline */}
              <motion.svg
                className="absolute -bottom-4 left-0 w-full"
                viewBox="0 0 300 12"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.path
                  d="M0 6 Q75 0, 150 6 T300 6"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            No complicated setup. No learning curve.{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Just sign up and start organizing
            </span>{" "}
            your learning journey today.
          </motion.p>
        </motion.div>

        {/* Steps with Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Enhanced Timeline line with gradient */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-2.5 hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-300 via-purple-300 to-green-300 dark:from-blue-700 dark:via-purple-700 dark:to-green-700 opacity-50" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex items-center mb-10 last:mb-0"
              >
                <div
                  className={`flex items-center w-full ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`w-full md:w-1/2 ${
                      index % 2 === 0
                        ? "md:pr-16"
                        : "md:pl-16"
                    }`}
                  >
                    <StepCard step={step} index={index} />
                  </div>

                  {/* Enhanced Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
                    <motion.div
                      className="relative"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.12, type: "spring", stiffness: 250, damping: 20 }}
                    >
                      {/* Multiple pulsing rings */}
                      <motion.div
                        className={`absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br ${step.gradient}`}
                        animate={{
                          scale: [1, 1.8, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                        style={{ filter: "blur(4px)" }}
                      />
                      <motion.div
                        className={`absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br ${step.gradient}`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.8, 0, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        style={{ filter: "blur(2px)" }}
                      />
                      
                      {/* Main dot with border */}
                      <div className="relative w-8 h-8 rounded-full bg-white dark:bg-gray-900 p-1 shadow-2xl">
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.gradient} shadow-inner`} />
                      </div>

                      {/* Rotating orbital ring */}
                      <motion.div
                        className="absolute inset-0 w-8 h-8"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        style={{ width: '48px', height: '48px', left: '-10px', top: '-10px' }}
                      >
                        <svg viewBox="0 0 48 48" className="w-full h-full">
                          <circle
                            cx="24"
                            cy="24"
                            r="22"
                            fill="none"
                            stroke={`url(#gradient-${index})`}
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                            opacity="0.4"
                          />
                          <defs>
                            <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={index === 0 ? "#3B82F6" : index === 1 ? "#A855F7" : "#10B981"} />
                              <stop offset="100%" stopColor={index === 0 ? "#06B6D4" : index === 1 ? "#EC4899" : "#34D399"} />
                            </linearGradient>
                          </defs>
                        </svg>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 mb-6"
            whileHover={{ scale: 1.05 }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
          >
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-semibold">
              Average setup time: <span className="font-bold">90 seconds</span>
            </span>
          </motion.div>

          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Free forever
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Cancel anytime
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
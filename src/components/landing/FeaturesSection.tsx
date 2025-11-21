"use client";

import { Map, Folder, Link2, Calendar, Sparkles, Zap, Star, TrendingUp } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef } from "react";

const features = [
  {
    icon: Map,
    title: "Roadmap Builder",
    description: "Create personalized course plans with smart milestones and adaptive learning paths.",
    color: "text-blue-500",
    bgGradient: "from-blue-500 to-cyan-500",
    stats: "10K+ roadmaps",
    badge: "Popular",
    particles: ["📍", "🗺️", "🎯"]
  },
  {
    icon: Folder,
    title: "Study Materials",
    description: "Smart organization with automatic tagging, instant search, and seamless cloud sync.",
    color: "text-green-500",
    bgGradient: "from-green-500 to-emerald-500",
    stats: "Unlimited",
    badge: "Essential",
    particles: ["📚", "📝", "💾"]
  },
  {
    icon: Link2,
    title: "External Resources",
    description: "One-click bookmarking with automatic metadata extraction and smart categorization.",
    color: "text-purple-500",
    bgGradient: "from-purple-500 to-pink-500",
    stats: "All platforms",
    badge: "Flexible",
    particles: ["🔗", "🌐", "⚡"]
  },
  {
    icon: Calendar,
    title: "Smart Calendar",
    description: "Intelligent scheduling with focus time blocks, deadline tracking, and productivity insights.",
    color: "text-orange-500",
    bgGradient: "from-orange-500 to-red-500",
    stats: "Smart features",
    badge: "Intelligent",
    particles: ["📅", "⏰", "🔔"]
  }
];

const FloatingParticle = ({ emoji, delay }: { emoji: string; delay: number }) => (
  <motion.div
    className="absolute text-2xl opacity-20 pointer-events-none"
    initial={{ y: 100, x: Math.random() * 100 - 50, opacity: 0 }}
    animate={{
      y: -100,
      opacity: [0, 0.3, 0],
      rotate: 360,
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    {emoji}
  </motion.div>
);

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group perspective-1000"
    >
      <Card className="relative overflow-hidden h-full border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${feature.bgGradient} blur-xl opacity-60`} />
        </div>
        
        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-lg" style={{ transform: "translateZ(1px)" }} />
        
        {/* Spotlight Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, rgba(255,255,255,0.1), transparent 40%)`,
          }}
        />

        {/* Floating Particles */}
        {isHovered && (
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            {feature.particles.map((emoji, i) => (
              <FloatingParticle key={i} emoji={emoji} delay={i * 0.3} />
            ))}
          </div>
        )}

        <CardHeader className="relative z-10 pb-4" style={{ transform: "translateZ(20px)" }}>
          {/* Badge */}
          <motion.div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
          >
            <Star className="w-3 h-3 inline mr-1" />
            {feature.badge}
          </motion.div>

          {/* Icon Container */}
          <motion.div
            className="relative w-16 h-16 mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.bgGradient} opacity-20 blur-xl animate-pulse`} />
            <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center shadow-lg`}>
              <motion.div
                animate={isHovered ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            
            {/* Orbital Ring */}
            <motion.div
              className={`absolute inset-0 rounded-2xl border-2 border-dashed ${feature.color.replace('text-', 'border-')} opacity-0 group-hover:opacity-40`}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <CardTitle className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {feature.title}
          </CardTitle>

          <div className="flex items-center gap-2 mb-3">
            <motion.div
              className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${feature.bgGradient} text-white text-xs font-semibold shadow-md`}
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-3 h-3" />
              {feature.stats}
            </motion.div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </CardHeader>

        <CardContent className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          <CardDescription className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-6">
            {feature.description}
          </CardDescription>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-600 dark:text-gray-400">Adoption Rate</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {90 + index * 2}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${feature.bgGradient} rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: `${90 + index * 2}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

        </CardContent>

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          initial={false}
          animate={isHovered ? {
            background: [
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 50%, transparent 100%)",
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 50%, transparent 100%)",
            ],
            x: [-1000, 1000],
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        />
      </Card>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="relative py-4 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20 max-w-4xl mx-auto"
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
            <Sparkles className="w-5 h-5" />
            <span>Premium Features</span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="relative inline-block mt-2">
              <motion.span
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                To Excel & Succeed
              </motion.span>
              <motion.div
                className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Experience the most advanced learning platform designed for{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              ambitious learners
            </span>
            {" "}who refuse to settle for ordinary.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Join <span className="font-bold text-blue-600">50,000+</span> learners who are crushing their goals
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No credit card required • Get started in 30 seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
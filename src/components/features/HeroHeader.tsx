"use client";

import { motion, useMotionValue, useTransform, Variants } from "framer-motion";
import { Sparkles, Zap, Accessibility, Smartphone, Palette, Star } from "lucide-react";
import { useEffect, useState } from "react";

const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
};

const childVariant: Variants = {
  initial: { opacity: 0, y: 40, filter: "blur(8px)", scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function HeroHeader() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [screenSize, setScreenSize] = useState({ w: 0, h: 0 });

  // Fix: window only inside useEffect
  useEffect(() => {
    setScreenSize({
      w: window.innerWidth,
      h: window.innerHeight,
    });

    const handleResize = () => {
      setScreenSize({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Create transforms only when screen size is ready
  const gradientX = useTransform(mouseX, [0, screenSize.w || 1], [-20, 20]);
  const gradientY = useTransform(mouseY, [0, screenSize.h || 1], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <header
      className="relative min-h-[80vh] flex items-center justify-center text-center px-10 py-0 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      {/* Enhanced animated mesh gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Interactive gradient that follows mouse */}
        <motion.div
          className="absolute inset-0 opacity-50"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)",
            x: gradientX,
            y: gradientY
          }}
        />

        {/* Multiple animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-40 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 to-purple-300/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [180, 360, 180],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-40 right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-pink-300/40 to-purple-300/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [-50, 50, -50],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl"
        />

        {/* Enhanced floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            animate={{
              y: [0, -150 - Math.random() * 100, 0],
              x: [0, Math.random() * 200 - 100, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            style={{
              left: `${5 + i * 5}%`,
              top: `${30 + Math.random() * 40}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: `hsl(${220 + Math.random() * 60}, 70%, 65%)`
            }}
          />
        ))}

        {/* Grid overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="space-y-10 w-full">
        {/* Status badge with enhanced glassmorphism */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            damping: 10,
            delay: 0.2
          }}
          className="inline-flex relative z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-500/30 blur-2xl rounded-full animate-pulse" />
          <motion.div
            className="relative inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/60 border border-white/40 backdrop-blur-xl shadow-2xl"
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 60px rgba(139, 92, 246, 0.4)",
              borderColor: "rgba(139, 92, 246, 0.5)"
            }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8), 0 20px 40px rgba(139, 92, 246, 0.15)"
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 shadow-lg shadow-green-500/50" />
              <motion.div
                className="absolute inset-0 w-3 h-3 rounded-full bg-green-400"
                animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <span className="text-sm font-bold text-gray-900 drop-shadow-sm">
              Now in Production
            </span>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-purple-600" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main heading with enhanced effects */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="space-y-12 relative z-10"
        >
          <div className="space-y-4">
            <motion.h1
              variants={childVariant}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight"
            >
              <motion.span
                className="block text-gray-900 leading-[1.05] relative"
                style={{
                  textShadow: "0 4px 20px rgba(139, 92, 246, 0.15)"
                }}
              >
                <motion.span
                  className="inline-block"
                  whileHover={{
                    scale: 1.05,
                    textShadow: "0 4px 30px rgba(139, 92, 246, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Build
                </motion.span>
                {" "}
                <motion.span
                  className="inline-block"
                  whileHover={{
                    scale: 1.05,
                    textShadow: "0 4px 30px rgba(139, 92, 246, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  your
                </motion.span>
                {" "}
                <motion.span
                  className="inline-block"
                  whileHover={{
                    scale: 1.05,
                    textShadow: "0 4px 30px rgba(139, 92, 246, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  learning
                </motion.span>
              </motion.span>

              <motion.span
                className="block mt-4 relative"
                variants={childVariant}
              >
                <motion.span
                  className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-[1.05] font-extrabold"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  whileHover={{
                    scale: 1.05,
                    filter: "drop-shadow(0 4px 40px rgba(139, 92, 246, 0.6))"
                  }}
                  transition={{
                    backgroundPosition: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: { duration: 0.3 },
                    filter: { duration: 0.3 }
                  }}
                  style={{
                    backgroundSize: "200% auto",
                    filter: "drop-shadow(0 4px 30px rgba(139, 92, 246, 0.4))"
                  }}
                >
                  universe
                </motion.span>

                {/* Enhanced decorative stars with trails */}
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-2 sm:-right-4 top-0 text-yellow-500"
                  whileHover={{ scale: 1.5 }}
                >
                  <Star className="w-10 h-10 sm:w-12 sm:h-12 fill-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-10 h-10 sm:w-12 sm:h-12 fill-yellow-500" />
                  </motion.div>
                </motion.div>
                <motion.div
                  animate={{
                    rotate: [360, 0],
                    scale: [1.2, 1, 1.2]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -left-2 sm:-left-4 bottom-2 text-pink-500"
                  whileHover={{ scale: 1.5 }}
                >
                  <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-pink-500" />
                  </motion.div>
                </motion.div>
              </motion.span>
            </motion.h1>
          </div>

          <motion.p
            variants={childVariant}
            className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium px-4"
            style={{
              textShadow: "0 2px 10px rgba(255,255,255,0.5)"
            }}
          >
            A meticulously crafted platform for learners and educators.
            <br className="hidden sm:block" />
            <motion.span
              className="block sm:inline mt-2 sm:mt-0 text-purple-700"
              whileHover={{
                scale: 1.02,
                textShadow: "0 0 20px rgba(139, 92, 246, 0.3)"
              }}
            >
              {" "}Thoughtfully designed, blazingly fast, and accessible to everyone.
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Feature badges with glassmorphism */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="flex flex-wrap items-center justify-center gap-4 relative z-10"
        >
          {[
            { label: "Static-First", icon: Zap, color: "from-yellow-400 via-orange-400 to-red-400" },
            { label: "WCAG AA", icon: Accessibility, color: "from-green-400 via-emerald-400 to-teal-400" },
            { label: "Mobile-Optimized", icon: Smartphone, color: "from-blue-400 via-cyan-400 to-sky-400" },
            { label: "Beautiful", icon: Palette, color: "from-pink-400 via-purple-400 to-violet-400" }
          ].map((badge) => (
            <motion.div
              key={badge.label}
              variants={childVariant}
              whileHover={{
                scale: 1.15,
                y: -8,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative group cursor-pointer">
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${badge.color} opacity-0 group-hover:opacity-50 blur-xl rounded-2xl transition-opacity duration-500`}
                />

                {/* Badge */}
                <div className="relative px-6 py-3 rounded-2xl bg-white/60 border border-white/40 backdrop-blur-xl text-gray-900 font-bold text-sm shadow-2xl overflow-hidden group-hover:border-purple-300 transition-all duration-300"
                  style={{
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8), 0 10px 30px rgba(139, 92, 246, 0.1)"
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${badge.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />

                  <div className="relative flex items-center gap-2.5">
                    <motion.div
                      whileHover={{ rotate: [0, -15, 15, 0], scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      <badge.icon className="w-5 h-5" />
                    </motion.div>
                    {badge.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative animated lines */}
      <motion.div
        className="absolute top-1/3 left-0 w-px h-60 bg-gradient-to-b from-transparent via-purple-400/40 to-transparent hidden lg:block"
        animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 right-0 w-px h-60 bg-gradient-to-b from-transparent via-pink-400/40 to-transparent hidden lg:block"
        animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />


      {/* Additional floating elements for depth */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute w-2 h-2 rounded-full bg-purple-300/40 backdrop-blur-sm hidden lg:block"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut"
          }}
          style={{
            left: `${10 + i * 11}%`,
            bottom: "10%"
          }}
        />
      ))}
    </header>
  );
}
'use client'

import { Variants, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRef } from "react";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: (i: number = 0) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const containerStagger: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

export default function HeroSection() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

    return (
        <motion.div
            ref={heroRef}
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-17"
        >
            {/* Professional White Background */}
            <div className="absolute inset-0 bg-white"></div>

            <div className="container mx-auto px-4 py-10 relative z-10">
                {/* Hero Content */}
                <motion.div
                    className="text-center max-w-6xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    variants={containerStagger}
                >
                    <motion.div
                        className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-2 rounded-full border border-gray-200 shadow-lg mb-8"
                        variants={scaleIn}
                    >
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-900 font-semibold">Master Next-Learn in 5 Simple Steps</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-6xl lg:text-7xl font-black mb-1 leading-none"
                        variants={fadeUp}
                        custom={0}
                    >
                        <span className="block text-gray-900 mb-2">How to Use</span>
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Next-Learn
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-3xl text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto font-light"
                        variants={fadeUp}
                        custom={1}
                    >
                        Transform your career with our <span className="font-bold text-gray-900">AI-powered learning platform</span>.
                        Join 50,000+ learners achieving their goals faster than ever before.
                    </motion.p>


                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        variants={fadeUp}
                        custom={2}
                    >
                        <Link href="/signup">
                            <motion.button
                                className="group relative px-10 py-5 rounded-full font-bold text-lg overflow-hidden shadow-2xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="relative flex items-center gap-3 text-white">
                                    Start Learning Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.button>
                        </Link>

                        <Link href="#steps">
                            <motion.button
                                className="px-10 py-5 rounded-full font-bold text-lg bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Watch Tutorial
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-gray-600 rounded-full mt-2"></div>
                </div>
            </motion.div>
        </motion.div>
    );
}

'use client'

import { Variants, motion } from "framer-motion";
import { Award, PlayCircle, Clock, Film, Sparkles, Video} from "lucide-react";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.08,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

export default function VideoTutorialSection() {
    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 py-8 overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>
            
            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-150px" }}
                    variants={staggerContainer}
                >
                    {/* Section Header */}
                    <div className="text-center mb-2">
                        <motion.div
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-1 shadow-lg shadow-blue-500/30"
                            custom={0}
                            variants={fadeUp}
                        >
                            <Video className="w-5 h-5 text-white" />
                            <span className="text-sm font-bold text-white tracking-wide">PREMIUM LEARNING EXPERIENCE</span>
                        </motion.div>
                        
                        <motion.h2 
                            className="text-4xl md:text-6xl font-black mb-6 leading-tight"
                            custom={1}
                            variants={fadeUp}
                        >
                            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                                Master Every Feature
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Video Tutorial
                            </span>
                        </motion.h2>
                        
                        <motion.p 
                            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                            custom={2}
                            variants={fadeUp}
                        >
                            An immersive, professionally produced learning experience crafted to transform you into a platform expert
                        </motion.p>
                    </div>

                    {/* Main Video Card */}
                    <motion.div 
                        className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-1"
                        variants={scaleIn}
                        custom={3}
                    >
                        <div className="relative z-10 p-8 md:p-16">
                            {/* Stats Bar */}

                            {/* Award Badge */}
                            <div className="text-center mb-1">
                                <motion.div
                                    className="inline-block relative"
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-2xl scale-150"></div>
                                    <Award className="w-20 h-20 text-yellow-500 relative drop-shadow-2xl" strokeWidth={1.5} />
                                </motion.div>
                            </div>

                            <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 text-center leading-tight">
                                Interactive Video Tutorial
                            </h3>
                            
                            {/* Coming Soon Badge */}
                            <div className="flex justify-center mb-2">
                                <motion.div
                                    className="inline-flex items-center gap-3 px-8 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-gray-900 font-black text-lg rounded-full shadow-2xl shadow-yellow-500/50"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        boxShadow: [
                                            '0 20px 60px rgba(234, 179, 8, 0.5)',
                                            '0 20px 80px rgba(234, 179, 8, 0.7)',
                                            '0 20px 60px rgba(234, 179, 8, 0.5)',
                                        ],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Sparkles className="w-6 h-6" />
                                    COMING SOON
                                    <Sparkles className="w-6 h-6" />
                                </motion.div>
                            </div>
                            
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed text-center">
                                We&apos;re crafting an exclusive 15-minute comprehensive masterclass to help you unlock the full potential of our platform with expert guidance
                            </p>

                            {/* Video Preview Container */}
                            <div className="relative max-w-6xl mx-auto">
                                <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-4 border-gray-300 dark:border-gray-600 overflow-hidden shadow-2xl">
                                    {/* Animated Background */}
                                    <div className="absolute inset-0">
                                        <motion.div
                                            className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                                            animate={{
                                                x: [0, 100, 0],
                                                y: [0, -50, 0],
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{
                                                duration: 10,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                        <motion.div
                                            className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                                            animate={{
                                                x: [0, -100, 0],
                                                y: [0, 50, 0],
                                                scale: [1, 1.3, 1],
                                            }}
                                            transition={{
                                                duration: 12,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"
                                            animate={{
                                                scale: [1, 1.4, 1],
                                                rotate: [0, 180, 360],
                                            }}
                                            transition={{
                                                duration: 15,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                        />
                                    </div>

                                    {/* Grid Pattern Overlay */}
                                    <div className="absolute inset-0 opacity-10" style={{
                                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                                        backgroundSize: '50px 50px'
                                    }}></div>

                                    {/* Content */}
                                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 md:p-16">
                                        {/* Play Button */}
                                        <motion.div
                                            className="relative mb-8"
                                            animate={{
                                                scale: [1, 1.05, 1],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl"></div>
                                            <motion.button 
                                                className="relative w-20 h-20 md:w-20 md:h-20 bg-gradient-to-br from-white to-blue-50 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 group cursor-pointer"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <PlayCircle className="w-20 h-20 md:w-24 md:h-24 text-blue-600 group-hover:text-indigo-600 transition-colors" strokeWidth={2} />
                                            </motion.button>
                                        </motion.div>

                                        {/* Status Text */}
                                        <h4 className="text-3xl md:text-4xl font-black text-white text-center mb-4">
                                            Premium Content In Production
                                        </h4>
                                        <p className="text-lg text-gray-300 text-center max-w-2xl mb-8">
                                            Our team of experts is creating a cinematic learning experience with professional production quality
                                        </p>

                                        {/* Timeline Badge */}
                                        <motion.div 
                                            className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl"
                                            animate={{
                                                boxShadow: [
                                                    '0 0 30px rgba(255,255,255,0.1)',
                                                    '0 0 50px rgba(255,255,255,0.2)',
                                                    '0 0 30px rgba(255,255,255,0.1)',
                                                ],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <Clock className="w-6 h-6 text-yellow-300" />
                                            <span className="text-lg text-white font-bold">Expected Launch: Q1 2025</span>
                                        </motion.div>

                                        {/* Production Quality Badge */}
                                        <div className="mt-6 flex items-center gap-3 text-white/60">
                                            <Film className="w-5 h-5" />
                                            <span className="text-sm font-medium">Professional Studio Production</span>
                                        </div>
                                    </div>

                                    {/* Cinematic Corner Accents */}
                                    <div className="absolute top-4 left-4 w-24 h-24 border-t-4 border-l-4 border-white/30 rounded-tl-3xl"></div>
                                    <div className="absolute top-4 right-4 w-24 h-24 border-t-4 border-r-4 border-white/30 rounded-tr-3xl"></div>
                                    <div className="absolute bottom-4 left-4 w-24 h-24 border-b-4 border-l-4 border-white/30 rounded-bl-3xl"></div>
                                    <div className="absolute bottom-4 right-4 w-24 h-24 border-b-4 border-r-4 border-white/30 rounded-br-3xl"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                </motion.div>
            </div>
        </section>
    );
}
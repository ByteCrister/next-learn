'use client'

import { Variants, motion } from "framer-motion";
import { Rocket, ChevronRight, Clock, Globe, Brain, BarChart3, Users, Zap, Sparkles, Target, Shield, PlayCircle, TrendingUp, Trophy, Award, MessageCircle } from "lucide-react";
import { steps } from "./data";


const iconMap: Record<string, React.ElementType> = {
    Rocket,
    Globe,
    Brain,
    BarChart3,
    Users,
    Zap,
    Sparkles,
    Target,
    Shield,
    PlayCircle,
    TrendingUp,
    Trophy,
    Award,
    MessageCircle,
};

const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) {
        console.warn(`Icon "${iconName}" not found in iconMap`);
        return <Rocket />; // Fallback icon
    }
    return <IconComponent className="w-5 h-5" />;
};

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


export default function StepsSection() {
    return (
        <div id="steps" className="relative bg-gradient-to-b from-white via-gray-50 to-white py-16">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative">
                {/* Section Header - KEEP ORIGINAL SIZE */}
                <motion.div
                    className="text-center mb-24 max-w-4xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Rocket className="w-4 h-4" />
                        Your Journey Begins Here
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                        5 Steps to Success
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                        Follow our proven methodology to master any skill and achieve your learning goals
                    </p>
                </motion.div>

                {/* Steps Timeline - REDUCED SIZE */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200"></div>

                    <div className="space-y-16 md:space-y-20">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={fadeUp}
                                custom={index}
                            >
                                {/* Timeline Dot - REDUCED */}
                                <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                    <motion.div
                                        className={`w-4 h-4 rounded-full bg-gradient-to-br ${step.gradient} shadow-lg`}
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-white/30"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        ></motion.div>
                                    </motion.div>
                                </div>

                                <div className={`grid lg:grid-cols-2 gap-6 lg:gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                    {/* Content - REDUCED */}
                                    <div className={`${index % 2 === 1 ? 'lg:order-2 lg:pl-12' : 'lg:pr-12'} space-y-4`}>
                                        {/* Step Header - REDUCED */}
                                        <div className="flex items-start gap-3">
                                            <div className="relative flex-shrink-0">
                                                <motion.div
                                                    className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center shadow-xl`}
                                                    whileHover={{ rotate: 5, scale: 1.05 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <div className="text-white scale-75">{getIcon(step.icon)}</div>
                                                </motion.div>
                                                <motion.div
                                                    className="absolute -top-1 -right-1 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center font-black text-gray-900 text-xs shadow-lg"
                                                    initial={{ scale: 0 }}
                                                    whileInView={{ scale: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.3, type: "spring" }}
                                                >
                                                    {step.number}
                                                </motion.div>
                                            </div>
                                            <div className="flex-1">
                                                <div className={`text-xs font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent mb-1 uppercase tracking-wide`}>
                                                    {step.subtitle}
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                                                    {step.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                            {step.description}
                                        </p>

                                        {/* Feature List - REDUCED */}
                                        <div className="space-y-2 pt-1">
                                            {step.details.map((detail, detailIndex) => (
                                                <motion.div
                                                    key={detailIndex}
                                                    className="group relative"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: detailIndex * 0.1 }}
                                                    viewport={{ once: true }}
                                                >
                                                    <motion.div
                                                        className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300"
                                                        whileHover={{ x: 6, scale: 1.01 }}
                                                    >
                                                        <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${step.gradient} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                                                            <div className="text-white scale-75">{getIcon(detail.icon)}</div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-gray-900 font-semibold text-sm mb-1 leading-snug">
                                                                {detail.text}
                                                            </p>
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-3 h-3 text-gray-400" />
                                                                <span className="text-xs text-gray-500 font-medium">{detail.time}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-700 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                                    </motion.div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Visual Card - LARGER ICON */}
                                    <div className={`${index % 2 === 1 ? 'lg:order-1 lg:pr-12' : 'lg:pl-12'}`}>
                                        <motion.div
                                            className="relative h-[380px] md:h-[440px] rounded-2xl overflow-hidden shadow-xl group"
                                            whileHover={{ scale: 1.02, rotateY: 2 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            {/* Background Gradients */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient}`}></div>
                                            <div className={`absolute inset-0 bg-gradient-to-tr ${step.gradient} opacity-5`}></div>

                                            {/* Grid Pattern Overlay */}
                                            <div className="absolute inset-0 opacity-10" style={{
                                                backgroundImage: 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
                                                backgroundSize: '30px 30px'
                                            }}></div>

                                            {/* 3D Floating Icon - INCREASED */}
                                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                                <motion.div
                                                    className={`relative w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br ${step.gradient} rounded-3xl shadow-2xl flex items-center justify-center`}
                                                    animate={{
                                                        rotateY: [0, 8, 0, -8, 0],
                                                        rotateX: [0, 4, 0, -4, 0],
                                                    }}
                                                    transition={{
                                                        duration: 8,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    style={{ transformStyle: "preserve-3d" }}
                                                >
                                                    <div className="text-white transform scale-[2.5]">
                                                        {getIcon(step.icon)}
                                                    </div>

                                                    {/* Glow Effect */}
                                                    <motion.div
                                                        className="absolute inset-0 rounded-3xl"
                                                        style={{
                                                            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 60%)`
                                                        }}
                                                        animate={{
                                                            scale: [1, 1.4, 1],
                                                            opacity: [0.4, 0.8, 0.4],
                                                        }}
                                                        transition={{
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                    ></motion.div>

                                                    {/* Orbiting Dots - ADJUSTED */}
                                                    <motion.div
                                                        className="absolute w-3 h-3 bg-white rounded-full shadow-lg"
                                                        animate={{
                                                            rotate: 360,
                                                        }}
                                                        transition={{
                                                            duration: 6,
                                                            repeat: Infinity,
                                                            ease: "linear"
                                                        }}
                                                        style={{
                                                            top: '50%',
                                                            left: '50%',
                                                            marginTop: '-85px',
                                                            marginLeft: '-6px',
                                                        }}
                                                    ></motion.div>
                                                </motion.div>
                                            </div>

                                            {/* Step Number Watermark - REDUCED */}
                                            <div className="absolute bottom-4 right-4 text-[100px] font-black text-gray-900/[0.03] leading-none select-none">
                                                {step.number}
                                            </div>

                                            {/* Decorative Corner - REDUCED */}
                                            <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${step.gradient} opacity-20 rounded-xl blur-lg`}></div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
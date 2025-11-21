'use client'

import { Variants, motion } from "framer-motion";
import { Star, Sparkles } from "lucide-react";
import { benefits } from "./data";

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

export default function BenefitsSection() {
    return (
        <div className="relative bg-white py-32">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                >
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
                        <Star className="w-4 h-4" />
                        Why Choose Next-Learn
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6">
                        Unmatched Benefits
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Experience learning like never before with features designed for your success
                    </p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerStagger}
                >
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            className="group relative"
                            variants={scaleIn}
                            custom={index}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-purple-200/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                            <div className="relative h-full bg-white rounded-3xl p-8 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl shadow-xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    <div className="text-white">{benefit.icon}</div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    {benefit.title}
                                </h3>

                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {benefit.description}
                                </p>

                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${benefit.gradient} bg-opacity-10 border border-gray-200`}>
                                    <Sparkles className="w-4 h-4 text-gray-900" />
                                    <span className="text-gray-900 font-semibold text-sm">{benefit.stat}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
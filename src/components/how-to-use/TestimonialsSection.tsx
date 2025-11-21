'use client'

import { Variants, motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { testimonials } from "./data";

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

export default function TestimonialsSection() {
    return (
        <div className="relative bg-gradient-to-b from-gray-50 to-white py-32 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.08),transparent_50%)]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
                        <Trophy className="w-4 h-4" />
                        Success Stories
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6">
                        Loved by Learners
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        See what our community has to say about their transformative learning experience
                    </p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerStagger}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="group relative"
                            variants={scaleIn}
                            custom={index}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-purple-200/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                            <div className="relative h-full bg-white rounded-3xl p-8 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-500">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-6 italic">
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="text-gray-900 font-semibold">{testimonial.name}</div>
                                        <div className="text-gray-600 text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

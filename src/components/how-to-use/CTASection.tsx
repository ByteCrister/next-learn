'use client'

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Rocket, ArrowRight, Check } from "lucide-react";

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

export default function CTASection() {
    return (
        <div className="relative bg-white py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-purple-50/50 to-pink-50/50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>

                        <div className="relative z-10 p-12 md:p-20 text-center">
                            <motion.div
                                animate={{
                                    rotate: [0, 10, 0, -10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Rocket className="w-20 h-20 text-blue-600 mx-auto mb-8" />
                            </motion.div>

                            <h2 className="text-4xl md:text-7xl font-black text-gray-900 mb-6">
                                Ready to Transform
                                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Your Future?
                                </span>
                            </h2>

                            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
                                Join <span className="text-gray-900 font-bold">50,000+ ambitious learners</span> who are already mastering new skills and advancing their careers with Next-Learn
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                                <Link href="/signup">
                                    <motion.button
                                        className="group relative px-12 py-6 rounded-full font-bold text-xl overflow-hidden shadow-2xl"
                                        whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(59,130,246,0.4)" }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                                            initial={{ x: "100%" }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.5 }}
                                        ></motion.div>
                                        <span className="relative flex items-center gap-3 text-white">
                                            Start Learning Now
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                        </span>
                                    </motion.button>
                                </Link>

                                <Link href="/courses">
                                    <motion.button
                                        className="px-12 py-6 rounded-full font-bold text-xl bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Explore Courses
                                    </motion.button>
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-8 justify-center items-center text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600" />
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600" />
                                    <span>14-day free trial</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600" />
                                    <span>Cancel anytime</span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-16 pt-12 border-t border-gray-200">
                                <p className="text-gray-600 mb-8">Trusted by learners at</p>
                                <div className="flex flex-wrap gap-12 justify-center items-center opacity-60">
                                    <div className="text-2xl font-bold text-gray-900">Google</div>
                                    <div className="text-2xl font-bold text-gray-900">Microsoft</div>
                                    <div className="text-2xl font-bold text-gray-900">Amazon</div>
                                    <div className="text-2xl font-bold text-gray-900">Meta</div>
                                    <div className="text-2xl font-bold text-gray-900">Apple</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
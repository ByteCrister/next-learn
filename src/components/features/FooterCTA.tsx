"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight, CheckCircle2 } from "lucide-react";
import { fadeUp } from "./motion-variants";

export default function FooterCTA() {
    const features = [
        "Learn at your own pace",
        "Lifetime access to content",
    ];

    return (
        <footer
            {...fadeUp}
            className="relative overflow-hidden"
        >
            {/* Animated background */}
            <div className="absolute inset-0 -z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-300/40 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-blue-300/30 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Decorative elements */}
            <motion.div
                className="absolute top-32 right-12 w-20 h-20 border border-purple-200/50 rounded-3xl"
                animate={{ rotate: 360, y: [0, -10, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-32 left-12 w-28 h-28 border border-blue-200/50 rounded-full"
                animate={{ rotate: -360, y: [0, 10, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Main container */}
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                {/* Main heading */}
                <motion.div {...fadeUp} className="text-center space-y-6 mb-12">
                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
                        <span className="block">Ready to unlock</span>
                        <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                            your full potential?
                        </span>
                    </h2>

                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                        Join thousands of students already mastering new skills. Personalized learning paths designed for your success, starting today.
                    </p>
                </motion.div>

                {/* Features list */}
                <motion.div {...fadeUp} className="space-y-4 mb-8 max-w-lg mx-auto">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            className="flex items-center gap-4 text-gray-700 text-lg"
                            whileHover={{ x: 8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                            <span className="font-medium">{feature}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    {...fadeUp}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12"
                >
                    <motion.div
                        whileHover={{ scale: 1.06, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto"
                    >
                        <Button
                            size="lg"
                            className="w-full px-10 py-6 text-base font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group border-0"
                        >
                            <Rocket className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Start Learning Free
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.06, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto"
                    >
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full px-10 py-6 text-base font-bold rounded-2xl border-2 border-purple-300 text-purple-700 bg-white hover:bg-purple-50 transition-all duration-300 group shadow-md hover:shadow-lg"
                        >
                            See Course Preview
                            <motion.div
                                className="ml-2"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </motion.div>
                        </Button>
                    </motion.div>
                </motion.div>


                {/* Bottom text */}
                <motion.div {...fadeUp} className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-purple-600">No credit card required.</span> Start free, upgrade when you&apos;re ready.
                    </p>
                </motion.div>
            </div>


        </footer>
    );
}
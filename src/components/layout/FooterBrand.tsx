import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, Award } from "lucide-react";

const FooterBrand = () => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="flex items-center mb-6 group">
                <motion.div
                    className="relative"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-3 rounded-2xl shadow-2xl">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                </motion.div>
                <span className="ml-4 text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                    NextLearn
                </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-8">
                Transform your learning journey with structured roadmaps, personalized study plans, and a thriving community of ambitious learners.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full px-4 py-2"
                >
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">Secure</span>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-full px-4 py-2"
                >
                    <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Award-Winning</span>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FooterBrand;

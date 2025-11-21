"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Sparkles, TrendingUp, MapPin } from "lucide-react";

const stats = [
    { label: "Active Users", value: "1K+", icon: Users },
    { label: "Courses Created", value: "7K+", icon: Sparkles },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
    { label: "Countries", value: "BD", icon: MapPin },
];

const FooterStats = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
            {stats.map((stat) => (
                <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {stat.label}
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default FooterStats;

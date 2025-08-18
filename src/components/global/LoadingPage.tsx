"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

const LoadingPage: FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
            {/* Icon animation */}
            <motion.div
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mb-6"
            >
                <FaBookOpen className="w-20 h-20 text-blue-600 dark:text-blue-400" />
            </motion.div>

            {/* Loading text */}
            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            >
                Preparing Your Learning Space...
            </motion.h1>

            {/* Animated dots */}
            <motion.div
                className="flex gap-1"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.2,
                            repeat: Infinity,
                        },
                    },
                }}
            >
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"
                        variants={{
                            hidden: { opacity: 0.2, y: 0 },
                            visible: {
                                opacity: 1,
                                y: -4,
                                transition: { repeat: Infinity, repeatType: "reverse", duration: 0.5 },
                            },
                        }}
                    />
                ))}
            </motion.div>

            {/* Progress bar */}
            <motion.div
                className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-8 overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "12rem" }}
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    className="h-full bg-blue-600 dark:bg-blue-400"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                />
            </motion.div>
        </div>
    );
};

export default LoadingPage;

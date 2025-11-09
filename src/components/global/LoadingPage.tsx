"use client";

import { FC, useMemo } from "react";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

/**
 * Updated LoadingPage:
 * - Premium professional blue palette (Tailwind blue shades)
 * - Keeps the same animations and timings
 * - Loads Google Font (Inter) and applies it to the root container
 *
 * Note: For best performance in a Next.js app router project, prefer adding Google Fonts
 * to your root layout/head (or use next/font) instead of in-component @import. This in-component
 * import is intentional to keep this snippet self-contained.
 */

const LoadingPage: FC = () => {
    const particles = useMemo(
        () =>
            [...Array(6)].map(() => ({
                x: Math.round(Math.random() * 100),
                y: Math.round(Math.random() * 100),
                delay: Math.random() * 2,
                duration: 8 + Math.random() * 4,
            })),
        []
    );

    return (
        <>
            {/* Google Font (self-contained for the snippet) */}
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');`}
            </style>

            <div
                className="min-h-screen relative overflow-hidden bg-white"
                style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}
            >
                {/* Subtle decorative orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.22, 0.12] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-28 -left-28 w-80 h-80 bg-gradient-to-br from-blue-50/60 to-blue-100/30 rounded-full blur-2xl"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.06, 1], opacity: [0.10, 0.18, 0.10] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-28 -right-28 w-80 h-80 bg-gradient-to-br from-blue-50/55 to-sky-50/30 rounded-full blur-2xl"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.04, 1], opacity: [0.11, 0.20, 0.11] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-sky-50/40 to-blue-50/25 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"
                    />
                </div>

                {/* Main content */}
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="max-w-md w-full rounded-2xl p-10 text-blue-900"
                    >
                        {/* Icon block */}
                        <motion.div
                            initial={{ scale: 0.92, rotate: -6 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.12 }}
                            className="relative mx-auto w-28 h-28 mb-6"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-50 border-r-blue-100"
                            />

                            <motion.div
                                animate={{ scale: [1, 1.04, 1], opacity: [0.7, 0.95, 0.7] }}
                                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-50 to-blue-100"
                            />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaBookOpen className="w-12 h-12 text-blue-600" />
                            </div>
                        </motion.div>

                        {/* Progress bar */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.995 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.38, duration: 0.4 }}
                            className="w-full mx-auto"
                        >
                            <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ repeat: Infinity, duration: 1.9, ease: "linear" }}
                                    className="h-full w-1/3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-sm"
                                />
                            </div>
                        </motion.div>

                        {/* Animated dots */}
                        <motion.div className="flex gap-2 justify-center mt-5" initial="hidden" animate="visible">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    className="w-2.5 h-2.5 rounded-full bg-blue-200"
                                    initial={{ opacity: 0.32, scale: 0.86 }}
                                    animate={{ opacity: [0.32, 0.9, 0.32], scale: [0.86, 1.12, 0.86] }}
                                    transition={{ duration: 1.25, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Floating subtle particles */}
                    {particles.map((p, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 bg-blue-50 rounded-full"
                            style={{ left: `${p.x}vw`, top: `${p.y}vh` }}
                            animate={{
                                y: [0, (Math.random() * 18 + 16) * (i % 2 ? 1 : -1), 0],
                                opacity: [0, 0.85, 0],
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                delay: p.delay,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default LoadingPage;

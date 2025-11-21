'use client'

import Link from "next/link";
import { motion } from "framer-motion";

export default function FooterCTA() {
    return (
        <div className="sticky bottom-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-t border-white/20 shadow-2xl">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-white">
                        <p className="font-bold text-lg">Ready to get started?</p>
                        <p className="text-sm text-blue-100">Join thousands of successful learners today</p>
                    </div>
                    <Link href="/signup">
                        <motion.button
                            className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-xl"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Free Trial
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
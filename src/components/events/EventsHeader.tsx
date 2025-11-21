"use client";

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function EventsHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12"
        >
            <div className="space-y-3">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex items-center gap-3"
                >
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg shadow-blue-200">
                        <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Events</h1>
                        <p className="text-sm text-gray-600 font-medium mt-1">Manage & orchestrate</p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

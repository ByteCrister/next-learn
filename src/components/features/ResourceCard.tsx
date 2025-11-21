"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ResourceCardProps {
    icon: string | ReactNode;
    title: string;
    desc: string;
}

export default function ResourceCard({ icon, title, desc }: ResourceCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative p-8 rounded-2xl border-2 border-white/20 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl space-y-4 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden"
        >
            {/* Hidden gradient orb that scales on hover */}
            <motion.div
                className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.3 }}
            />
            <motion.div
                className="text-5xl text-blue-500 group-hover:text-purple-500 transition-colors duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                {icon}
            </motion.div>
            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">{title}</h3>
            <p className="text-base text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">{desc}</p>
        </motion.div>
    );
}

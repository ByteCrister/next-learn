"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureListProps {
    items: { label: string; detail: string; icon: string | ReactNode }[];
}

export default function FeatureList({ items }: FeatureListProps) {
    return (
        <ul className="space-y-6">
            {items.map((item, i) => (
                <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 dark:hover:bg-gray-800/5 transition-colors duration-300 cursor-pointer group"
                >
                    <motion.span
                        className="text-3xl text-blue-500 group-hover:text-purple-500 transition-colors duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        {item.icon}
                    </motion.span>
                    <div className="flex-1">
                        <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{item.label}</p>
                        <p className="text-base text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">{item.detail}</p>
                    </div>
                </motion.li>
            ))}
        </ul>
    );
}
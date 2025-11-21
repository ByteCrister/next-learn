"use client";

import { motion } from "framer-motion";

interface StatItemProps {
    value: string;
    label: string;
}

export default function StatItem({ value, label }: StatItemProps) {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className="space-y-2"
        >
            <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                {value}
            </p>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
        </motion.div>
    );
}

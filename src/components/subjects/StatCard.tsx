"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    gradientClasses: string;
}

export function StatCard({ label, value, icon, gradientClasses }: StatCardProps) {
    // Motion value and spring for smooth number animations
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 12, stiffness: 120 });
    const [displayValue, setDisplayValue] = useState(0);

    // Whenever `value` changes, animate the motion value
    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    // Subscribe to spring updates and round them for display
    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            setDisplayValue(Math.round(latest));
        });
        return () => unsubscribe();
    }, [springValue]);

    return (
        <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`flex flex-col justify-between p-6 rounded-2xl shadow-xl bg-gradient-to-br ${gradientClasses}`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-white text-lg font-medium">{label}</span>
                <span className="text-2xl text-white">{icon}</span>
            </div>
            <motion.span className="text-white text-4xl font-bold">
                {displayValue}
            </motion.span>
        </motion.div>
    );
}

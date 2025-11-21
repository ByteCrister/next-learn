"use client"

import { motion } from "framer-motion";
import { scaleIn } from "./motion-variants";
import StatItem from "./StatItem";
export default function StatsBanner() {
    return (
        <motion.div
            {...scaleIn}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 p-8 sm:p-12 border border-primary/20"
        >
            <div className="grid sm:grid-cols-4 gap-8 text-center">
                <StatItem value="50K+" label="Active Learners" />
                <StatItem value="1M+" label="Study Sessions" />
                <StatItem value="98%" label="Satisfaction" />
                <StatItem value="24/7" label="Availability" />
            </div>
        </motion.div>
    );
}

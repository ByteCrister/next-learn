import { motion } from "framer-motion";
import { fadeUp } from "./motion-variants";
import { ReactNode } from "react";

interface SectionHeadingProps {
    icon: string | ReactNode;
    title: string;
    subtitle: string;
}

export default function SectionHeading({ icon, title, subtitle }: SectionHeadingProps) {
    return (
        <motion.div
            variants={fadeUp}
            className="space-y-4 max-w-4xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="flex items-center gap-4">
                <motion.div
                    className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-5xl text-white drop-shadow-lg">{icon}</span>
                </motion.div>
                <motion.h2
                    className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-black via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    {title}
                </motion.h2>
            </div>
            <motion.p
                className="text-xl text-muted-foreground leading-relaxed ml-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                {subtitle}
            </motion.p>
        </motion.div>
    );
}

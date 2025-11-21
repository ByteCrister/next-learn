"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface SubjectChipProps {
    color: string;
    label: string;
}

export default function SubjectChip({ color, label }: SubjectChipProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.08, x: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-2 border-white/20 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 group"
        >
            <motion.div
                className={`w-4 h-4 rounded-full ${color} shadow-md`}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
            />
            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{label}</span>
            <Badge
                variant="outline"
                className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md group-hover:shadow-lg transition-shadow duration-300"
            >
                12 items
            </Badge>
        </motion.div>
    );
}

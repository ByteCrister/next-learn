"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface ExamFeatureCardProps {
    icon: ReactNode;
    title: string;
    desc: string;
    metric: string;
}

export default function ExamFeatureCard({ icon, title, desc, metric }: ExamFeatureCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-xl border-2 bg-card space-y-4"
        >
            <div className="flex items-start justify-between">
                {icon}
                <Badge variant="secondary">{metric}</Badge>
            </div>
            <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
        </motion.div>
    );
}

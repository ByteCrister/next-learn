import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SharingCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    action: string;
}

export default function SharingCard({ icon, title, description, action }: SharingCardProps) {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 rounded-xl border-2 bg-card space-y-4"
        >
            <div className="text-4xl">{icon}</div>
            <div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button variant="outline" className="w-full">{action}</Button>
        </motion.div>
    );
}

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AccordionItemEnhancedProps {
    value: string;
    title: string;
    icon?: ReactNode;
    badge?: string;
    children: React.ReactNode;
}

export default function AccordionItemEnhanced({
    value,
    title,
    icon,
    badge,
    children
}: AccordionItemEnhancedProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
        >
            <AccordionItem
                value={value}
                className="border-2 border-white/20 rounded-2xl bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
                <AccordionTrigger className="px-8 py-6 hover:no-underline group/trigger relative">
                    {/* Gradient border on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-4">
                        {/* Icon or Circular numbered button */}
                        {icon ? (
                            <motion.div
                                className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                {icon}
                            </motion.div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                +
                            </div>
                        )}
                        <div className="flex items-center gap-3 flex-1">
                            <span className="font-bold text-lg group-hover/trigger:text-primary transition-colors duration-300">{title}</span>
                            {badge && (
                                <Badge
                                    variant="secondary"
                                    className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md"
                                >
                                    {badge}
                                </Badge>
                            )}
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </AccordionContent>
            </AccordionItem>
        </motion.div>
    );
}

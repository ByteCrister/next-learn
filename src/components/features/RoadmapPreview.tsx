import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function RoadmapPreview() {
    const milestones = [
        { week: "Week 1", title: "Fundamentals", done: true },
        { week: "Week 2", title: "Practice", done: true },
        { week: "Week 3", title: "Projects", done: false },
        { week: "Week 4", title: "Review", done: false },
    ];

    return (
        <div className="space-y-4">
            {milestones.map((m, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                    <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${m.done
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            }`}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        {m.done ? <Check className="w-4 h-4" /> : i + 1}
                    </motion.div>
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">{m.week}</p>
                        <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{m.title}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

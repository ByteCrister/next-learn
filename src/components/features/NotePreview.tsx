import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function NotePreview() {
    return (
        <motion.div
            className="rounded-2xl border-2 border-white/20 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl p-6 space-y-4 shadow-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md">Tip</Badge>
                <span className="text-muted-foreground font-medium">2 min read</span>
            </div>
            <p className="font-bold text-xl text-foreground">K-Nearest Neighbors Algorithm</p>
            <p className="text-muted-foreground leading-relaxed text-base">
                Remember: KNN depends heavily on distance metrics. Choose Euclidean for continuous features,
                Hamming for categorical data.
            </p>
            <div className="flex gap-3 pt-3">
                <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-300/50 text-purple-700 dark:text-purple-300">Algorithm</Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-300/50 text-blue-700 dark:text-blue-300">ML</Badge>
            </div>
        </motion.div>
    );
}

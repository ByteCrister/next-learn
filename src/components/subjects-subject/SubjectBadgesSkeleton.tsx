import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
const SubjectBadgesSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[...Array(3)].map((_, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative p-6 rounded-3xl bg-indigo-300/30 shadow-lg"
                >
                    <Skeleton className="h-10 w-10 bg-neutral-400 rounded-full mb-4" />
                    <Skeleton className="h-6 bg-neutral-400 w-2/3 mb-2" />
                    <Skeleton className="h-12 bg-neutral-400 w-1/2" />
                </motion.div>
            ))}
        </div>
    )
}

export default SubjectBadgesSkeleton
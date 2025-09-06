"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const SubjectPageSkeleton = () => {
    // Common high-contrast skeleton style
    const skeletonClass =
        "bg-gray-300 dark:bg-gray-700 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-6 py-10 font-sans space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div className="flex-1 space-y-2">
                    <Skeleton className={`h-10 sm:h-12 w-2/3 rounded-lg ${skeletonClass}`} />
                    <Skeleton className={`h-6 w-1/3 rounded-lg ${skeletonClass}`} />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-0">
                    <Skeleton className={`h-10 w-28 sm:w-auto rounded-lg ${skeletonClass}`} />
                    <Skeleton className={`h-10 w-28 sm:w-auto rounded-lg ${skeletonClass}`} />
                    <Skeleton className={`h-10 w-28 sm:w-auto rounded-lg ${skeletonClass}`} />
                </div>
            </div>

            {/* Subject Code & Description */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
                <div className="flex items-center gap-3">
                    <Skeleton className={`w-8 h-8 rounded-full ${skeletonClass}`} />
                    <Skeleton className={`h-6 w-32 rounded-md ${skeletonClass}`} />
                </div>
                <div className="space-y-2">
                    <Skeleton className={`h-4 w-full rounded-md ${skeletonClass}`} />
                    <Skeleton className={`h-4 w-5/6 rounded-md ${skeletonClass}`} />
                    <Skeleton className={`h-4 w-3/4 rounded-md ${skeletonClass}`} />
                </div>
            </div>

            {/* Counts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-5 bg-white/70 backdrop-blur-md shadow-lg px-6 py-5 rounded-2xl cursor-pointer border border-gray-100"
                    >
                        <Skeleton className={`w-14 h-14 rounded-full ${skeletonClass}`} />
                        <div className="flex flex-col gap-1">
                            <Skeleton className={`h-6 w-20 rounded-md ${skeletonClass}`} />
                            <Skeleton className={`h-3 w-16 rounded-md ${skeletonClass}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Roadmap */}
            <div className="mt-10 space-y-4">
                <Skeleton className={`h-8 w-1/4 rounded-md ${skeletonClass}`} />
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <Skeleton key={idx} className={`h-6 w-full rounded-lg ${skeletonClass}`} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default SubjectPageSkeleton;

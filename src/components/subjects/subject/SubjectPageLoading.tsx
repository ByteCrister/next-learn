"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function SubjectPageLoading() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-white space-y-10 rounded-2xl">
      
      {/* Subject Form Skeleton */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6"
      >
        <Skeleton className="h-10 w-1/3 bg-neutral-200 rounded-md" />
        <Skeleton className="h-10 bg-neutral-300 rounded-md" />
        <Skeleton className="h-24 bg-neutral-300 rounded-md" />
        <div className="flex justify-end space-x-3 pt-4">
          <Skeleton className="h-10 w-24 bg-neutral-200 rounded-md" />
          <Skeleton className="h-10 w-24 bg-neutral-200 rounded-md" />
        </div>
      </motion.div>

      {/* Subject Counts Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[...Array(3)].map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative p-6 rounded-3xl bg-indigo-300/30 shadow-lg"
          >
            <Skeleton className="h-10 w-10 bg-neutral-300 rounded-full mb-4" />
            <Skeleton className="h-6 bg-neutral-200 w-2/3 mb-2" />
            <Skeleton className="h-12 bg-neutral-200 w-1/2" />
          </motion.div>
        ))}
      </div>

      {/* Roadmap Info Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto space-y-6"
      >
        <Skeleton className="h-12 bg-neutral-300 w-1/2 rounded-md mx-auto" />
        <Skeleton className="h-10 bg-neutral-200 rounded-md" />
        <Skeleton className="h-24 bg-neutral-200 rounded-md" />
        <Skeleton className="h-10 bg-neutral-200 rounded-md" />
      </motion.div>

      {/* Roadmap Content Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-4"
      >
        <Skeleton className="h-8 w-48 bg-neutral-300 rounded-md mx-auto" />
        <Skeleton className="h-48 bg-neutral-200 rounded-xl" />
      </motion.div>

      {/* Chapters List Skeleton */}
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 bg-neutral-300 rounded-md mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <Skeleton key={idx} className="h-24 bg-neutral-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

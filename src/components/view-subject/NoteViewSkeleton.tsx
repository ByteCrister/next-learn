import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

export default function NoteViewSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-indigo-400/15 to-pink-400/15 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-lg"
        />
      </div>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50"
        initial={{ scaleX: 0 }}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Hero Section Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl p-2 border border-white/20 shadow-2xl relative overflow-hidden"
        >
          {/* Reading Time Badge Skeleton */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className="absolute top-4 right-4 z-10"
          >
            <Skeleton className="h-10 w-24 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200/50 shadow-lg backdrop-blur-sm" />
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />

          {/* Main Title Skeleton */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            <Skeleton className="h-16 md:h-20 w-3/4 mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg" />
          </motion.div>

          {/* Subject Info Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <Skeleton className="h-10 w-64 mx-auto bg-gradient-to-r from-indigo-50 to-blue-50 rounded-full border border-indigo-200/50 shadow-lg backdrop-blur-sm" />
          </motion.div>

          {/* Decorative Line Skeleton */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-32 h-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mx-auto mb-8"
          />
        </motion.div>

        {/* Content Section Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden relative"
        >
          {/* Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl p-[1px]">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl h-full w-full" />
          </div>

          <div className="relative z-10 p-8 md:p-12">
            {/* Enhanced Metadata Skeleton */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-indigo-50/80 dark:from-gray-700/50 dark:via-gray-600/50 dark:to-gray-500/50 rounded-2xl border border-blue-200/50 dark:border-gray-600/50 backdrop-blur-sm"
            >
              <Skeleton className="h-16 w-32 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-blue-200/50 dark:border-gray-600/50" />
              <Skeleton className="h-16 w-32 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-purple-200/50 dark:border-gray-600/50" />
              <Skeleton className="h-16 w-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl border border-blue-300/50 dark:border-blue-700/50 ml-auto" />
            </motion.div>

            {/* Note Content Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-white/60 to-gray-50/60 dark:from-gray-900/60 dark:to-gray-800/60 p-12 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-inner backdrop-blur-sm"
            >
              <div className="space-y-4">
                <Skeleton className="h-6 w-full bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-6 w-5/6 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-6 w-4/5 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-6 w-full bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-6 w-full bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-6 w-4/5 bg-gray-200 dark:bg-gray-700" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

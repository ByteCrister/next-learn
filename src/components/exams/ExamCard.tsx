"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { ExamOverviewCard } from "@/types/types.exam";

export function ExamCard({
  exam,
  onClick,
  index = 0,
}: {
  exam: ExamOverviewCard;
  onClick?: () => void;
  index?: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Card
        onClick={onClick}
        className="
          group relative cursor-pointer overflow-hidden rounded-2xl
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          shadow-md hover:shadow-2xl
          transform hover:-translate-y-1
          transition-all duration-300
          focus-within:ring-2 focus-within:ring-indigo-500
        "
      >
        {/* Soft color orb for depth */}
        <div className="absolute -top-6 right-6 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 opacity-20 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative p-6 flex flex-col h-full space-y-4">
          <CardHeader className="p-0">
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                {exam.title}
              </CardTitle>
              <Badge
                variant="outline"
                className="
                  px-3 py-1 text-xs font-semibold uppercase
                  text-indigo-600 dark:text-indigo-300
                  border-indigo-300 dark:border-indigo-700
                  bg-indigo-50 dark:bg-indigo-800
                  transition-colors duration-200
                  group-hover:bg-indigo-100 dark:group-hover:bg-indigo-700
                "
              >
                {exam.examCode}
              </Badge>
            </div>

            {exam.description && (
              <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {exam.description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="flex-1 p-0">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Subject:</span>{" "}
              <span className="text-gray-900 dark:text-gray-100">
                {exam.subjectCode}
              </span>
            </div>
          </CardContent>

          <CardFooter className="p-0 flex justify-end">
            <motion.div
              whileHover={{ x: 4 }}
              className="
                inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400
                font-medium
                hover:text-indigo-700 dark:hover:text-indigo-200
                transition-colors duration-200
              "
            >
              <span>View Details</span>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}

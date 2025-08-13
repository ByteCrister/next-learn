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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Card
        onClick={onClick}
        className={`
          group cursor-pointer overflow-hidden rounded-xl border border-transparent
          bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50
          p-[1px] shadow-md backdrop-blur
          transition-all duration-300
          hover:shadow-xl hover:scale-[1.02] hover:from-gray-100 hover:to-gray-200
        `}
      >
        {/* Inner glass layer */}
        <div className="rounded-[0.75rem] bg-white/70 p-4 backdrop-blur-xl transition-all duration-300 group-hover:bg-white/80">
          <CardHeader className="space-y-2 p-0">
            <div className="flex items-center justify-between gap-2">
              <CardTitle
                className="line-clamp-1 text-2xl font-semibold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                {exam.title}
              </CardTitle>
              <Badge
                variant="outline"
                className="font-mono border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm group-hover:border-indigo-500 group-hover:bg-indigo-100"
              >
                {exam.examCode}
              </Badge>
            </div>

            {exam.description && (
              <CardDescription className="line-clamp-2 text-gray-600">
                {exam.description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="pt-2 px-0">
            <div className="text-sm text-gray-700">
              Subject:{" "}
              <span className="font-medium text-gray-900">
                {exam.subjectCode}
              </span>
            </div>
          </CardContent>

          <CardFooter className="px-0 pt-4 justify-end">
            <motion.div
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors group-hover:text-indigo-700"
            >
              View
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}

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
import { Button } from "@/components/ui/button";
import {
  FileText,
  Code2,
  BookMarked,
  Clock,
  Calendar,
  ListChecks,
  CheckCircle2,
  Hourglass,
} from "lucide-react";
import type { ExamOverviewCard } from "@/types/types.exam";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function statusColor(status: ExamOverviewCard["status"]) {
  switch (status) {
    case "draft":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    case "scheduled":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
    case "completed":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function ExamCard({
  exam,
  onClick,
  index = 0,
  isSearched = false,
}: {
  exam: ExamOverviewCard;
  onClick?: () => void;
  index?: number;
  isSearched?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        onClick={onClick}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 flex flex-col h-full",
          isSearched ? "z-10" : ""
        )}
      >
        {/* Highlight ring (animated) */}
        {isSearched && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="pointer-events-none absolute -inset-1 rounded-2xl ring-2 ring-indigo-400/40 dark:ring-indigo-500/30 shadow-[0_8px_30px_rgba(99,102,241,0.08)]"
          />
        )}

        {/* Small pulsing indicator at top-right */}
        {isSearched && (
          <span className="pointer-events-none absolute top-3 right-3 flex items-center gap-2">
            <motion.span
              aria-hidden
              initial={{ scale: 0.9, opacity: 0.9 }}
              animate={{ scale: [0.9, 1.3, 0.9], opacity: [0.9, 0.35, 0.9] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="block w-3 h-3 rounded-full bg-indigo-400/80 dark:bg-indigo-500/90"
            />
          </span>
        )}

        {/* Accent gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative p-6 flex flex-col h-full space-y-5">
          <CardHeader className="p-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge
                  variant="outline"
                  className="px-2 py-0.5 text-xs font-medium border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 bg-blue-50/60 dark:bg-blue-900/30"
                >
                  {exam.examCode}
                </Badge>
              </div>
              <Badge className={`px-2 py-0.5 text-xs font-semibold ${statusColor(exam.status)}`}>
                {exam.status.toUpperCase()}
              </Badge>
            </div>

            <CardTitle className="text-xl font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2">
              {exam.title}
            </CardTitle>

            {exam.description && (
              <CardDescription className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {exam.description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="flex-1 p-0 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <Code2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <div className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100">
                {exam.subjectCode}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <ListChecks className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {exam.questionCount} Questions
              </div>
            </div>

            {exam.isTimed && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Duration: {exam.durationMinutes} min
                </div>
              </div>
            )}

            {exam.scheduledStartAt && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Starts: {format(new Date(exam.scheduledStartAt), "PPpp")}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              {exam.allowLateSubmissions ? (
                <Hourglass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {exam.allowLateSubmissions ? "Late submissions allowed" : "Strict deadline"}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-0 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClick}
              className="flex-1 flex items-center gap-2"
            >
              <BookMarked className="w-4 h-4" />
              View Exam
            </Button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}

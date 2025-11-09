"use client";

import React from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { useParams } from "next/navigation";
import { getViewNote } from "@/utils/api/api.view";
import { toast } from "react-toastify";
import HeaderSkeleton from "@/components/view-share-subject/HeaderSkeleton";
import ErrorHeader from "@/components/view-share-subject/ErrorHeader";
import BodySkeleton from "@/components/view-share-subject/BodySkeleton";
import ErrorBody from "@/components/view-share-subject/ErrorBody";
import NoteViewSkeleton from "@/components/view-share-subject/NoteViewSkeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubjectNote } from "@/types/types.subjectnote";
import { decodeId } from "@/utils/helpers/IdConversion";
import { Calendar, Clock, Hash, BookOpen, Bookmark } from "lucide-react";
import HtmlContent from "@/components/global/HtmlContent";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import { useNoteCalculations } from "@/hooks/useNoteCalculations";
import { useNoteActions } from "@/hooks/useNoteActions";

// ---------- Types ----------
type ViewNoteData = { note: SubjectNote; subject: { title: string; code?: string } };

// ---------- Variants ----------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ViewSharedNotePage() {
  const [data, setData] = React.useState<ViewNoteData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { setBreadcrumbs } = useBreadcrumbStore();

  const { subjectId: encodedSubjectId, noteId: encodedNoteId } = useParams();

  const { scrollYProgress } = useScroll();
  const readingProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const { calculateReadingTime, wordCount } = useNoteCalculations({ content: data?.note.content });

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const subjectId = decodeId(decodeURIComponent(encodedSubjectId as string));
      const noteId = decodeId(decodeURIComponent(encodedNoteId as string));

      const res = await getViewNote(subjectId, noteId);
      if ("message" in res) {
        toast.error(res.message || "Failed to load note.");
        setError(res.message || "Failed to load note.");
        setData(null);
      } else {
        setData(res);
      }
    } catch (err) {
      toast.error("Something went wrong while fetching data.");
      setError("Something went wrong while fetching data.");
      setData(null);
    } finally {
      setLoading(false);
    }
    setBreadcrumbs([
      { label: 'Home', href: '/' },
      { label: 'Shared Note', href: `/view-subject/notes/${encodedSubjectId}/${encodedNoteId}` },
    ]);
  }, [encodedSubjectId, encodedNoteId, setBreadcrumbs]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 relative overflow-hidden">
        {/* Optimized Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-indigo-400/15 to-pink-400/15 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-lg" />
        </div>

        {/* Reading Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50"
          style={{ scaleX: readingProgress }}
          initial={{ scaleX: 0 }}
        />

        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl p-2 border border-white/20 shadow-2xl relative overflow-hidden"
          >
            {/* Bookmark Button - Top Left Corner */}
            {data && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-full border border-amber-200/50 hover:border-amber-300/60 shadow-lg hover:shadow-xl backdrop-blur-sm cursor-pointer transition-all duration-200"
              >
                <Bookmark className="w-5 h-5 text-amber-700 hover:text-amber-800" />
                <span className="text-sm font-semibold text-amber-700 hover:text-amber-800">Bookmark</span>
              </motion.div>
            )}

            {/* Reading Time & Stats - Top Right Corner of Hero */}
            {data && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 z-10 flex flex-wrap items-center gap-4"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-full border border-blue-200/50 hover:border-blue-300/60 shadow-lg hover:shadow-xl backdrop-blur-sm cursor-pointer transition-all duration-200">
                  <BookOpen className="w-5 h-5 text-blue-600 hover:text-blue-700" />
                  <span className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                    {calculateReadingTime} min read
                  </span>
                </div>
              </motion.div>
            )}
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />

            {loading ? (
              <HeaderSkeleton />
            ) : error ? (
              <ErrorHeader onRetry={load} error={error} />
            ) : data ? (
              <>


                {/* Main Title */}
                <motion.h1
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight drop-shadow-lg"
                >
                  {data.note.title || "Untitled Note"}
                </motion.h1>

                {/* Subject Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-full border border-indigo-200/50 shadow-lg backdrop-blur-sm">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                    <span className="text-base font-medium text-gray-700">
                      From <span className="text-blue-600 font-bold">{data.subject.title}</span>
                      {data.subject.code && <span className="text-gray-500 ml-2">• {data.subject.code}</span>}
                    </span>
                  </div>
                </motion.div>



                {/* Decorative Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full mx-auto mb-8"
                />

                
              </>
            ) : null}
          </motion.div>

          {/* Content Section */}
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
              {loading ? (
                <BodySkeleton />
              ) : error ? (
                <ErrorBody onRetry={load} />
              ) : data ? (
                <>
                  {/* Enhanced Metadata */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-indigo-50/80 dark:from-gray-700/50 dark:via-gray-600/50 dark:to-gray-500/50 rounded-2xl border border-blue-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 text-sm bg-white/60 dark:bg-gray-800/60 px-4 py-3 rounded-xl border border-blue-200/50 dark:border-gray-600/50"
                    >
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300 block">Created</span>
                        <span className="text-gray-600 dark:text-gray-400">{new Date(data.note.createdAt).toLocaleString()}</span>
                      </div>
                    </motion.div>

                    {data.note.updatedAt && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 text-sm bg-white/60 dark:bg-gray-800/60 px-4 py-3 rounded-xl border border-purple-200/50 dark:border-gray-600/50"
                      >
                        <Clock className="w-5 h-5 text-purple-500" />
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300 block">Updated</span>
                          <span className="text-gray-600 dark:text-gray-400">{new Date(data.note.updatedAt).toLocaleString()}</span>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 text-sm bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 px-4 py-3 rounded-xl border border-blue-300/50 dark:border-blue-700/50 ml-auto"
                    >
                      <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <span className="font-bold text-blue-700 dark:text-blue-300 text-lg">
                          {wordCount}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 ml-1">words</span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Note Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="prose prose-2xl prose-gray dark:prose-invert max-w-none bg-gradient-to-br from-white/60 to-gray-50/60 dark:from-gray-900/60 dark:to-gray-800/60 p-12 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-inner backdrop-blur-sm"
                  >
                    <HtmlContent html={data.note.content || "No content"} />
                  </motion.div>
                </>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}

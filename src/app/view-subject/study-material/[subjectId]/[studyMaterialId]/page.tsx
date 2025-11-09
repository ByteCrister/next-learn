"use client";

import React from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { useParams } from "next/navigation";
import { getViewStudyMaterial } from "@/utils/api/api.view";
import { toast } from "react-toastify";
import HeaderSkeleton from "@/components/view-share-subject/HeaderSkeleton";
import ErrorHeader from "@/components/view-share-subject/ErrorHeader";
import BodySkeleton from "@/components/view-share-subject/BodySkeleton";
import ErrorBody from "@/components/view-share-subject/ErrorBody";

import { TooltipProvider } from "@/components/ui/tooltip";
import { decodeId } from "@/utils/helpers/IdConversion";
import { Calendar, Hash, FileText, BookOpen, Star } from "lucide-react";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";


// ---------- Types ----------
type ViewStudyMaterialData = { studyMaterial: any; externalLink: any; subject: { title: string; code?: string } };



export default function ViewSharedStudyMaterialPage() {
  const [data, setData] = React.useState<ViewStudyMaterialData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedItems, setExpandedItems] = React.useState<Set<number>>(new Set());

  const { setBreadcrumbs } = useBreadcrumbStore();

  const { subjectId: encodedSubjectId, studyMaterialId: encodedStudyMaterialId } = useParams();

  const { scrollYProgress } = useScroll();
  const readingProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const subjectId = decodeId(decodeURIComponent(encodedSubjectId as string));
      const studyMaterialId = decodeId(decodeURIComponent(encodedStudyMaterialId as string));

      const res = await getViewStudyMaterial(subjectId, studyMaterialId);
      if ("message" in res) {
        toast.error(res.message || "Failed to load study material.");
        setError(res.message || "Failed to load study material.");
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
      { label: 'Shared Study Material', href: `/view-subject/study-material/${encodedSubjectId}/${encodedStudyMaterialId}` },
    ]);
  }, [encodedSubjectId, encodedStudyMaterialId, setBreadcrumbs]);

  React.useEffect(() => {
    load();
  }, [load]);





  const toggleAccordion = (index: number) => {
    const newExpandedItems = new Set<number>();
    if (!expandedItems.has(index)) {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };



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
            {/* Cool Design Element - Top Left Corner */}
            {data && (
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 border border-white/20 shadow-lg hover:shadow-xl backdrop-blur-sm cursor-pointer transition-all duration-300"
              >
                <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                <Star className="w-5 h-5 text-yellow-300 animate-pulse" />
                <BookOpen className="w-5 h-5 text-blue-300 animate-pulse" />
              </motion.div>
            )}

            {/*  Top Right Corner of Hero */}
            {data && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 z-10 flex flex-wrap items-center gap-4"
              >
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
                  {data.studyMaterial.filename || "Untitled Study Material"}
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
                        <span className="font-semibold text-gray-700 dark:text-gray-300 block">Uploaded</span>
                        <span className="text-gray-600 dark:text-gray-400">{new Date(data.studyMaterial.uploadedAt).toLocaleString()}</span>
                      </div>
                    </motion.div>

                    {data.studyMaterial.fileTypes.length > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 text-sm bg-white/60 dark:bg-gray-800/60 px-4 py-3 rounded-xl border border-purple-200/50 dark:border-gray-600/50"
                      >
                        <FileText className="w-5 h-5 text-purple-500" />
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300 block">Type</span>
                          <span className="text-gray-600 dark:text-gray-400">{data.studyMaterial.fileTypes[0].toUpperCase()}</span>
                        </div>
                      </motion.div>
                    )}

                    {data.studyMaterial.tags.length > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 text-sm bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 px-4 py-3 rounded-xl border border-blue-300/50 dark:border-blue-700/50 ml-auto"
                      >
                        <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <span className="font-bold text-blue-700 dark:text-blue-300 text-lg">
                            {data.studyMaterial.tags.length}
                          </span>
                          <span className="text-blue-600 dark:text-blue-400 ml-1">tags</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Study Material Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-br from-white/60 to-gray-50/60 dark:from-gray-900/60 dark:to-gray-800/60 p-12 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-inner backdrop-blur-sm"
                  >
                    {data.studyMaterial.description && (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.studyMaterial.description}</p>
                      </div>
                    )}


                    {/* Embedded Content Viewer */}
                    {data.studyMaterial.urls.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Content Preview</h3>
                        {data.studyMaterial.urls.length === 1 ? (
                          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {data.studyMaterial.fileTypes[0] === 'pdf' ? (
                              <iframe
                                src={data.studyMaterial.urls[0]}
                                className="w-full h-[32rem] border-0"
                                title={data.studyMaterial.filename}
                              />
                            ) : data.studyMaterial.fileTypes[0] === 'image' ? (
                              <img
                                src={data.studyMaterial.urls[0]}
                                alt={data.studyMaterial.filename}
                                className="w-full h-auto max-h-[32rem] object-contain"
                              />
                            ) : (
                              <div className="p-8 text-center">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">
                                  Content preview not available for this file type.
                                  <br />
                                  Use the download button above to view the file.
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {data.studyMaterial.urls.slice().reverse().map((url: string, index: number) => {
                              const fileType = data.studyMaterial.fileTypes.slice().reverse()[index] || data.studyMaterial.fileTypes[0];
                              const fileName = data.studyMaterial.filenames?.slice().reverse()[index] || `${data.studyMaterial.filename} (${index + 1})`;

                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                >
                                  <motion.button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <FileText className="w-5 h-5 text-blue-500" />
                                      <span className="font-medium text-gray-800 dark:text-gray-200">{fileName}</span>
                                      <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">{fileType}</span>
                                    </div>
                                    <motion.div
                                      animate={{ rotate: expandedItems.has(index) ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="w-5 h-5 text-gray-400"
                                    >
                                      ▼
                                    </motion.div>
                                  </motion.button>
                                  <motion.div
                                    className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                                    layout
                                  >
                                    {expandedItems.has(index) && (
                                      <div className="p-4">
                                        {fileType === 'pdf' ? (
                                          <iframe
                                            src={url}
                                            className="w-full h-150 border-0 rounded-lg"
                                            title={fileName}
                                          />
                                        ) : fileType === 'image' ? (
                                          <img
                                            src={url}
                                            alt={fileName}
                                            className="w-full h-auto max-h-150 object-contain rounded-lg"
                                          />
                                        ) : (
                                          <div className="p-8 text-center">
                                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">
                                              Content preview not available for this file type.
                                              <br />
                                              Use the download button above to view the file.
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </motion.div>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {data.studyMaterial.tags.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.studyMaterial.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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

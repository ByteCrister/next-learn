"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useChapterStore } from "@/store/useChapterStore";
import TipTapContentEditor from "@/components/Editor/TipTapContentEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { TStudyMaterial } from "@/types/types.chapter";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BookOpen, Edit, X, Eye, List, FileText, Loader2, File, ArrowUpRight, Plus, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChapterEditorProps {
    roadmapId: string;
    chapterId: string;
    mode?: 'edit' | 'view';
}

export default function ChapterEditor({ roadmapId, chapterId, mode = 'edit' }: ChapterEditorProps) {
    const { chapters, updateChapter, fetchChaptersByRoadmapId, loadingCrud } = useChapterStore();
    const [title, setTitle] = useState("");
    const [materials, setMaterials] = useState<TStudyMaterial[]>([]);
    const [contents, setContents] = useState<string[]>([""]);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        if (roadmapId && chapters.length === 0) {
            fetchChaptersByRoadmapId(roadmapId);
        }
    }, [roadmapId, fetchChaptersByRoadmapId, chapters.length]);

    useEffect(() => {
        const chapter = chapters.find((ch) => ch._id === chapterId);
        if (chapter) {
            setTitle(chapter.title || "");

            // Handle content properly - ensure it's always an array of strings
            let contentArray: string[] = [];
            if (Array.isArray(chapter.content)) {
                contentArray = chapter.content.map(c => {
                    if (typeof c === "string") return c;
                    if (typeof c === "object") return JSON.stringify(c);
                    return "";
                });
            } else if (typeof chapter.content === "string") {
                contentArray = [chapter.content];
            } else {
                contentArray = [""];
            }

            // Ensure at least one content section
            if (contentArray.length === 0) {
                contentArray = [""];
            }

            setContents(contentArray);
            setMaterials(chapter.materials || []);
        }
    }, [chapters, chapterId]);

    const handleSave = useCallback(async () => {
        if (!roadmapId || !chapterId) {
            toast.error("Missing required information. Please refresh and try again.");
            return;
        }

        if (!title.trim()) {
            toast.error("Chapter title cannot be empty.");
            return;
        }

        const existingChapter = chapters.find((ch) =>
            ch._id !== chapterId && ch.title.toLowerCase().trim() === title.toLowerCase().trim()
        );

        if (existingChapter) {
            toast.error(`A chapter with the title "${title.trim()}" already exists. Please choose a different title.`);
            return;
        }

        try {
            // Update title first
            await updateChapter({ roadmapId, chapterId, field: "title", data: title.trim() });

            // Then update content
            await updateChapter({ roadmapId, chapterId, field: "content", data: contents });

            toast.success("Chapter updated successfully!");
            router.push(`/subjects/${params.subjectId}/chapters`);
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save chapter changes. Please check your connection and try again.");
        }
    }, [roadmapId, chapterId, chapters, title, contents, updateChapter, router, params.subjectId]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-purple-100 dark:from-slate-900 dark:via-purple-900 dark:to-purple-900 relative">
            {/* Loading Overlay */}
            <AnimatePresence>
                {loadingCrud && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4"
                        >
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">Saving your changes...</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Please wait while we update the chapter</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto p-6 space-y-8">
                {/* Header Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {mode === 'edit' ? 'Edit Chapter' : 'Chapter'}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">
                                    {mode === 'edit' ? 'Make your changes and save when done' : 'Read and explore the content'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="space-y-4">
                        
                        <Input
                            placeholder="Enter chapter title..."
                            value={title}
                            onChange={mode === 'edit' ? (e) => setTitle(e.target.value) : undefined}
                            readOnly={mode === 'view'}
                            className={`text-2xl font-bold border-0 border-b-2 ${
                                mode === 'edit'
                                    ? 'border-blue-300 focus:border-blue-500 bg-transparent'
                                    : 'border-transparent bg-transparent'
                            } focus:ring-0 transition-colors duration-300 dark:bg-transparent dark:text-white`}
                            autoFocus={mode === 'edit'}
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* Content Section */}
                {mode === 'edit' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                                <Edit className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Content</h2>
                        </div>
                        {contents.map((singleContent, index) => (
                          <div key={`content-${index}`} className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
                            <TipTapContentEditor
                              content={singleContent as string}
                              onChange={(newContent) => {
                                setContents((prevContents) => {
                                  const updatedContents = [...prevContents];
                                  updatedContents[index] = newContent;
                                  return updatedContents;
                                });
                              }}
                              editable={true}
                              className="prose prose-lg prose-blue max-w-full rounded-xl min-h-[300px] shadow-inner dark:prose-invert transition-colors duration-300 bg-gray-50 dark:bg-gray-700 mb-0"
                            />
                            {contents.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setContents((prevContents) => prevContents.filter((_, i) => i !== index));
                                }}
                                style={{ zIndex: 1000 }}
                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition flex items-center justify-center shadow-lg"
                                aria-label={`Remove content section ${index + 1}`}
                              >
                                <X className="h-6 w-6" />
                              </button>
                            )}
                          </div>
                        ))}
                        <motion.button
                            type="button"
                            onClick={() => setContents((prev) => [...prev, ""])}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition mt-2 flex items-center space-x-2"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add More Content</span>
                        </motion.button>
                    </div>
                )}

                {mode === 'view' && contents.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {/* Content Header with Metadata */}
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-4 md:p-6 text-white">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                        <Eye className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg md:text-xl font-semibold">Chapter Content</h2>
                                        <p className="text-indigo-100 text-sm">
                                            {contents.length} section{contents.length > 1 ? 's' : ''} • {chapters.find(ch => ch._id === chapterId)?.createdAt ? new Date(chapters.find(ch => ch._id === chapterId)?.createdAt!).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right">
                                    <div className="text-sm text-indigo-100">
                                        {(() => {
                                            const totalWords = contents.reduce((acc, content) => {
                                                const text = content.replace(/<[^>]*>/g, '').trim();
                                                return acc + text.split(/\s+/).filter(word => word.length > 0).length;
                                            }, 0);
                                            const readingTime = Math.ceil(totalWords / 200); // Average reading speed
                                            return `${totalWords} words • ${readingTime} min read`;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table of Contents Navigation */}
                        {contents.length > 1 && (
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
                                <div className="flex items-center space-x-2 mb-3">
                                    <List className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Table of Contents</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {contents.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                // Scroll to the accordion item
                                                const element = document.getElementById(`section-${idx}`);
                                                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });

                                                // Expand the accordion item if it's collapsed
                                                const accordionItem = element?.closest('[data-state]');
                                                if (accordionItem && accordionItem.getAttribute('data-state') === 'closed') {
                                                    element?.click();
                                                }
                                            }}
                                            className="px-3 py-1 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs rounded-full border border-gray-300 dark:border-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 cursor-pointer"
                                        >
                                            Segment {idx + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Content Sections with Accordion */}
                        <div className="p-6">
                            <Accordion type="single" collapsible className="space-y-4">
                                {contents.map((contentSection, idx) => (
                                    <AccordionItem
                                        key={idx}
                                        value={`section-${idx}`}
                                        className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <AccordionTrigger
                                            id={`section-${idx}`}
                                            className="px-6 py-4 hover:no-underline group scroll-mt-6"
                                        >
                                            <div className="flex items-center space-x-4 text-left">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold group-hover:scale-110 transition-transform">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        Segment {idx + 1}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {(() => {
                                                            const text = contentSection.replace(/<[^>]*>/g, '').trim();
                                                            const words = text.split(/\s+/).filter(word => word.length > 0).length;
                                                            return `${words} words`;
                                                        })()}
                                                    </p>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6">
                                            <div className="ml-14">
                                                <div
                                                    className="prose prose-lg prose-blue max-w-full rounded-xl p-6 shadow-inner dark:prose-invert transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600"
                                                    dangerouslySetInnerHTML={{ __html: contentSection as string }}
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                        {/* Enhanced Study Materials Section */}
                        {materials.length > 0 && (
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Study Materials</h3>
                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                                        {materials.length}
                                    </span>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {materials.map((material, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <File className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {material.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Click to open
                                                    </p>
                                                </div>
                                                <a
                                                    href={material.data}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                {mode === 'edit' && (
                    <motion.div
                        className="flex justify-center space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Button
                                onClick={() => router.push(`/subjects/${params.subjectId}/chapters`)}
                                variant="outline"
                                className="px-8 py-3 text-lg flex items-center space-x-2"
                                disabled={loadingCrud}
                            >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                            </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(59, 130, 246, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Button
                                onClick={handleSave}
                                disabled={loadingCrud}
                                className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <AnimatePresence mode="wait">
                                    {loadingCrud ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center space-x-2"
                                        >
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="save"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center space-x-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Save Chapter</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    </motion.div>
                )}

                
            </div>
        </main>
    );
}

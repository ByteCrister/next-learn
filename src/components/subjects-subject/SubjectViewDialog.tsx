"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useSubjectStore } from "@/store/useSubjectsStore";
import HtmlContent from "../global/HtmlContent";
import { Book, FileText, Map, Sparkles, Eye, BookOpen, PenTool, Target, Lightbulb, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubjectViewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

const fadeIn: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const staggerItem: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const chapterIcons = [BookOpen, PenTool, Target, Lightbulb, Code];

const SubjectViewDialog: React.FC<SubjectViewDialogProps> = ({ open, onOpenChange, className }) => {
    const { selectedSubject, selectedRoadmap } = useSubjectStore();
    const router = useRouter();
    const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
    const [allExpanded, setAllExpanded] = useState(false);

    if (!selectedSubject) return null;

    const handleViewFullSubject = () => {
        onOpenChange(false);
        router.push(`/subjects/${selectedSubject._id}`);
    };

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters(prev => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
    };

    const toggleAllChapters = () => {
        if (!selectedRoadmap) return;
        const newState = !allExpanded;
        setAllExpanded(newState);
        const newExpanded: Record<string, boolean> = {};
        selectedRoadmap.chapters.forEach(chapter => {
            newExpanded[chapter._id] = newState;
        });
        setExpandedChapters(newExpanded);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    className={`
          sm:max-w-2xl max-h-[95vh]
          p-0 overflow-hidden rounded-3xl shadow-2xl shadow-indigo-500/25 dark:shadow-purple-500/25
          bg-gradient-to-br from-white/95 via-blue-50/50 to-indigo-50/30 dark:from-gray-800/95 dark:via-purple-900/20 dark:to-gray-900/30 backdrop-blur-xl
          border border-indigo-200/50 dark:border-purple-700/50
          flex flex-col
          ${className || ''}
        `}
                >
                {/* Header - Enhanced */}
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                >
                    <DialogHeader className="flex justify-between items-center p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20">
                        <DialogTitle asChild>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Book className="w-4 h-4 text-indigo-500" />
                                    <Sparkles className="w-2 h-2 absolute -top-1 -right-1 text-purple-400 animate-pulse" />
                                </div>
                                <h2 className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 break-words">
                                    {selectedSubject.title}
                                </h2>
                            </div>
                        </DialogTitle>

                    </DialogHeader>
                </motion.div>

                {/* Content - Enhanced layout */}
                <motion.div
                    className="flex-1 p-4 space-y-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-300 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-800/30"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Subject Description */}
                    {selectedSubject.description && (
                        <motion.div
                            variants={staggerItem}
                            className="flex items-start gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 shadow-sm border border-gray-200/50 dark:border-gray-600/50"
                        >
                            <FileText className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-500" />
                            <p className="leading-relaxed break-words">{selectedSubject.description}</p>
                        </motion.div>
                    )}

                    {/* Roadmap */}
                    {selectedRoadmap && (
                        <>
                            <motion.div
                                variants={staggerItem}
                                className="flex items-start gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 shadow-sm border border-gray-200/50 dark:border-gray-600/50"
                            >
                                <Map className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-500" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm mb-1">
                                        {selectedRoadmap.title}
                                    </h3>
                                    {selectedRoadmap.description && (
                                        <p className="leading-relaxed text-sm">{selectedRoadmap.description}</p>
                                    )}
                                </div>
                            </motion.div>

                            {selectedRoadmap.roadmap && (
                                <motion.div
                                    variants={staggerItem}
                                    className="p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 shadow-sm border border-gray-200/50 dark:border-gray-600/50"
                                >
                                    <HtmlContent
                                        html={selectedRoadmap.roadmap}
                                        className="prose prose-sm max-w-none leading-relaxed"
                                    />
                                </motion.div>
                            )}

                            {/* Chapters - Enhanced list */}
                            {selectedRoadmap.chapters?.length > 0 && (
                                <motion.div
                                    variants={staggerItem}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-purple-500" />
                                            Chapters
                                        </h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={toggleAllChapters}
                                            className="text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                                        >
                                            {allExpanded ? 'Collapse All' : 'Expand All'}
                                        </Button>
                                    </div>
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-2"
                                    >
                                        {selectedRoadmap.chapters.map((chapter, idx) => {
                                            const isExpanded = expandedChapters[chapter._id] || false;
                                            const Icon = chapterIcons[idx % chapterIcons.length];
                                            return (
                                                <motion.div
                                                    key={chapter._id}
                                                    variants={staggerItem}
                                                    className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/70 shadow-sm border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-200"
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="w-4 h-4 text-indigo-500" />
                                                            <span className="font-medium text-sm text-gray-900 dark:text-white">{chapter.title}</span>
                                                        </div>
                                                        {chapter.content && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleChapter(chapter._id)}
                                                                className="h-6 w-6 p-0 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                                                            >
                                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-2">
                                                        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full" style={{width: `${((idx + 1) / selectedRoadmap.chapters.length) * 100}%`}}></div>
                                                    </div>
                                                    <AnimatePresence>
                                                        {isExpanded && chapter.content && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="pl-7 pt-2">
                                                                    <HtmlContent
                                                                        html={chapter.content}
                                                                        className="prose prose-sm max-w-none leading-relaxed"
                                                                    />
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                </motion.div>
                            )}
                        </>
                    )}
                </motion.div>

                {/* Footer */}
                <DialogFooter className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <Button
                        onClick={handleViewFullSubject}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md transition-all duration-200 flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        View Full Subject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SubjectViewDialog;

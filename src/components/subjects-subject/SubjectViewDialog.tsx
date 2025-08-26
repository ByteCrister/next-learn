"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useSubjectStore } from "@/store/useSubjectsStore";
import HtmlContent from "../global/HtmlContent";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Book, Code, FileText, Map} from "lucide-react";

interface SubjectViewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SubjectViewDialog: React.FC<SubjectViewDialogProps> = ({ open, onOpenChange }) => {
    const { selectedSubject, selectedRoadmap } = useSubjectStore();
    if (!selectedSubject) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
          w-full sm:w-[90vw] md:max-w-6xl h-[90vh] max-h-screen 
          p-0 overflow-hidden rounded-2xl shadow-2xl
          bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800
          flex flex-col
        "
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-white/70 dark:bg-gray-900/70">
                    <DialogHeader className="flex-1">
                        <DialogTitle asChild>
                            <motion.h2
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                className="text-2xl sm:text-3xl md:text-4xl font-extrabold 
                 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                 bg-clip-text text-transparent tracking-tight flex items-center gap-3"
                            >
                                <Book className="text-indigo-500 dark:text-indigo-300 drop-shadow-sm" />
                                {selectedSubject.title}
                            </motion.h2>
                        </DialogTitle>
                    </DialogHeader>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                    {/* Subject Info */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-300">
                            <Code className="text-indigo-500 dark:text-indigo-300" />
                            <span className="font-semibold">Code:</span> {selectedSubject.code}
                        </div>
                        {selectedSubject.description && (
                            <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                <FileText className="text-indigo-500 dark:text-indigo-300 mt-1" />
                                <p>{selectedSubject.description}</p>
                            </div>
                        )}
                    </motion.section>

                    {/* Roadmap + Chapters in Accordion */}
                    {selectedRoadmap && (
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {/* Roadmap */}
                            <AccordionItem value="roadmap" className="border rounded-xl overflow-hidden shadow-sm">
                                <AccordionTrigger className="px-4 py-3 text-lg font-semibold text-indigo-800 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-gray-800">
                                    <div className="flex items-center gap-2">
                                        <Map className="text-indigo-500 dark:text-indigo-300" />
                                        {selectedRoadmap.title}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-4 bg-white dark:bg-gray-900">
                                    {selectedRoadmap.description && (
                                        <p className="mb-4 text-gray-700 dark:text-gray-300">{selectedRoadmap.description}</p>
                                    )}
                                    {selectedRoadmap.roadmap && (
                                        <HtmlContent
                                            html={selectedRoadmap.roadmap}
                                            className="prose prose-lg prose-indigo dark:prose-invert max-w-none"
                                        />
                                    )}
                                </AccordionContent>
                            </AccordionItem>

                            {/* Chapters */}
                            {selectedRoadmap.chapters?.length > 0 && (
                                <AccordionItem value="chapters" className="border rounded-xl overflow-hidden shadow-sm">
                                    <AccordionTrigger className="px-4 py-3 text-lg font-semibold text-indigo-800 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-gray-800">
                                        <div className="flex items-center gap-2">
                                            <Book className="text-indigo-500 dark:text-indigo-300" /> Chapters
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 py-4 bg-white dark:bg-gray-900 space-y-4">
                                        {selectedRoadmap.chapters.map((chapter, idx) => (
                                            <Accordion type="single" collapsible key={chapter._id} className="border rounded-lg overflow-hidden">
                                                <AccordionItem value={`chapter-${idx}`}>
                                                    <AccordionTrigger className="px-4 py-2 text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        {idx + 1}. {chapter.title}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-800">
                                                        <HtmlContent
                                                            html={chapter.content}
                                                            className="prose prose-sm sm:prose-lg prose-indigo dark:prose-invert max-w-none"
                                                        />
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                        </Accordion>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SubjectViewDialog;

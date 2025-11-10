"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubjectNote } from "@/types/types.subjectnote";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Copy, Share2, Clock, FileText, Hash } from "lucide-react";
import { useState } from "react";
import { encodeId } from "@/utils/helpers/IdConversion";

interface NoteViewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    note: SubjectNote | null;
}

export function NoteViewDialog({ isOpen, onClose, note }: NoteViewDialogProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (note?.content) {
            await navigator.clipboard.writeText(note.content.replace(/<[^>]*>/g, ''));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = async () => {
        if ('share' in navigator && note) {
            try {
                const encodedSubjectId = encodeURIComponent(encodeId(note.subjectId));
                const encodedNoteId = encodeURIComponent(encodeId(note._id));
                const url = `${window.location.origin}/view-subject/notes/${encodedSubjectId}/${encodedNoteId}`;
                const fullText = note.content.replace(/<[^>]*>/g, '');
                const text = fullText.length > 100 ? fullText.substring(0, 100) + '...' : fullText;
                await navigator.share({
                    title: note.title || "Note",
                    text: text,
                    url: url,
                });
                console.log('Share event: native share', { subjectId: note.subjectId, noteId: note._id, url });
            } catch (err) {
                console.log('Share failed:', err);
            }
        }
    };


    // Calculate word count
    const wordCount = note?.content ? note.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length : 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 shadow-2xl border-0 p-0 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full"
                        >
                            <DialogHeader className="flex flex-row items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText className="w-8 h-8 text-blue-600" />
                                        {note?.title || "Untitled Note"}
                                    </DialogTitle>
                                </motion.div>
                               
                            </DialogHeader>
                            <motion.div
                                className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-140px)]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.div
                                    className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Created: {note ? new Date(note.createdAt).toLocaleString() : ""}
                                    </div>
                                    {note?.updatedAt && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Updated: {new Date(note.updatedAt).toLocaleString()}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 ml-auto">
                                        <Hash className="w-4 h-4" />
                                        {wordCount} words
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="prose prose-lg prose-gray dark:prose-invert max-w-none bg-white dark:bg-gray-900 rounded-lg p-6 shadow-inner"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    dangerouslySetInnerHTML={{ __html: note?.content || "No content" }}
                                />
                                <motion.div
                                    className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                                        >
                                            <Copy className="w-4 h-4" />
                                            {copied ? "Copied!" : "Copy Text"}
                                        </Button>
                                    </motion.div>
                                    {'share' in navigator && (
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleShare}
                                                className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer"
                                            >
                                                <Share2 className="w-4 h-4" />
                                                
                                            </Button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}

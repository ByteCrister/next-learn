"use client";

import { useState, useEffect } from "react";
import { useSubjectNoteStore } from "@/store/useSubjectNoteStore";
import { SubjectNoteInput } from "@/types/types.subjectnote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import TipTapContentEditor from "@/components/Editor/TipTapContentEditor";
import { CheckCircle, XCircle, Loader2, FileText, PenTool, Save, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NoteEditorProps {
    subjectId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function NoteEditor({ subjectId, isOpen, onClose }: NoteEditorProps) {
    const { selectedNote, createNote, updateNote, loadingNoteCrud } = useSubjectNoteStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [titleError, setTitleError] = useState("");

    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote.title || "");
            setContent(selectedNote.content || "");
        } else {
            setTitle("");
            setContent("");
        }
        setSaveStatus('idle');
        setTitleError("");
    }, [selectedNote]);

    const handleTitleChange = (value: string) => {
        setTitle(value);
        // Clear error when user starts typing
        if (titleError) {
            setTitleError("");
        }
    };

    const handleSave = async () => {
        if (!content.trim()) {
            alert("Content is required");
            return;
        }

        // Check for unique title among existing notes
        const allNotes = useSubjectNoteStore.getState().notes;
        const trimmedTitle = title.trim();
        if (trimmedTitle) {
            const isDuplicate = allNotes.some(note =>
                note.title?.toLowerCase() === trimmedTitle.toLowerCase() &&
                note._id !== selectedNote?._id
            );
            if (isDuplicate) {
                setTitleError("Note title must be unique. Please choose a different title.");
                return;
            }
        }

        setSaveStatus('saving');
        const input: SubjectNoteInput = {
            title: trimmedTitle || undefined,
            content,
            attachments: [], // TODO: Add attachments
        };

        try {
            let success = false;
            if (selectedNote) {
                await updateNote(selectedNote._id, input);
                success = true;
            } else {
                const result = await createNote(subjectId, input);
                success = !!result;
            }

            if (success) {
                onClose();
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            setSaveStatus('error');
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-950/50 shadow-2xl border-0 p-0 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="w-full h-full"
                        >
                            <DialogHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-t-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
                                <div className="relative z-10">
                                    <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
                                        {selectedNote ? <PenTool className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                                        {selectedNote ? "Edit Note" : "Create New Note"}
                                        {saveStatus === 'saved' && <CheckCircle className="w-6 h-6 text-green-300" />}
                                        {saveStatus === 'saving' && <Loader2 className="w-6 h-6 animate-spin" />}
                                        {saveStatus === 'error' && <XCircle className="w-6 h-6 text-red-300" />}
                                    </DialogTitle>
                                    <DialogDescription className="text-center text-white/90 mt-2">
                                        {selectedNote ? "Update the note content and title." : "Add a new note to your subject."}
                                        {saveStatus === 'saved' && <span className="block text-green-200 font-medium">Note saved successfully!</span>}
                                        {saveStatus === 'error' && <span className="block text-red-200 font-medium">Failed to save note.</span>}
                                    </DialogDescription>
                                </div>
                            </DialogHeader>
                            <motion.div
                                className="space-y-6 p-8 overflow-y-auto max-h-[calc(95vh-140px)]"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div variants={itemVariants}>
                                    <Label htmlFor="title" className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        Title (optional)
                                    </Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="Enter note title"
                                        className={`mt-3 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${titleError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                                    />
                                    {titleError && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <XCircle className="w-4 h-4" />
                                            {titleError}
                                        </p>
                                    )}
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                        <PenTool className="w-5 h-5 text-purple-500" />
                                        Content
                                        <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            Auto-saved
                                        </span>
                                    </Label>
                                    <div className="mt-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                        <TipTapContentEditor
                                            content={content}
                                            onChange={setContent}
                                            placeholder="Write your note here..."
                                            className="min-h-[200px]"
                                        />
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700"
                                    variants={itemVariants}
                                >
                                    <div className="text-sm text-muted-foreground">
                                        {content.length > 0 && `${content.replace(/<[^>]*>/g, '').length} characters`}
                                    </div>
                                    <div className="flex gap-3">
                                        <motion.div whileHover={{ scale: 1.05, rotate: -2 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="outline"
                                                onClick={handleCancel}
                                                className="flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 hover:border-red-500 transition-all duration-200 cursor-pointer"
                                                aria-label="Cancel editing note"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Cancel
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05, rotate: 2 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                onClick={handleSave}
                                                disabled={loadingNoteCrud || saveStatus === 'saving'}
                                                className="flex items-center gap-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                                                aria-label={saveStatus === 'saving' ? "Saving note" : "Save note"}
                                            >
                                                {saveStatus === 'saving' ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : saveStatus === 'saved' ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                                {saveStatus === 'saving' ? "Saving..." : saveStatus === 'saved' ? "Saved!" : "Save"}
                                            </Button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}

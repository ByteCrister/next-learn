"use client";

import { useState } from "react";
import { useSubjectNoteStore } from "@/store/useSubjectNoteStore";
import { SubjectNote } from "@/types/types.subjectnote";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Trash2, Eye, Calendar, FileText, Hash, AlertTriangle, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NoteCardProps {
    note: SubjectNote;
    viewedNotes: string[];
    onEdit: () => void;
    onView: () => void;
}

export function NoteCard({ note, viewedNotes, onEdit, onView }: NoteCardProps) {
    const { setSelectedNote, deleteNote } = useSubjectNoteStore();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEdit = () => {
        setSelectedNote(note);
        onEdit();
    };

    const handleView = () => {
        onView();
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        const success = await deleteNote(note._id);
        setIsDeleting(false);
        if (success) {
            setShowDeleteConfirm(false);
            // Note deleted, list will update via store
        }
    };

    // Calculate word count
    const wordCount = note.content ? note.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                scale: 1.02
            }}
            className="w-full"
        >
            <Card className="w-full h-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 border border-gray-200 dark:border-gray-700 hover:border-gradient-to-r hover:from-blue-400 hover:to-purple-400 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl relative">
                {new Date(note.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && !viewedNotes.includes(note._id) && (
                    <Badge variant="destructive" className="absolute top-2 left-2 text-xs z-10">
                        <Sparkles className="h-3 w-3 mr-1" />
                        New
                    </Badge>
                )}
                <CardHeader className="pb-3 relative">
                    <div className="absolute top-4 right-4">
                        <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 pr-8">
                        {note.title || "Untitled Note"}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(note.createdAt).toLocaleDateString()}
                        <span className="mx-2">•</span>
                        <Hash className="w-4 h-4" />
                        {wordCount} words
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col justify-between h-full">
                    <div className="text-sm line-clamp-4 text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: note.content || "No content" }} />
                    <div className="flex gap-2 mt-auto flex-wrap">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" onClick={handleView} className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
                                <Eye className="w-4 h-4" />
                                View
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" onClick={handleEdit} className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 hover:border-green-400 transition-colors cursor-pointer">
                                <Edit className="w-4 h-4" />
                                Edit
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="destructive" size="sm" onClick={handleDeleteClick} className="flex items-center gap-2 hover:bg-red-600 border-red-200 hover:border-red-400 transition-colors cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </Button>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>

            {/* Modern Delete Confirmation Dialog */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                        <DialogContent className="max-w-md bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-950 shadow-2xl border-0 p-0 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <DialogHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-t-lg relative">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-full">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold">Delete Note</DialogTitle>
                                            <DialogDescription className="text-red-100 mt-1">
                                                This action cannot be undone.
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="p-6">
                                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                                        Are you sure you want to permanently delete <strong>&quot;{note.title || 'this note'}&quot;</strong>?
                                        This will remove all its content and cannot be recovered.
                                    </p>
                                    <div className="flex gap-3 justify-end">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="destructive"
                                                onClick={handleConfirmDelete}
                                                disabled={isDeleting}
                                                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 cursor-pointer"
                                            >
                                                {isDeleting ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete Forever
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

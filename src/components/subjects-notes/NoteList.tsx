"use client";

import { motion } from "framer-motion";
import { SubjectNote } from "@/types/types.subjectnote";
import { Skeleton } from "@/components/ui/skeleton";

import NoteListHeader from "./NoteListHeader";
import NoteSearchControls from "./NoteSearchControls";
import NoteEmptyState from "./NoteEmptyState";
import NotePaginationControls from "./NotePaginationControls";
import { NoteCard } from "./NoteCard";
import { NoteEditor } from "./NoteEditor";
import { NoteViewDialog } from "./NoteViewDialog";
import { useNoteHandlers } from "@/hooks/useNoteHandlers";

interface NoteListProps {
    subjectId: string;
}

export function NoteList({ subjectId }: NoteListProps) {
    const {
        loadingNotes,
        filteredAndSortedNotes,
        isEditorOpen,
        setIsEditorOpen,
        isViewOpen,
        setIsViewOpen,
        selectedViewNote,
        searchQuery,
        setSearchQuery,
        sortOrder,
        setSortOrder,
        currentPage,
        totalPages,
        setCurrentPage,
        viewedNotes,
        handleCreateNew,
        handleEdit,
        handleView,
        handleCloseEditor,
        handleCloseView
    } = useNoteHandlers({ subjectId });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    if (loadingNotes) {
        return (
            <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="flex flex-col gap-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex justify-between items-center">
                        <motion.h2
                            className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-10 h-10 bg-blue-600 rounded-full animate-pulse" />
                            Notes
                        </motion.h2>
                        <Skeleton className="h-12 w-36" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </motion.div>
                <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {Array.from({ length: 6 }).map((_, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2 mb-4" />
                                <Skeleton className="h-20 w-full mb-4" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 w-16" />
                                    <Skeleton className="h-9 w-16" />
                                    <Skeleton className="h-9 w-16" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        );
    }

    return (
        <>
            <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <NoteListHeader
                    noteCount={filteredAndSortedNotes.length}
                    onCreateNew={handleCreateNew}
                />

                <NoteSearchControls
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />

                {filteredAndSortedNotes.length === 0 ? (
                    <NoteEmptyState
                        searchQuery={searchQuery}
                        onCreateNew={handleCreateNew}
                    />
                ) : (
                    <motion.div
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredAndSortedNotes.map((note, index) => (
                            <motion.div key={note._id} variants={itemVariants}>
                                <NoteCard
                                    note={note}
                                    subjectId={subjectId}
                                    viewedNotes={viewedNotes}
                                    onEdit={() => handleEdit(note)}
                                    onView={() => handleView(note)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {totalPages > 1 && (
                    <NotePaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </motion.div>

            <NoteEditor
                subjectId={subjectId}
                isOpen={isEditorOpen}
                onClose={handleCloseEditor}
            />

            <NoteViewDialog
                isOpen={isViewOpen}
                onClose={handleCloseView}
                note={selectedViewNote}
            />
        </>
    );
}

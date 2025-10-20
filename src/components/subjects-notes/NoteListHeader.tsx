"use client";

import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface NoteListHeaderProps {
    noteCount: number;
    onCreateNew: () => void;
}

export default function NoteListHeader({ noteCount, onCreateNew }: NoteListHeaderProps) {
    return (
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
                    <BookOpen className="w-10 h-10 text-blue-600" />
                    Notes
                    <span className="text-sm font-normal text-muted-foreground bg-white/50 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                        {noteCount} {noteCount === 1 ? 'note' : 'notes'}
                    </span>
                </motion.h2>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={onCreateNew}
                        className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Note
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}

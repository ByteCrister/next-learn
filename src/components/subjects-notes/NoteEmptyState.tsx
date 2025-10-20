"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

interface NoteEmptyStateProps {
    searchQuery: string;
    onCreateNew: () => void;
}

export default function NoteEmptyState({ searchQuery, onCreateNew }: NoteEmptyStateProps) {
    return (
        <div
            className="text-center py-16 text-muted-foreground bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"
            role="alert"
        >
            <BookOpen className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-semibold mb-3">No notes found</h3>
            <p className="mb-6 max-w-md mx-auto">
                {searchQuery ? `No notes match "${searchQuery}". Try a different search term.` : "Create your first note to start organizing your study materials."}
            </p>
            {!searchQuery && (
                <Button
                    onClick={onCreateNew}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Note
                </Button>
            )}
        </div>
    );
}

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc } from "lucide-react";

interface NoteSearchControlsProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (order: 'asc' | 'desc') => void;
}

export default function NoteSearchControls({
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder
}: NoteSearchControlsProps) {
    return (
        <div className="flex gap-4 items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 focus:border-blue-500 transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                />
            </div>
            <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
            >
                {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </Button>
        </div>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NotePaginationControlsProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

export default function NotePaginationControls({
    currentPage,
    totalPages,
    setCurrentPage
}: NotePaginationControlsProps) {
    if (totalPages <= 1) return null;

    return (
        <div
            className="flex justify-center items-center gap-6 mt-10 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
            role="navigation"
            aria-label="Note pagination"
        >
            <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-5 h-5" />
                Previous
            </Button>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Page</span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-semibold">
                    {currentPage} of {totalPages}
                </span>
            </div>
            <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
                aria-label="Next page"
            >
                Next
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    );
}

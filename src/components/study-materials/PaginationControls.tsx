"use client";

import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

export default function PaginationControls({ currentPage, totalPages, setCurrentPage }: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </Button>
            ))}
            <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>
    );
}

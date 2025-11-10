"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ExternalLinkPaginationControlsProps {
    currentPage: number;
    totalPages: number;
    getPageNumbers: () => (number | string)[];
    setCurrentPage: (page: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buttonVariants: any;
}

export default function ExternalLinkPaginationControls({
    currentPage,
    totalPages,
    getPageNumbers,
    setCurrentPage,
    buttonVariants
}: ExternalLinkPaginationControlsProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                    variant="outline"
                    className="cursor-pointer px-4 py-2"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
            </motion.div>
            {getPageNumbers().map((page, index) => (
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                        ...
                    </span>
                ) : (
                    <motion.div key={page} variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                            variant={page === currentPage ? "default" : "outline"}
                            className="cursor-pointer px-4 py-2 min-w-[40px]"
                            onClick={() => setCurrentPage(page as number)}
                        >
                            {page}
                        </Button>
                    </motion.div>
                )
            ))}
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                    variant="outline"
                    className="cursor-pointer px-4 py-2"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </motion.div>
        </div>
    );
}

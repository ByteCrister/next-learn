// components/batches/BatchGrid.tsx
"use client";

import React from "react";
import { GridSkeleton, CardSkeleton } from "./Skeletons";
import { motion, AnimatePresence } from "framer-motion";
import type { Batch } from "@/types/types.batch";
import PaginationBar from "./PaginationBar";
import { useBatchesStore } from "@/store/useBatchesStore";
import BatchCard from "./BatchCard";

export default function BatchGrid({
    batches,
    loading,
}: {
    batches: Batch[];
    loading: boolean;
}) {
    const { page, pageSize, setPage } = useBatchesStore();

    if (loading) {
        return (
            <div>
                <GridSkeleton />
            </div>
        );
    }

    if (!batches || batches.length === 0) {
        return (
            <div className="rounded-md p-8 bg-card text-center">
                <h4 className="text-lg font-semibold">No batches yet</h4>
                <p className="text-sm text-muted-foreground mt-2">
                    Create a new batch to get started.
                </p>
            </div>
        );
    }

    // simple client-side pagination of the fetched list (store fetch returns all)
    const start = (page - 1) * pageSize;
    const pageItems = batches.slice(start, start + pageSize);
    const pageCount = Math.max(1, Math.ceil(batches.length / pageSize));

    return (
        <>
            <AnimatePresence>
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {pageItems.map((b) => (
                        <BatchCard key={b._id} batch={b} />
                    ))}
                </motion.div>
            </AnimatePresence>

            <div className="mt-6">
                <PaginationBar
                    page={page}
                    pageCount={pageCount}
                    onPageChange={(n) => setPage(n)}
                />
            </div>
        </>
    );
}

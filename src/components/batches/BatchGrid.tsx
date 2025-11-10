"use client";

import React from "react";
import { GridSkeleton } from "./Skeletons";
import { motion, AnimatePresence } from "framer-motion";
import type { Batch } from "@/types/types.batch";
import PaginationBar from "./PaginationBar";
import BatchCard from "./BatchCard";

export default function BatchGrid({
  batches,
  loading,
  page,
  pageCount,
  onPageChange,
  totalCount,
}: {
  batches: Batch[]; // already paginated items
  loading: boolean;
  page: number;
  pageCount: number;
  onPageChange: (n: number) => void;
  totalCount?: number; // optional, for showing summary if needed
}) {
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
        <p className="text-sm text-muted-foreground mt-2">Create a new batch to get started.</p>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((b) => (
            <BatchCard key={b._id} batch={b} />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-4">
        <div className="text-sm text-slate-500">
          {totalCount !== undefined ? `${totalCount} result${totalCount === 1 ? "" : "s"}` : null}
        </div>
        <div className="ml-auto">
          <PaginationBar page={page} pageCount={pageCount} onPageChange={(n) => onPageChange(n)} />
        </div>
      </div>
    </>
  );
}

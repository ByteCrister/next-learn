// components/batches/Skeletons.tsx
"use client";

import React from "react";

export function CardSkeleton() {
    return (
        <div className="animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 h-36">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/5" />
            <div className="mt-3 h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-2/5" />
            <div className="mt-5 flex gap-3">
                <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
                <div className="h-8 w-12 bg-zinc-200 dark:bg-zinc-700 rounded" />
            </div>
        </div>
    );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

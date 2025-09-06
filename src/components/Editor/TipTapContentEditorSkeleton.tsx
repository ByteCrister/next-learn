"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TipTapContentEditorSkeleton() {
    return (
        <div className="space-y-3">
            {/* Toolbar Skeleton */}
            <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 mb-3 p-2 rounded-xl shadow-sm overflow-x-auto flex gap-2">
                {Array.from({ length: 14 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-10 w-10 rounded-lg flex-shrink-0"
                    />
                ))}
            </div>

            {/* Editor Content Skeleton */}
            <Skeleton className="min-h-[250px] w-full rounded-md" />
        </div>
    );
}

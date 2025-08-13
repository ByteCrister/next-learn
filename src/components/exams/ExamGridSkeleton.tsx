"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ExamGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                    <Skeleton className="h-5 w-2/3 mb-2 bg-neutral-300" />
                    <Skeleton className="h-4 w-full mb-1 bg-neutral-200" />
                    <Skeleton className="h-4 w-5/6 mb-1 bg-neutral-200" />
                    <div className="flex justify-between items-center mt-3">
                        <Skeleton className="h-5 w-20 bg-neutral-200" />
                        <Skeleton className="h-5 w-12 bg-neutral-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

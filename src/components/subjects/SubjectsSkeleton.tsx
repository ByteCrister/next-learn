"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectsSkeleton() {
    const ITEMS_PER_PAGE = 8;

    return (
        <section className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 lg:p-12">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 rounded-2xl p-4 mb-8 shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="h-12 w-64 rounded-xl" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {[...Array(3)].map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-24 rounded-2xl bg-neutral-300 animate-pulse"
                    />
                ))}
            </div>

            {/* Toolbar Skeleton */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <Skeleton className="h-12 w-full max-w-md bg-neutral-300 rounded-xl" />
                <Skeleton className="h-12 w-full max-w-xs bg-neutral-300 rounded-xl" />
                <Skeleton className="h-12 w-40 rounded-xl bg-neutral-200" />
            </div>

            {/* Subject Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-grow">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-48 rounded-2xl bg-neutral-300 animate-pulse"
                    />
                ))}
            </div>
        </section>
    );
}

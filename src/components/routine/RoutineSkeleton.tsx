'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function RoutineSkeleton() {
    return (
        <div className="mt-6 space-y-3">
            {/* Toolbar skeleton */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Skeleton className="h-10 w-full md:w-[360px] bg-neutral-300 dark:bg-neutral-700" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-[160px] bg-neutral-300 dark:bg-neutral-700" />
                        <Skeleton className="h-10 w-[140px] bg-neutral-300 dark:bg-neutral-700" />
                        <Skeleton className="h-10 w-[130px] bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                </div>
            </div>

            {/* Accordion skeleton items */}
            <div className="rounded-xl border bg-card p-2 shadow-sm">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border-b p-4 last:border-b-0">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-40 bg-neutral-300 dark:bg-neutral-700" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 bg-neutral-300 dark:bg-neutral-700" />
                                <Skeleton className="h-6 w-36 bg-neutral-300 dark:bg-neutral-700" />
                            </div>
                        </div>
                        <div className="mt-3 grid gap-2">
                            <Skeleton className="h-20 w-full bg-neutral-300 dark:bg-neutral-700" />
                        </div>
                    </div>
                ))}
                <div className="flex items-center justify-between p-3">
                    <Skeleton className="h-4 w-24 bg-neutral-300 dark:bg-neutral-700" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-20 bg-neutral-300 dark:bg-neutral-700" />
                        <Skeleton className="h-8 w-20 bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                </div>
            </div>
        </div>
    )
}

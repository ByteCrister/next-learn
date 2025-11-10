import { Skeleton } from "../ui/skeleton"

export default function SkeletonTable() {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm p-3">
            <div className="min-w-[720px]">
                {/* Header */}
                <div className="sticky top-0 z-10 grid grid-cols-[9rem_repeat(5,1fr)] gap-2 bg-gray-50 border-b border-gray-200">
                    <div className="p-2">
                        <Skeleton className="h-4 w-16 rounded-md bg-gray-300 animate-pulse" />
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={`h-${i}`} className="p-2">
                            <Skeleton className="h-4 w-20 rounded-md bg-gray-300 animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Rows */}
                <div className="mt-2 space-y-2">
                    {Array.from({ length: 6 }).map((_, r) => (
                        <div
                            key={`r-${r}`}
                            className="grid grid-cols-[9rem_repeat(5,1fr)] gap-2"
                        >
                            <div className="p-2">
                                <Skeleton className="h-4 w-24 rounded-md bg-gray-300 animate-pulse" />
                            </div>
                            {Array.from({ length: 5 }).map((_, c) => (
                                <div key={`c-${r}-${c}`} className="p-2">
                                    <Skeleton className="h-12 w-full rounded-md bg-gray-200 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

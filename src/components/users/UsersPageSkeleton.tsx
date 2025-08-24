// components/users/UsersPageSkeleton.tsx
"use client";

export function UsersPageSkeleton() {
    return (
        <div className="space-y-6">
            {/* Top bar / header */}
            <div className="h-16 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 border border-gray-300/50 dark:border-white/10 shadow-sm animate-shimmer" />

            {/* Small cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map(i => (
                    <div
                        key={i}
                        className="p-4 rounded-xl border border-gray-300/50 dark:border-white/10 shadow-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 animate-shimmer"
                    >
                        <div className="h-6 w-1/2 rounded bg-gray-300/70 dark:bg-gray-600 mb-3" />
                        <div className="h-4 w-3/4 rounded bg-gray-300/50 dark:bg-gray-600" />
                    </div>
                ))}
            </div>

            {/* Medium cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[0, 1].map(i => (
                    <div
                        key={i}
                        className="p-6 rounded-xl border border-gray-300/50 dark:border-white/10 shadow-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 animate-shimmer"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-full bg-gray-300/70 dark:bg-gray-600" />
                            <div className="flex-1">
                                <div className="h-5 w-1/3 rounded bg-gray-300/70 dark:bg-gray-600 mb-2" />
                                <div className="h-4 w-1/2 rounded bg-gray-300/50 dark:bg-gray-600" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[0, 1, 2, 3].map(j => (
                                <div
                                    key={j}
                                    className="h-4 w-full rounded bg-gray-300/50 dark:bg-gray-600"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Large card */}
            <div className="p-6 rounded-xl border border-gray-300/50 dark:border-white/10 shadow-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 animate-shimmer">
                <div className="h-8 w-1/4 rounded bg-gray-300/70 dark:bg-gray-600 mb-6" />
                <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-4 w-full rounded bg-gray-300/50 dark:bg-gray-600"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}


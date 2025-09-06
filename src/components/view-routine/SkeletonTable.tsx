import { Skeleton } from "../ui/skeleton"

interface SkeletonTableProps {
    headerCount: number
    rowCount: number
}

export default function SkeletonTable({ headerCount, rowCount }: SkeletonTableProps) {
    const style = { '--cols': headerCount } as React.CSSProperties

    return (
        <div className="overflow-x-auto rounded-lg border bg-card p-3">
            <div className="min-w-[720px]">
                <div
                    className="sticky top-0 z-10 grid grid-cols-[9rem_repeat(var(--cols),1fr)] gap-2"
                    style={style}
                >
                    <div className="bg-card/95 p-2">
                        <Skeleton className="h-4 w-16" />
                    </div>
                    {Array.from({ length: headerCount }).map((_, i) => (
                        <div key={`h-${i}`} className="p-2">
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>

                <div className="mt-2 space-y-2">
                    {Array.from({ length: rowCount }).map((_, r) => (
                        <div
                            key={`r-${r}`}
                            className="grid grid-cols-[9rem_repeat(var(--cols),1fr)] gap-2"
                            style={style}
                        >
                            <div className="p-2">
                                <Skeleton className="h-4 w-24" />
                            </div>
                            {Array.from({ length: headerCount }).map((_, c) => (
                                <div key={`c-${r}-${c}`} className="p-2">
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

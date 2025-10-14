"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ExamDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 bg-neutral-200" />
          <Skeleton className="h-4 w-48 bg-neutral-200" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 bg-neutral-300" />
          <Skeleton className="h-9 w-28 bg-neutral-200" />
          <Skeleton className="h-9 w-24 bg-neutral-300" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-md border p-4 space-y-3">
              <Skeleton className="h-5 w-24 bg-neutral-300" />
              <Skeleton className="h-4 w-full bg-neutral-300" />
              <Skeleton className="h-4 w-5/6 bg-neutral-200" />
              <Skeleton className="h-4 w-2/3 bg-neutral-200" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full bg-neutral-200" />
          ))}
        </div>
      </div>
      <div className="rounded-lg border p-4 space-y-3">
        <Skeleton className="h-5 w-40 bg-neutral-300" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full bg-neutral-200" />
        ))}
      </div>
    </div>
  );
}

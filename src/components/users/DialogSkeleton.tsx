"use client";

export function DialogSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-48 bg-gray-200 rounded-md" />
        <div className="h-4 w-64 bg-gray-200 rounded-md" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 border border-gray-200 rounded-xl h-24 flex flex-col justify-center p-4">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-16 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";

/** A small reusable skeleton used to indicate a loading section.
 *  Use Tailwind animate-pulse and simple rectangles to match page layout.
 */
export default function SectionSkeleton({ lines = 4 }: { lines?: number }) {
  const rows = Array.from({ length: Math.max(1, lines) }, (_, i) => i);
  return (
    <div className="space-y-3">
      <div className="h-3 w-36 bg-slate-200 animate-pulse rounded" />
      <div className="space-y-2">
        {rows.map((r) => (
          <SkeletonRow key={r} />
        ))}
      </div>
    </div>
  );
}

function SkeletonRow() {
  // randomized widths give better perceived loading
  const widths = ["w-full", "w-5/6", "w-3/4", "w-2/3", "w-1/2"];
  const idx = Math.floor(Math.random() * widths.length);
  return <div className={`h-3 ${widths[idx]} bg-slate-200 animate-pulse rounded`} />;
}

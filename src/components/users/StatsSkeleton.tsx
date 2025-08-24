// components/users/skeletons/StatsSkeleton.tsx
"use client";

export function StatsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0,1,2].map(i => <div key={i} className="h-28 rounded-xl bg-white/[0.04] border border-white/10" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-80 rounded-xl bg-white/[0.04] border border-white/10" />
        <div className="h-80 rounded-xl bg-white/[0.04] border border-white/10" />
      </div>
    </div>
  );
}

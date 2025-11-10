// components/users/skeletons/UsersTableSkeleton.tsx
"use client";

export function UsersTableSkeleton() {
    return (
        <div className="rounded-xl border border-white/10 overflow-hidden">
            <div className="h-12 bg-white/[0.04]" />
            {[...Array(8)].map((_, i) => (
                <div key={i} className="h-14 border-t border-white/10 bg-white/[0.02]" />
            ))}
            <div className="h-12 border-t border-white/10 bg-white/[0.04]" />
        </div>
    );
}

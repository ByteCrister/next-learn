// components/batches/PaginationBar.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type Props = { page: number; pageCount: number; onPageChange: (n: number) => void };

export default function PaginationBar({ page, pageCount, onPageChange }: Props) {
    // windowed pages: current ±2
    const delta = 2;
    const start = Math.max(1, page - delta);
    const end = Math.min(pageCount, page + delta);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
                Prev
            </Button>

            <div className="flex items-center gap-1">
                {start > 1 && (
                    <>
                        <Button size="sm" variant="ghost" onClick={() => onPageChange(1)}>1</Button>
                        {start > 2 && <span className="px-2">…</span>}
                    </>
                )}

                {pages.map((p) => (
                    <Button key={p} size="sm" variant={p === page ? "secondary" : "ghost"} onClick={() => onPageChange(p)}>
                        {p}
                    </Button>
                ))}

                {end < pageCount && (
                    <>
                        {end < pageCount - 1 && <span className="px-2">…</span>}
                        <Button size="sm" variant="ghost" onClick={() => onPageChange(pageCount)}>{pageCount}</Button>
                    </>
                )}
            </div>

            <Button variant="ghost" size="sm" onClick={() => onPageChange(Math.min(pageCount, page + 1))} disabled={page >= pageCount}>
                Next
            </Button>
        </div>
    );
}

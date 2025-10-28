// components/batches/PaginationBar.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
    page: number;
    pageCount: number;
    onPageChange: (n: number) => void;
};

export default function PaginationBar({ page, pageCount, onPageChange }: Props) {
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
                Prev
            </Button>

            <div className="flex items-center gap-1">
                {pages.map((p) => (
                    <Button
                        key={p}
                        size="sm"
                        variant={p === page ? "secondary" : "ghost"}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </Button>
                ))}
            </div>

            <Button variant="ghost" size="sm" onClick={() => onPageChange(Math.min(pageCount, page + 1))} disabled={page >= pageCount}>
                Next
            </Button>
        </div>
    );
}

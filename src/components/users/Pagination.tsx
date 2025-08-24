// components/users/Pagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import clsx from "clsx";
import { useUsersStore } from "@/store/useUsersStore";

export function Pagination() {
    const { pagination, fetchUsers, limit, setLimit } = useUsersStore();
    const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / (pagination.limit || limit || 10)));

    const go = (page: number) => {
        if (page < 1 || page > totalPages) return;
        fetchUsers(page);
    };

    return (
        <div className="flex items-center justify-between p-3 border-t border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Rows per page</span>
                <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                    <SelectTrigger className="w-[90px] bg-white/5 border-white/10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-neutral-900/80">
                        {[10, 20, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => go(pagination.page - 1)} disabled={pagination.page <= 1}
                    className={clsx("hover:bg-white/10", pagination.page <= 1 && "opacity-40")}>
                    <HiChevronLeft className="h-5 w-5" />
                </Button>
                <div className="text-sm text-white/70">
                    Page {pagination.page} of {totalPages}
                </div>
                <Button variant="ghost" size="icon" onClick={() => go(pagination.page + 1)} disabled={pagination.page >= totalPages}
                    className={clsx("hover:bg-white/10", pagination.page >= totalPages && "opacity-40")}>
                    <HiChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

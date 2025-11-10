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
        <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-white">
            {/* Rows per page */}
            <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Rows per page</span>
                <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                    <SelectTrigger className="w-[90px] bg-white border border-gray-300">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-white border border-gray-300">
                        {[10, 20, 50, 100].map((n) => (
                            <SelectItem key={n} value={String(n)} className="text-gray-700">{n}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => go(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className={clsx(
                        "hover:bg-gray-100",
                        pagination.page <= 1 && "opacity-40"
                    )}
                >
                    <HiChevronLeft className="h-5 w-5 text-gray-700" />
                </Button>
                <div className="text-sm text-gray-700">
                    Page {pagination.page} of {totalPages}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => go(pagination.page + 1)}
                    disabled={pagination.page >= totalPages}
                    className={clsx(
                        "hover:bg-gray-100",
                        pagination.page >= totalPages && "opacity-40"
                    )}
                >
                    <HiChevronRight className="h-5 w-5 text-gray-700" />
                </Button>
            </div>
        </div>
    );
}

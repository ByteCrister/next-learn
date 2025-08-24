// app/(dashboard)/admin/users/page.tsx
"use client";

import { useEffect } from "react";
import { FiltersBar } from "@/components/users/FiltersBar";
import { StatsCards } from "@/components/users/StatsCards";
import { ChartsPanel } from "@/components/users/ChartsPanel";
import { UsersTable } from "@/components/users/UsersTable";
import { useUsersStore } from "@/store/useUsersStore";
import { UsersPageSkeleton } from "./UsersPageSkeleton";

export default function UsersPage() {
    const { fetchUsers, fetchAggregates, listState, aggregatesState } = useUsersStore();

    useEffect(() => {
        fetchUsers(1);
        fetchAggregates();
    }, [fetchUsers, fetchAggregates]);

    const loading = listState.loading && aggregatesState.loading;

    return (
        <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    {/* Stunning Header */}
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                        Users
                    </h1>

                    {/* More engaging paragraph */}
                    <p className="mt-2 text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                        Manage accounts, analyze growth, and control registrations.
                    </p>
                </div>
            </div>

            <FiltersBar />

            {loading ? (
                <UsersPageSkeleton />
            ) : (
                <>
                    <StatsCards />
                    <ChartsPanel />
                    <UsersTable />
                </>
            )}
        </div>
    );
}

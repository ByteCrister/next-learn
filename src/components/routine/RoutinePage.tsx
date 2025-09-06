"use client";

import { useEffect, useMemo, useState } from "react";
import { RoutineResponseDto } from "@/types/types.routine";
import { useRoutineStore } from "@/store/useRoutineStore";
import { sortRoutines } from "@/utils/helpers/routineSorting";
import { paginate } from "@/utils/helpers/routinePagination";
import RoutineToolbar from "./RoutineToolbar";
import RoutineSkeleton from "./RoutineSkeleton";
import RoutineList from "./RoutineList";
import RoutineFormModal from "./RoutineFormModal";
import { useRoutineSearch } from "@/hooks/useRoutineSearch";
import { FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";

type SortKey = "name" | "createdAt" | "updatedAt";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 8;

export default function RoutinePage() {
    const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [page, setPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<RoutineResponseDto | null>(null);

    const { fetchRoutines, routines, isFetching, isMutating, error } = useRoutineStore();
    const { query, results, onSearch } = useRoutineSearch({ routines });

    const { setBreadcrumbs } = useBreadcrumbStore();


    useEffect(() => {
        fetchRoutines(true);
        setBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Routines', href: '/routines' },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setBreadcrumbs]);

    const sorted = useMemo(() => {
        return sortRoutines(results, sortKey, sortDir);
    }, [results, sortKey, sortDir]);

    const { items, totalPages } = useMemo(() => {
        return paginate(sorted, page, PAGE_SIZE);
    }, [sorted, page]);

    useEffect(() => {
        setPage(1);
    }, [query, sortKey, sortDir]);

    const onAddNew = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const onEdit = (r: RoutineResponseDto) => {
        setEditing(r);
        setModalOpen(true);
    };

    return (
        <section className="mx-auto max-w-6xl p-6">
            <motion.h1
                className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Routines
            </motion.h1>
            <p className="text-sm text-muted-foreground mt-2">
                <span className="font-medium text-primary">Plan smart,</span> stay
                consistent — organize, sort, and track your daily class schedules.
            </p>

            <RoutineToolbar
                query={query}
                onQuery={onSearch}
                sortKey={sortKey}
                sortDir={sortDir}
                onSortKey={setSortKey}
                onSortDir={setSortDir}
                onAddNew={onAddNew}
                isMutating={isMutating}
            />

            {isFetching ? (
                <RoutineSkeleton />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <RoutineList
                        items={items}
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                        onEdit={onEdit}
                    />
                </motion.div>
            )}

            <RoutineFormModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                editing={editing}
            />

            {error ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-destructive text-sm"
                >
                    <FiAlertTriangle className="shrink-0" />
                    {error}
                </motion.div>
            ) : null}
        </section>
    );
}

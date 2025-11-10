"use client";

import { useEffect, useMemo, useState } from "react";
import { RoutineResponseDto } from "@/types/types.routine";
import { useRoutineStore } from "@/store/useRoutineStore";
import { sortRoutines } from "@/utils/helpers/routineSorting";
import { paginate } from "@/utils/helpers/routinePagination";
import RoutineToolbar from "./RoutineToolbar";
import RoutineSkeleton from "./RoutineSkeleton";
import RoutineList from "./RoutineList";
import { useRoutineSearch } from "@/hooks/useRoutineSearch";
import { FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import { useRouter, useSearchParams } from "next/navigation";
import { decodeId, encodeId } from "@/utils/helpers/IdConversion";

type SortKey = "name" | "createdAt" | "updatedAt" | "searched";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 8;

export default function RoutinePage() {
    // Searching parameters
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchedParam = searchParams?.get("searched") ?? null;
    const [searchedId, setSearchedId] = useState<string | null>(null);

    const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [page, setPage] = useState(1);

    const { fetchRoutines, routines, isFetching, isMutating, error } = useRoutineStore();
    const { query, results, onSearch } = useRoutineSearch({ routines });

    const { setBreadcrumbs } = useBreadcrumbStore();


    useEffect(() => {
        const sid = searchedParam ?? null;
        if (sid)
            setSearchedId(decodeId(decodeURIComponent(sid)));

        // if there is a searchedId, fetch prioritizing it
        if (sid) {
            // force fetch and ask API to return searched-first
            fetchRoutines(true, sid);
            // set sortKey to sentinel so client sorting doesn't move the searched item
            setSortKey('searched');
            // keep sortDir as-is or choose a stable default
        } else {
            // no searchedId, normal fetch (use cache if available)
            fetchRoutines(true);
            // restore default sort if it was previously set to 'searched'
            if (sortKey === 'searched') setSortKey('updatedAt');
        }

        setBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Routines', href: '/routines' },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setBreadcrumbs, searchedParam]);


    const sorted = useMemo(() => {
        // When sortKey === 'searched' we should return results as-is, trusting server/store ordering
        if (sortKey === 'searched') return results;
        return sortRoutines(results, sortKey, sortDir);
    }, [results, sortKey, sortDir]);


    const { items, totalPages } = useMemo(() => {
        return paginate(sorted, page, PAGE_SIZE);
    }, [sorted, page]);

    useEffect(() => {
        setPage(1);
    }, [query, sortKey, sortDir]);

    const onAddNew = () => {
        router.push(`/routines/create`);
    };

    const onEdit = (r: RoutineResponseDto) => {
        router.push(`/routines/${encodeId(encodeURIComponent(r.id))}/update`);
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
                        searchedId={searchedId}
                    />
                </motion.div>
            )}

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

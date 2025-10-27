"use client";

import { RoutineResponseDto } from "@/types/types.routine";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    FiChevronLeft,
    FiChevronRight,
    FiCalendar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useRoutineStore } from "@/store/useRoutineStore";
import RoutineAccordionItem from "./RoutineAccordionItem";

type Props = {
    items: RoutineResponseDto[];
    page: number;
    totalPages: number;
    setPage: (p: number) => void;
    onEdit: (r: RoutineResponseDto) => void;
    searchedId?: string | null
};

export default function RoutineList({
    items,
    page,
    totalPages,
    setPage,
    onEdit,
    searchedId = null,
}: Props) {
    const { deleteRoutine, isMutating } = useRoutineStore();

    return (
        <motion.div
            className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/90 to-card/60 shadow-sm backdrop-blur-sm"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Empty State */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
                    <FiCalendar className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm text-muted-foreground">
                        No routines found. <br /> Try adjusting filters or{" "}
                        <span className="font-medium text-primary">create a new one</span>.
                    </p>
                </div>
            ) : (
                <Accordion
                    type="multiple"
                    className="divide-y divide-border/60"
                >
                    {items.map((r) => (
                        <RoutineAccordionItem
                            key={r.id}
                            routine={r}
                            onEdit={() => onEdit(r)}
                            onDelete={() => deleteRoutine(r.id)}
                            isMutating={isMutating}
                            searchedId={searchedId}
                        />
                    ))}
                </Accordion>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                    Page {page} of {totalPages || 1}
                </span>

                <div className="flex items-center gap-2">
                    <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page <= 1}
                            className="gap-1"
                        >
                            <FiChevronLeft /> Prev
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setPage(Math.min(totalPages || 1, page + 1))
                            }
                            disabled={page >= totalPages}
                            className="gap-1"
                        >
                            Next <FiChevronRight />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// components/batches/BatchCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiUsers, FiBookOpen, FiCalendar, FiMoreVertical } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import type { Batch } from "@/types/types.batch";

export default function BatchCard({ batch }: { batch: Batch }) {
    const semesterCount = batch.semesters?.length ?? 0;
    const createdYear = batch.createdAt ? new Date(batch.createdAt).getFullYear() : batch.year ?? "—";

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="bg-card rounded-lg p-4 shadow-sm flex flex-col justify-between"
        >
            <header className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="text-lg font-semibold">{batch.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {batch.program ?? "Program not set"} • {batch.year ?? createdYear}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Semesters</p>
                    <div className="text-lg font-medium flex items-center gap-2 justify-end">
                        <FiBookOpen /> {semesterCount}
                    </div>
                </div>
            </header>

            <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <FiCalendar />
                        <span>{batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiUsers />
                        <span>{/* optional studentCount if present */}— students</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link href={`/batches/${batch._id}`} legacyBehavior>
                        <a>
                            <Button size="sm">Open</Button>
                        </a>
                    </Link>

                    <Button variant="ghost" size="sm" aria-label="more">
                        <FiMoreVertical />
                    </Button>
                </div>
            </div>
        </motion.article>
    );
}

'use client';

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiBookOpen, FiCalendar, FiEdit2, FiArrowRight } from "react-icons/fi";
import { Batch } from "../../types/types.batch";
import { Button } from "../ui/button";
import { encodeId } from "@/utils/helpers/IdConversion";

type Props = {
    batch: Batch;
};

const BatchCard: React.FC<Props> = ({ batch }) => {
    const createdYear = batch.createdAt ? new Date(batch.createdAt).getFullYear() : "—";
    const createdAtLabel = batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : "—";
    const semesterCount = batch.semesters.length;
    const encodedId = encodeURIComponent(encodeId(batch._id));
    
    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -4 }}
            role="group"
            aria-labelledby={`batch-${batch._id}-title`}
            className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 border border-gray-200/60 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300"
        >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500" />

            <div className="relative p-6">
                {/* Header Section */}
                <div className="flex items-start gap-4 mb-5">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-xl group-hover:shadow-indigo-500/30 transition-shadow duration-300">
                            <FiBookOpen size={28} className="text-white" strokeWidth={2} />
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 dark:bg-emerald-400 flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">{semesterCount}</span>
                        </div>
                    </div>

                    {/* Title and Meta */}
                    <div className="flex-1 min-w-0 pt-1">
                        <h3
                            id={`batch-${batch._id}-title`}
                            className="text-lg font-bold text-gray-900 dark:text-white truncate mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                            title={batch.name}
                        >
                            {batch.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            {batch.program && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium">
                                    {batch.program}
                                </span>
                            )}
                            {(batch.year || createdYear) && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                    {batch.year ?? createdYear}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 gap-3 mb-5 pt-4 border-t border-gray-200/60 dark:border-gray-800">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                            <FiBookOpen size={18} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Semesters</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{semesterCount}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                            <FiCalendar size={18} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Created</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{createdAtLabel}</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <Link
                        href={`/batches/${encodedId}`}
                        className="flex-1"
                    >
                        <Button
                            size="lg"
                            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 group/btn"
                        >
                            <span>Open Batch</span>
                            <FiArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </Link>

                    <Link href={`/batches/${encodedId}/update`}>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-11 w-11 inline-flex items-center justify-center rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                        >
                            <FiEdit2 size={18} />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.article>
    );
};

export default BatchCard;
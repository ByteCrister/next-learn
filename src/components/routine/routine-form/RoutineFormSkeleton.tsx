'use client'

import { motion } from 'framer-motion'
import { FiBookOpen, FiType, FiClock, FiMapPin, FiUser, FiChevronRight } from 'react-icons/fi'

export default function RoutineFormSkeleton() {
    return (
        <main className="max-w-4xl mx-auto font-sans antialiased text-slate-800">
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-6">
                {/* Header */}
                <header className="flex items-start gap-4">
                    <div className="rounded-md bg-indigo-50 p-2 flex items-center justify-center">
                        <div className="w-9 h-9 bg-slate-200 animate-pulse rounded" />
                    </div>

                    <div className="flex-1">
                        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
                        <div className="mt-2 h-4 w-64 bg-slate-150 rounded animate-pulse" />
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <div className="h-9 w-20 bg-slate-200 rounded animate-pulse" />
                        <div className="h-9 w-36 bg-indigo-600/80 rounded animate-pulse" />
                    </div>
                </header>

                {/* Preset manager placeholder */}
                <div className="h-10 bg-white border border-slate-100 rounded-lg px-3 flex items-center gap-3 shadow-sm">
                    <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="h-6 w-32 bg-slate-150 rounded animate-pulse" />
                </div>

                {/* Title + Description */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FiBookOpen className="text-slate-400" />
                            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                        </div>
                        <div className="h-10 bg-slate-100 rounded animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FiType className="text-slate-400" />
                            <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                        </div>
                        <div className="h-10 bg-slate-100 rounded animate-pulse" />
                    </div>
                </div>

                <div className="border-t" />

                {/* Days & Slots header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
                    </div>

                    <div className="sm:hidden">
                        <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
                    </div>
                </div>

                {/* Days list skeleton (3 sample day cards) */}
                <div className="grid gap-4">
                    {[0, 1, 2].map((i) => (
                        <section key={i} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 font-medium">
                                        <div className="h-6 w-6 bg-slate-200 rounded animate-pulse" />
                                    </div>

                                    <div>
                                        <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                                        <div className="mt-1 h-3 w-20 bg-slate-150 rounded animate-pulse" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-20 bg-slate-100 rounded animate-pulse" />
                                    <div className="h-8 w-28 bg-slate-100 rounded animate-pulse" />
                                </div>
                            </div>

                            {/* Slots */}
                            <div className="space-y-4">
                                {[0, 1].map((s) => (
                                    <div key={s} className="rounded-lg border border-slate-100 p-4 bg-slate-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <FiBookOpen className="text-slate-400" /> <span className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
                                                </div>
                                                <div className="mt-2 h-10 bg-slate-100 rounded animate-pulse" />
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <FiUser className="text-slate-400" /> <span className="h-3 w-28 bg-slate-200 rounded animate-pulse" />
                                                </div>
                                                <div className="mt-2 h-10 bg-slate-100 rounded animate-pulse" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                            <div>
                                                <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <FiClock className="text-slate-400" /> <span className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                                                </div>
                                                <div className="mt-2 h-10 bg-slate-100 rounded animate-pulse" />
                                            </div>

                                            <div>
                                                <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <FiClock className="text-slate-400" /> <span className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                                                </div>
                                                <div className="mt-2 h-10 bg-slate-100 rounded animate-pulse" />
                                            </div>

                                            <div>
                                                <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <FiMapPin className="text-slate-400" /> <span className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                                                </div>
                                                <div className="mt-2 h-10 bg-slate-100 rounded animate-pulse" />
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-3">
                                            <div className="h-8 w-28 bg-slate-200 rounded animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Bottom action area */}
                <div className="mx-auto max-w-4xl px-4">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/80 backdrop-blur-md border border-slate-100 rounded-lg px-4 py-3 shadow-lg">
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 min-w-0">
                            <div className="flex shrink-0 items-center gap-3">
                                <div className="h-9 w-24 bg-slate-100 rounded animate-pulse" />
                                <div className="h-9 w-32 bg-slate-100 rounded animate-pulse" />
                            </div>

                            <div className="mt-1 text-sm text-slate-500 sm:mt-0 sm:ml-2 truncate">
                                <div className="h-4 w-40 bg-slate-150 rounded animate-pulse" />
                            </div>
                        </div>

                        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end min-w-0">
                            <div className="hidden sm:flex items-center gap-3 text-sm text-slate-500 mr-2 whitespace-nowrap">
                                <div className="h-4 w-20 bg-slate-150 rounded animate-pulse" />
                            </div>

                            <div className="flex w-full gap-3 sm:w-auto sm:gap-3 items-center min-w-0">
                                <div className="w-full sm:w-auto min-w-0">
                                    <div className="flex w-full items-center justify-center gap-2 bg-indigo-600/80 text-white px-4 py-2 rounded">
                                        <FiChevronRight />
                                        <div className="h-4 w-32 bg-slate-100/20 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    )
}

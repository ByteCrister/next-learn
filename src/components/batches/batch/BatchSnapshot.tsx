"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
    FiUser,
    FiBook,
    FiClipboard,
    FiTrash2,
    FiEdit,
    FiStar,
    FiLayers,
    FiCheckSquare,
    FiAward,
    FiTrendingUp,
    FiCalendar,
} from "react-icons/fi";

import { useBatchesStore } from "@/store/useBatchesStore";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import DeleteBatchAlert from "./DeleteBatchAlert";
import { encodeId } from "@/utils/helpers/IdConversion";
import BatchSnapshotSkeleton from "./BatchSnapshotSkeleton";
import useBatchSnapshot from "@/hooks/useBatchSnapshot";
import { exportBatchPdf } from "./exportBatchPdf";

type StudentMeta = { name?: string; roll?: string } | undefined;

type Props = {
    batchId: string;
    studentId: string;
    studentLookup?: Record<string, StudentMeta>;
};

const heroVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    },
};

const listStagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    },
};


export default function BatchSnapshot({ batchId, studentId, studentLookup }: Props) {
    const router = useRouter();
    const { fetchBatchById, deleteBatch, currentBatch, loading, error } = useBatchesStore();
    const [localError, setLocalError] = useState<string | null>(null);

    const {
        computeBatchForStudent,
        computeSemesterForStudent,
        summarizePartForStudent,
    } = useBatchSnapshot();

    useEffect(() => {
        let mounted = true;
        setLocalError(null);
        fetchBatchById(batchId).catch((err: unknown) => {
            if (!mounted) return;
            setLocalError((err as Error)?.message ?? "Failed to load batch");
        });
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const batch = currentBatch && currentBatch._id === batchId ? currentBatch : null;

    const computed = useMemo(() => {
        if (!batch) return null;
        return computeBatchForStudent(batch, studentId);
    }, [batch, computeBatchForStudent, studentId]);

    if (loading && !batch) {
        return <BatchSnapshotSkeleton />;
    }

    if (localError || (!batch && !loading)) {
        return (
            <div className="py-12 px-6 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card className="border-red-200 bg-red-50/50">
                        <CardHeader>
                            <CardTitle className="text-red-900">Unable to load batch</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-red-700">{localError ?? (error?.message ?? "Could not fetch batch details.")}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (!batch || !computed) return null;

    async function handleDeleteConfirmed() {
        try {
            await deleteBatch({ _id: batch?._id ?? "" });
            router.push('/batches');
        } catch (err) {
            setLocalError((err as Error)?.message ?? "Failed to delete batch");
        }
    }

    function getStudentLabel(sid: string, index: number) {
        if (studentLookup && studentLookup[sid]) {
            const meta = studentLookup[sid];
            if (meta?.name) return meta.name;
            if (meta?.roll) return `Roll ${meta.roll}`;
        }
        if (typeof sid === "string" && sid.length >= 6) {
            return `S-${sid.slice(-6)}`;
        }
        return `Student #${index + 1}`;
    }

    const studentLabel = getStudentLabel(studentId, 0);

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            {/* Hero Section */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={heroVariants}
                className="max-w-7xl mx-auto"
            >
                <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50">
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.08),transparent_50%)]" />
                    </div>

                    <div className="relative z-10 px-6 sm:px-8 py-10">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex-1">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                                        <FiAward className="mr-1.5 h-3.5 w-3.5" />
                                        Student Performance
                                    </Badge>
                                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
                                        {batch.name}
                                    </h1>
                                    <p className="text-xl text-blue-200 font-medium mb-4">
                                        {studentLabel}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 text-sm">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                                            <FiBook className="text-blue-300" />
                                            <span className="text-slate-200">{batch.program ?? "Program not specified"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                                            <FiCalendar className="text-blue-300" />
                                            <span className="text-slate-200">{batch.year ?? "Year unknown"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                                            <FiLayers className="text-blue-300" />
                                            <span className="text-slate-200">{batch.semesters?.length ?? 0} Semesters</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="mt-6 flex flex-wrap gap-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-medium shadow-lg hover:shadow-xl transition-shadow"
                                        onClick={() => router.push(`/batches/${encodeId(encodeURIComponent(batch._id))}/update`)}
                                    >
                                        <FiEdit className="text-slate-700" />
                                        <span>Edit Batch</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors"
                                        onClick={() => exportBatchPdf({ batch, computed, studentLabel, studentId })}
                                    >
                                        <FiClipboard />
                                        <span>Export Data</span>
                                    </motion.button>

                                    <DeleteBatchAlert onConfirm={handleDeleteConfirmed} batchName={batch.name}>
                                        <motion.button
                                            whileHover={{ scale: 1.03, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium shadow-lg hover:bg-red-700 transition-colors"
                                        >
                                            <FiTrash2 />
                                            <span>Delete</span>
                                        </motion.button>
                                    </DeleteBatchAlert>
                                </motion.div>
                            </div>

                            {/* CGPA Display */}
                            <motion.div
                                className="w-full lg:w-auto"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
                                        <div className="relative rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl border border-white/20">
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-blue-100 mb-1">Batch CGPA</div>
                                                <div className="text-5xl font-bold text-white mb-1">{computed.batchCgpa.toFixed(2)}</div>
                                                <div className="text-xs text-blue-200">out of 4.00</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl p-5 bg-white/10 backdrop-blur-sm border border-white/20">
                                        <div className="text-xs text-slate-300 mb-1">Total Courses</div>
                                        <div className="text-3xl font-bold text-white">
                                            {batch.semesters?.reduce((acc, s) => acc + (s.courses?.length ?? 0), 0) ?? 0}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar */}
                <motion.div
                    variants={listStagger}
                    initial="hidden"
                    animate="show"
                    className="space-y-5 lg:col-span-1"
                >
                    {/* Student Summary Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="relative z-10 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
                            <CardHeader className="relative">
                                <CardTitle>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                                            <FiUser className="h-5 w-5" />
                                        </div>
                                        <span className="text-slate-900">Student Summary</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="text-sm font-medium text-slate-600">Name</div>
                                    <div className="text-base font-semibold text-slate-900">{studentLabel}</div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                                    <div className="text-sm font-medium text-slate-600">Batch CGPA</div>
                                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                        {computed.batchCgpa.toFixed(2)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="text-sm font-medium text-slate-600">Semesters</div>
                                    <div className="text-base font-semibold text-slate-900">{batch.semesters?.length ?? 0}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Latest Grades Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
                            <CardHeader className="relative">
                                <CardTitle>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                                            <FiStar className="h-5 w-5" />
                                        </div>
                                        <span className="text-slate-900">Latest Grades</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="relative">
                                {computed.semSummaries.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-xl bg-slate-50 border border-slate-200">
                                            <FiLayers className="text-3xl text-slate-400" />
                                            <div className="text-sm font-medium text-slate-600">No data available</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {computed.semSummaries.slice(-1)[0].computed.partsSummary.map((p, idx) => (
                                            <motion.div
                                                key={p.partId}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                whileHover={{ x: 4 }}
                                                className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white border group-compact-hover"                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl shadow-sm bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{p.courseType}</div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                                            <FiLayers className="h-3 w-3" />
                                                            {p.credits} Credits
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-xs text-slate-500 mb-1">Grade</div>
                                                    <Badge className="text-base font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                                                        {p.grade}
                                                    </Badge>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Right Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Semesters Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-slate-200 shadow-lg">
                            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                                        <FiBook className="h-5 w-5" />
                                    </div>
                                    <span>Semester Details</span>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="pt-6">
                                <Tabs defaultValue={String(batch.semesters?.[0]?.index ?? "1")} className="space-y-6">
                                    <TabsList className="p-1.5 rounded-xl bg-slate-100 border border-slate-200 w-full sm:w-auto">
                                        {(batch.semesters || []).map((s) => (
                                            <TabsTrigger
                                                key={s._id ?? s.index}
                                                value={String(s.index)}
                                                className="text-slate-700 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg transition-all"
                                            >
                                                {s.name}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {(batch.semesters || []).map((s) => {
                                        const semObj = computed.semSummaries.find((sm) => (sm.sem._id ?? sm.sem.index) === (s._id ?? s.index));
                                        const semComputed = semObj?.computed ?? computeSemesterForStudent(s, studentId);

                                        return (
                                            <TabsContent key={s._id ?? s.index} value={String(s.index)} className="space-y-6">
                                                {/* Semester Header */}
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{s.name}</h3>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                                            <div className="flex items-center gap-1.5">
                                                                <FiCalendar className="text-blue-500" />
                                                                <span>{s.startAt ? new Date(s.startAt).toLocaleDateString() : "Start unknown"}</span>
                                                            </div>
                                                            <span className="text-slate-300">→</span>
                                                            <span>{s.endAt ? new Date(s.endAt).toLocaleDateString() : "End unknown"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-center px-4 py-2 rounded-lg bg-white border border-slate-200">
                                                            <div className="text-xs text-slate-500 mb-0.5">Sem CGPA</div>
                                                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                                                {semComputed.semCgpa.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Courses List */}
                                                <div className="space-y-4">
                                                    {(s.courses || []).map((course, courseIdx) => (
                                                        <motion.div
                                                            key={course._id ?? course.courseId ?? course.name}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: courseIdx * 0.1 }}
                                                        >
                                                            <Accordion type="single" collapsible>
                                                                <AccordionItem
                                                                    value={course._id ?? course.courseId ?? course.name ?? ""}
                                                                    className="border border-slate-200 rounded-xl px-1 hover:border-blue-300 transition-colors"
                                                                >
                                                                    <AccordionTrigger className="hover:no-underline px-4 py-4">
                                                                        <div className="flex items-center justify-between w-full pr-4">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                                                                                    <FiBook className="h-5 w-5" />
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    <div className="font-semibold text-slate-900 text-base mb-1">
                                                                                        {course.code ? `${course.code} — ${course.name}` : course.name}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <FiLayers className="h-3.5 w-3.5" />
                                                                                            {(course.parts || []).length} Parts
                                                                                        </span>
                                                                                        <span className="text-slate-300">•</span>
                                                                                        <span className="flex items-center gap-1">
                                                                                            <FiCheckSquare className="h-3.5 w-3.5" />
                                                                                            {(course.parts || []).reduce((acc, p) => acc + (p.credits || 0), 0)} Credits
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </AccordionTrigger>

                                                                    <AccordionContent className="px-4 pb-4">
                                                                        <Separator className="mb-4" />
                                                                        <div className="grid gap-5 md:grid-cols-2">
                                                                            {/* Parts Column */}
                                                                            <div>
                                                                                <h4 className="text-sm font-bold mb-3 text-slate-700 flex items-center gap-2">
                                                                                    <FiLayers className="text-blue-500" />
                                                                                    Course Parts
                                                                                </h4>
                                                                                <div className="space-y-3">
                                                                                    {(course.parts || []).map((p, partIdx) => {
                                                                                        const summary = summarizePartForStudent(p, studentId);
                                                                                        return (
                                                                                            <motion.div
                                                                                                key={p._id ?? `${p.courseType}-${p.credits}`}
                                                                                                initial={{ opacity: 0, x: -10 }}
                                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                                transition={{ delay: partIdx * 0.05 }}
                                                                                            >
                                                                                                <Card className="relative z-10 hover:shadow-md transition-all duration-200 border-slate-200 hover:border-blue-300 overflow-hidden group">
                                                                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0" />
                                                                                                    <CardContent className="p-4 relative">
                                                                                                        <div className="flex items-start justify-between gap-3">
                                                                                                            <div className="flex-1">
                                                                                                                <div className="font-semibold text-slate-900 mb-1">{p.courseType}</div>
                                                                                                                <div className="text-xs text-slate-500 space-y-0.5">
                                                                                                                    <div className="flex items-center gap-1.5">
                                                                                                                        <FiCheckSquare className="h-3 w-3 text-blue-500" />
                                                                                                                        <span>{p.credits} Credits</span>
                                                                                                                    </div>
                                                                                                                    <div className="flex items-center gap-1.5">
                                                                                                                        <FiUser className="h-3 w-3 text-purple-500" />
                                                                                                                        <span>{(p.teachers || []).map((t) => t.name).join(", ") || "No teacher assigned"}</span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            <div className="text-right">
                                                                                                                <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 font-bold">
                                                                                                                    {summary.grade}
                                                                                                                </Badge>
                                                                                                                <div className="text-sm font-bold text-slate-900">
                                                                                                                    {summary.cgpa.toFixed(2)} CGPA
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </CardContent>
                                                                                                </Card>
                                                                                            </motion.div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>

                                                                            {/* Summary Column */}
                                                                            <div>
                                                                                <h4 className="text-sm font-bold mb-3 text-slate-700 flex items-center gap-2">
                                                                                    <FiTrendingUp className="text-green-500" />
                                                                                    Semester Summary
                                                                                </h4>

                                                                                <div className="space-y-3">
                                                                                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
                                                                                        <div className="flex items-center justify-between mb-2">
                                                                                            <div className="text-sm font-medium text-slate-600">Normalized Percent</div>
                                                                                            <FiTrendingUp className="text-emerald-600" />
                                                                                        </div>
                                                                                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                                                                                            {semComputed.normalizedPercent.toFixed(2)}%
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                                                                                        <div className="flex items-center justify-between mb-2">
                                                                                            <div className="text-sm font-medium text-slate-600">Semester CGPA</div>
                                                                                            <FiAward className="text-blue-600" />
                                                                                        </div>
                                                                                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                                                                            {semComputed.semCgpa.toFixed(2)}
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                                                                        <div className="flex items-center justify-between">
                                                                                            <div className="text-sm font-medium text-slate-600">Total Credits</div>
                                                                                            <div className="text-xl font-bold text-slate-900">
                                                                                                {semComputed.totalCredits}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </motion.div>
                                                    ))}

                                                    {(s.courses || []).length === 0 && (
                                                        <div className="py-16 text-center">
                                                            <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200">
                                                                <FiBook className="text-4xl text-slate-400" />
                                                                <div className="text-sm font-medium text-slate-600">No courses in this semester yet</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabsContent>
                                        );
                                    })}
                                </Tabs>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* CGPA Progress Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-slate-200 shadow-lg overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 pointer-events-none z-0" />
                            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                                        <FiTrendingUp className="h-5 w-5" />
                                    </div>
                                    <span>CGPA Progress Timeline</span>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {computed.semSummaries.map((s, idx) => {
                                        const isRecent = idx >= computed.semSummaries.length - 3;
                                        const cgpa = s.computed.semCgpa;
                                        const percentage = (cgpa / 4.0) * 100;

                                        return (
                                            <motion.div
                                                key={s.sem._id ?? s.sem.index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                whileHover={{ scale: 1.02, x: 8 }}
                                                className="relative"
                                            >
                                                <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${isRecent
                                                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                                    }`}>
                                                    <div className="relative">
                                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold shadow-lg ${isRecent
                                                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                                            : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700'
                                                            }`}>
                                                            {idx + 1}
                                                        </div>
                                                        {isRecent && (
                                                            <div className="absolute -top-1 -right-1">
                                                                <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                                                                    <FiStar className="h-3 w-3 text-white" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <div className="font-semibold text-slate-900 text-base">{s.sem.name}</div>
                                                                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                                                    <FiCheckSquare className="h-3 w-3" />
                                                                    {s.computed.totalCredits} Credits
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                                                    {cgpa.toFixed(2)}
                                                                </div>
                                                                <div className="text-xs text-slate-500">CGPA</div>
                                                            </div>
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ scaleX: 0 }}
                                                                animate={{ scaleX: percentage / 100 }}
                                                                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                                                style={{ transformOrigin: 'left' }}
                                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Connector Line */}
                                                {idx < computed.semSummaries.length - 1 && (
                                                    <div className="absolute left-7 top-full w-0.5 h-3 bg-slate-200" />
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {computed.semSummaries.length === 0 && (
                                    <div className="py-16 text-center">
                                        <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200">
                                            <FiTrendingUp className="text-4xl text-slate-400" />
                                            <div className="text-sm font-medium text-slate-600">No semester data available</div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
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
    FiChevronRight,
    FiBarChart2,
} from "react-icons/fi";

import type { Batch, Semester } from "@/types/types.batch";
import { useBatchesStore } from "@/store/useBatchesStore";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import DeleteBatchAlert from "./DeleteBatchAlert";
import { encodeId } from "@/utils/helpers/IdConversion";
import BatchSnapshotSkeleton from "./BatchSnapshotSkeleton";

type StudentMeta = { name?: string; roll?: string } | undefined;

type Props = {
    batchId: string;
    studentLookup?: Record<string, StudentMeta>;
};

/** Compute semester-level per-student aggregated normalized percentage and cgpa */
function computeSemesterCgpa(semester: Semester) {
    type StudentAcc = { totalMarks: number; totalCredits: number };

    const students = new Map<string, StudentAcc>();

    for (const course of semester.courses || []) {
        for (const part of course.parts || []) {
            const credits = part.credits || 0;
            if (!part.studentSummaries) continue;

            for (const s of part.studentSummaries) {
                if (!s?.student) continue;
                const overall = s.overall ?? 0;
                const acc = students.get(s.student) ?? { totalMarks: 0, totalCredits: 0 };
                acc.totalMarks += overall * credits;
                acc.totalCredits += credits;
                students.set(s.student, acc);
            }
        }
    }

    const out: Record<
        string,
        { totalMarks: number; totalCredits: number; normalizedPercentage: number; cgpa: number }
    > = {};
    students.forEach((acc, studentId) => {
        const normalized = acc.totalCredits > 0 ? acc.totalMarks / acc.totalCredits : 0;
        const cgpa = (() => {
            if (normalized >= 80) return 4.0;
            if (normalized >= 60) return 3.0 + (normalized - 60) / 20;
            if (normalized >= 40) return 2.0 + (normalized - 40) / 20;
            return Math.max(0, (normalized / 40) * 2.0);
        })();

        out[studentId] = {
            totalMarks: acc.totalMarks,
            totalCredits: acc.totalCredits,
            normalizedPercentage: Math.round(normalized * 100) / 100,
            cgpa: Math.round(cgpa * 100) / 100,
        };
    });

    return out;
}

/** Compute batch-level CGPA weighted across semesters */
function computeBatchCgpa(batch: Batch) {
    const studentAcc = new Map<string, { sumWeightedCgpa: number; sumCredits: number }>();

    for (const sem of batch.semesters || []) {
        const semCgpaMap = computeSemesterCgpa(sem);

        let semCredits = 0;
        for (const course of sem.courses || []) {
            for (const p of course.parts || []) semCredits += p.credits || 0;
        }
        if (semCredits === 0) semCredits = 1;

        for (const [studentId, info] of Object.entries(semCgpaMap)) {
            const acc = studentAcc.get(studentId) ?? { sumWeightedCgpa: 0, sumCredits: 0 };
            acc.sumWeightedCgpa += info.cgpa * semCredits;
            acc.sumCredits += semCredits;
            studentAcc.set(studentId, acc);
        }
    }

    const out: Record<string, { cgpa: number }> = {};
    studentAcc.forEach((acc, studentId) => {
        out[studentId] = { cgpa: Math.round((acc.sumWeightedCgpa / acc.sumCredits) * 100) / 100 };
    });

    return out;
}

/** Friendly label for a student entry. Falls back to "Student #n" or masked id if no lookup. */
function getStudentLabel(sid: string, index: number, lookup?: Record<string, StudentMeta>) {
    if (lookup && lookup[sid]) {
        const meta = lookup[sid];
        if (meta?.name) return meta.name;
        if (meta?.roll) return `Roll ${meta.roll}`;
    }
    if (typeof sid === "string" && sid.length >= 6) {
        return `S-${sid.slice(-6)}`;
    }
    return `Student #${index + 1}`;
}

/* Animation variants */
const heroVariants: Variants = {
    hidden: { opacity: 0, y: -6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" } },
};

const listStagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: "easeOut" } },
};

export default function BatchSnapshot({ batchId, studentLookup }: Props) {
    const router = useRouter();
    const { fetchBatchById, deleteBatch, currentBatch, loading, error } = useBatchesStore();
    const [localError, setLocalError] = useState<string | null>(null);

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
    }, [batchId]);

    const batch = currentBatch && currentBatch._id === batchId ? currentBatch : null;

    const semCgpaMaps = useMemo(
        () => (batch?.semesters || []).map((sem) => ({ sem, map: computeSemesterCgpa(sem) })),
        [batch]
    );

    const batchCgpaMap = useMemo(() => (batch ? computeBatchCgpa(batch) : {}), [batch]);

    if (loading && !batch) {
        return <BatchSnapshotSkeleton />;
    }

    if (localError || (!batch && !loading)) {
        return (
            <div className="py-12 px-6 max-w-6xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Unable to load batch</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600">{localError ?? (error?.message ?? "Could not fetch batch details.")}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!batch) return null;

    async function handleDeleteConfirmed() {
        try {
            await deleteBatch({ _id: batch?._id ?? "" });
        } catch (err) {
            setLocalError((err as Error)?.message ?? "Failed to delete batch");
        }
    }

    function rankBadgeStyle(rank: number) {
        if (rank === 0) return "bg-neutral-200 text-slate-800 border border-neutral-200";
        if (rank === 1) return "bg-white text-slate-800 border border-slate-200";
        if (rank === 2) return "bg-neutral-100 text-slate-800";
        return "bg-white/50 text-slate-700 border border-slate-100";
    }

    return (
        <div className="min-h-screen py-10 px-6 bg-slate-50">
            <motion.div initial="hidden" animate="show" variants={heroVariants} className="max-w-7xl mx-auto rounded-lg overflow-hidden">
                <div className="relative rounded-lg overflow-hidden shadow-sm bg-white border border-slate-100">
                    <div className="relative px-6 py-7">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900">{batch.name}</h1>
                                <p className="mt-1 text-sm text-slate-500 max-w-xl">
                                    <strong className="font-medium text-slate-800">{batch.program ?? "Program not specified"}</strong>
                                    <span className="mx-2 text-slate-300">•</span>
                                    <span>{batch.year ?? "Year unknown"}</span>
                                </p>

                                <div className="mt-5 flex flex-wrap gap-3 items-center">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-50 text-slate-800 text-sm border border-slate-100 shadow-sm"
                                        aria-hidden
                                    >
                                        <FiUser className="text-slate-600" />
                                        <span>Semesters: <strong className="ml-1">{batch.semesters?.length ?? 0}</strong></span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-slate-800 text-sm border border-slate-100 shadow-sm"
                                        onClick={() => router.push(`/batches/${encodeId(encodeURIComponent(batch._id))}/update`)}
                                    >
                                        <FiEdit className="text-slate-700" /> <span>Edit</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-slate-800 text-sm border border-slate-100 shadow-sm"
                                        onClick={() => navigator.clipboard?.writeText(JSON.stringify(batch))}
                                    >
                                        <FiClipboard className="text-slate-700" /> <span>Export</span>
                                    </motion.button>

                                    <DeleteBatchAlert onConfirm={handleDeleteConfirmed} batchName={batch.name}>
                                        <motion.button whileHover={{ scale: 1.01 }} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white shadow-sm">
                                            <FiTrash2 /> <span>Delete</span>
                                        </motion.button>
                                    </DeleteBatchAlert>
                                </div>
                            </div>

                            <div className="w-full lg:w-auto flex items-center gap-3">
                                <div className="rounded-md p-3 bg-slate-50 border border-slate-100 text-slate-800 shadow-sm">
                                    <div className="text-xs text-slate-500">Total Courses</div>
                                    <div className="text-lg font-semibold">{batch.semesters?.reduce((acc, s) => acc + (s.courses?.length ?? 0), 0) ?? 0}</div>
                                </div>

                                <div className="rounded-md p-3 bg-slate-50 border border-slate-100 text-slate-800 shadow-sm">
                                    <div className="text-xs text-slate-500">Total Credits</div>
                                    <div className="text-lg font-semibold">
                                        {batch.semesters?.reduce((acc, s) => {
                                            return acc + (s.courses || []).reduce((cAcc, course) => cAcc + (course.parts || []).reduce((pAcc, p) => pAcc + (p.credits || 0), 0), 0);
                                        }, 0) ?? 0}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 h-px bg-slate-100" />
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={listStagger} initial="hidden" animate="show" className="space-y-4 lg:col-span-1">
                    <motion.div variants={itemVariants}>
                        <Card className="relative overflow-hidden">
                            <div className="absolute left-0 top-0 h-0.5 w-full bg-slate-100" />
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-3">
                                        <span className="p-2 rounded-md bg-slate-50 text-slate-700 shadow-sm"><FiCheckSquare /></span>
                                        <span>Summary</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-slate-600">Semesters</div>
                                        <div className="text-lg font-semibold">{batch.semesters?.length ?? 0}</div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-slate-600">Total courses</div>
                                        <div className="text-lg font-semibold">{batch.semesters?.reduce((acc, s) => acc + (s.courses?.length ?? 0), 0) ?? 0}</div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-slate-600">Total credits</div>
                                        <div className="text-lg font-semibold">
                                            {batch.semesters?.reduce((acc, s) => {
                                                return acc + (s.courses || []).reduce((cAcc, course) => cAcc + (course.parts || []).reduce((pAcc, p) => pAcc + (p.credits || 0), 0), 0);
                                            }, 0) ?? 0}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="relative overflow-hidden">
                            <div className="absolute left-0 top-0 h-0.5 w-full bg-slate-100" />
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-3">
                                        <span className="p-2 rounded-md bg-slate-50 text-slate-700 shadow-sm"><FiStar /></span>
                                        <span>Top Performers</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {Object.keys(batchCgpaMap).length === 0 ? (
                                    <div className="py-8 text-center">
                                        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-md bg-white/50 border border-slate-100">
                                            <FiLayers className="text-xl text-slate-400" />
                                            <div className="text-sm text-slate-600">No student summaries available</div>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div variants={listStagger} initial="hidden" animate="show" className="space-y-3">
                                        {Object.entries(batchCgpaMap)
                                            .sort((a, b) => b[1].cgpa - a[1].cgpa)
                                            .slice(0, 8)
                                            .map(([sid, v], idx) => (
                                                <motion.div
                                                    key={sid}
                                                    variants={itemVariants}
                                                    className="flex items-center justify-between gap-3 p-3 rounded-md bg-white border border-slate-50 hover:shadow-sm transition"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`${rankBadgeStyle(idx)} w-10 h-10 flex items-center justify-center rounded-md shadow-sm`}>
                                                            <div className="font-medium">{idx + 1}</div>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900">{getStudentLabel(sid, idx, studentLookup)}</div>
                                                            <div className="text-xs text-slate-500">ID {sid.slice(-6)}</div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-sm text-slate-500">CGPA</div>
                                                        <div className="text-lg font-semibold text-slate-900">{v.cgpa.toFixed(2)}</div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                    </motion.div>
                                )}
                            </CardContent>

                            <CardFooter>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                    <FiBarChart2 className="text-slate-400" /> <span>Derived from available StudentSummary data</span>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </motion.div>

                <div className="lg:col-span-2 space-y-4">
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Semesters</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <Tabs defaultValue={String(batch.semesters?.[0]?.index ?? "1")}>
                                    <TabsList className="p-1 rounded-md bg-white border border-slate-100">
                                        {(batch.semesters || []).map((s) => (
                                            <TabsTrigger key={s._id ?? s.index} value={String(s.index)} className="text-slate-700 text-sm">
                                                {s.name}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {(batch.semesters || []).map((s) => {
                                        const semCgpa = semCgpaMaps.find((m) => m.sem._id === s._id)?.map ?? {};

                                        return (
                                            <TabsContent key={s._id ?? s.index} value={String(s.index)}>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-slate-900">{s.name}</h3>
                                                            <p className="text-sm text-slate-500">
                                                                {s.startAt ? new Date(s.startAt).toLocaleDateString() : "Start unknown"} — {s.endAt ? new Date(s.endAt).toLocaleDateString() : "End unknown"}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                                            <FiChevronRight /> <span>Index {s.index}</span>
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div className="space-y-3">
                                                        {(s.courses || []).map((course) => (
                                                            <motion.div key={course._id ?? course.courseId ?? course.name} variants={itemVariants} initial="hidden" animate="show">
                                                                <Accordion type="single" collapsible>
                                                                    <AccordionItem value={course._id ?? course.courseId ?? course.name ?? ""}>
                                                                        <AccordionTrigger>
                                                                            <div className="flex items-center justify-between w-full">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="p-2 rounded-md bg-slate-50 text-slate-700">
                                                                                        <FiBook />
                                                                                    </div>
                                                                                    <div>
                                                                                        <div className="font-medium text-slate-900">{course.code ? `${course.code} — ${course.name}` : course.name}</div>
                                                                                        <div className="text-sm text-slate-500">Parts: {(course.parts || []).length}</div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="text-sm text-slate-500">
                                                                                    Credits: {(course.parts || []).reduce((acc, p) => acc + (p.credits || 0), 0)}
                                                                                </div>
                                                                            </div>
                                                                        </AccordionTrigger>

                                                                        <AccordionContent>
                                                                            <div className="grid gap-4 md:grid-cols-2">
                                                                                <div>
                                                                                    <h4 className="text-sm font-semibold mb-2 text-slate-700">Parts</h4>
                                                                                    <div className="space-y-2">
                                                                                        {(course.parts || []).map((p) => (
                                                                                            <Card key={p._id ?? `${p.courseType}-${p.credits}`} className="hover:shadow-sm transition">
                                                                                                <CardContent>
                                                                                                    <div className="flex items-center justify-between">
                                                                                                        <div>
                                                                                                            <div className="font-medium text-slate-900">{p.courseType}</div>
                                                                                                            <div className="text-sm text-slate-500">Credits: {p.credits}</div>
                                                                                                            <div className="text-sm text-slate-500">Teachers: {(p.teachers || []).map((t) => t.name).join(", ") || "—"}</div>
                                                                                                        </div>

                                                                                                        <div className="text-right">
                                                                                                            <Badge className="bg-slate-100 text-slate-800 border border-slate-100">{(p.studentSummaries?.length ?? 0)} summaries</Badge>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </CardContent>
                                                                                            </Card>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>

                                                                                <div>
                                                                                    <h4 className="text-sm font-semibold mb-2 text-slate-700">Student summaries / CGPA</h4>

                                                                                    {Object.keys(semCgpa).length === 0 ? (
                                                                                        <div className="py-6 text-center">
                                                                                            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-md bg-white/50 border border-slate-100">
                                                                                                <FiLayers className="text-xl text-slate-400" />
                                                                                                <div className="text-sm text-slate-600">No summaries available</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <Table>
                                                                                            <TableHeader>
                                                                                                <TableRow>
                                                                                                    <TableHead>Student</TableHead>
                                                                                                    <TableHead className="text-right">Percent</TableHead>
                                                                                                    <TableHead className="text-right">Sem CGPA</TableHead>
                                                                                                </TableRow>
                                                                                            </TableHeader>

                                                                                            <TableBody>
                                                                                                {Object.entries(semCgpa)
                                                                                                    .sort((a, b) => b[1].cgpa - a[1].cgpa)
                                                                                                    .slice(0, 12)
                                                                                                    .map(([sid, v], idx) => (
                                                                                                        <TableRow key={sid} className="hover:bg-slate-50 transition-colors">
                                                                                                            <TableCell className="font-medium flex items-center gap-3">
                                                                                                                <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-700`}>
                                                                                                                    {idx + 1}
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                    <div className="text-slate-900">{getStudentLabel(sid, idx, studentLookup)}</div>
                                                                                                                    <div className="text-xs text-slate-500">ID {sid.slice(-6)}</div>
                                                                                                                </div>
                                                                                                            </TableCell>
                                                                                                            <TableCell className="text-right">
                                                                                                                <div className="text-sm font-medium text-slate-900">{v.normalizedPercentage.toFixed(2)}%</div>
                                                                                                            </TableCell>
                                                                                                            <TableCell className="text-right">
                                                                                                                <div className="text-sm font-semibold text-slate-900">{v.cgpa.toFixed(2)}</div>
                                                                                                            </TableCell>
                                                                                                        </TableRow>
                                                                                                    ))}
                                                                                            </TableBody>
                                                                                        </Table>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                </Accordion>
                                                            </motion.div>
                                                        ))}

                                                        {(s.courses || []).length === 0 && <div className="text-sm text-slate-500">No courses in this semester yet</div>}
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        );
                                    })}
                                </Tabs>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle>All Students CGPA (Batch)</CardTitle>
                            </CardHeader>

                            <CardContent>
                                {Object.keys(batchCgpaMap).length === 0 ? (
                                    <div className="py-8 text-center">
                                        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-md bg-white/50 border border-slate-100">
                                            <FiLayers className="text-xl text-slate-400" />
                                            <div className="text-sm text-slate-600">No CGPA data available for this batch</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {Object.entries(batchCgpaMap)
                                            .sort((a, b) => b[1].cgpa - a[1].cgpa)
                                            .map(([sid, v], idx) => (
                                                <div
                                                    key={sid}
                                                    className="flex items-center justify-between p-3 rounded-md bg-white border border-slate-50 hover:shadow-sm transition"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx < 3 ? "bg-slate-200 text-slate-900" : "bg-slate-50 text-slate-800"}`}>
                                                            <div className="font-medium">{idx + 1}</div>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900">{getStudentLabel(sid, idx, studentLookup)}</div>
                                                            <div className="text-xs text-slate-500">ID {sid.slice(-6)}</div>
                                                        </div>
                                                    </div>

                                                    <div className="text-lg font-semibold text-slate-900">{v.cgpa.toFixed(2)}</div>
                                                </div>
                                            ))}
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

"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    FiAlertCircle,
    FiCalendar,
    FiClock,
    FiBook,
    FiRefreshCw,
    FiShare2,
    FiUser,
    FiMapPin,
    FiBookOpen,
    FiInfo,
    FiMinusCircle,
    FiCheckCircle,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/utils/api/api.client";
import axios from "axios";
import { RoutineResponseDto } from "@/types/types.routine";
import { encodeId } from "@/utils/helpers/IdConversion";
import SkeletonTable from "./SkeletonTable";

// --- Time helpers ---
function parseTimeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

function format24Hour(time: string) {
    // Ensures "01:00" -> "01:00", "9:5" -> "09:05"
    const [h, m] = time.split(":").map(Number);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function sortTimeSlots(slots: string[]) {
    return slots.sort((a, b) => {
        const [aStart] = a.split("-");
        const [bStart] = b.split("-");
        return parseTimeToMinutes(aStart) - parseTimeToMinutes(bStart);
    });
}

type PageProps = { params: { routineId: string; shareId: string } };
type ApiResponse = { routine: RoutineResponseDto } | { routine: RoutineResponseDto[] };

export default function ViewRoutine({ params }: PageProps) {
    const { routineId, shareId } = params;
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [routine, setRoutine] = useState<RoutineResponseDto | null>(null);
    const [copied, setCopied] = useState(false);

    const allTimes = sortTimeSlots(
        Array.from(
            new Set(
                routine?.days.flatMap((day) =>
                    day.slots.map((slot) => `${slot.startTime}-${slot.endTime}`)
                )
            )
        )
    );

    const fetchRoutine = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const res = await api.get<ApiResponse>("/routines/view", {
                params: { routineId, shareId },
            });
            const data: ApiResponse = res.data;
            const r = Array.isArray(data.routine) ? data.routine[0] ?? null : data.routine;
            if (!r) throw new Error("Routine not found");
            setRoutine(r);
        } catch (err: unknown) {
            let msg = "Failed to load routine";
            if (axios.isAxiosError(err)) msg = err.response?.data?.message || err.message || msg;
            else if (err instanceof Error) msg = err.message;
            setErrorMsg(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [routineId, shareId]);

    useEffect(() => {
        fetchRoutine();
    }, [fetchRoutine]);

    const handleShare = async () => {
        if (!routine) return;
        try {
            const encodedRoutineId = encodeId(routine.id);
            const encodedShareId = encodeId(routine.shareId);
            const url = `${window.location.origin}/view-routine/${encodedRoutineId}/${encodedShareId}`;
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success("Link copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-6">
            <Card className="max-w-6xl mx-auto shadow-xl rounded-2xl border border-gray-200/70 backdrop-blur-xl overflow-hidden">

                {/* Header */}
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border-b border-gray-200 px-6 py-5">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
                            <FiCalendar className="h-6 w-6 text-gray-500" /> Weekly Routine
                        </CardTitle>
                        <p className="text-gray-500 flex items-center gap-2 mt-1 text-sm">
                            <FiClock className="text-gray-400" /> Organized class schedule in 24h format
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={fetchRoutine}
                            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            <FiRefreshCw className="text-gray-500" /> Refresh
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
                        >
                            <FiShare2 /> {copied ? "Copied!" : "Share"}
                        </Button>
                    </div>
                </CardHeader>


                {/* Table */}
                <CardContent className="p-6">
                    {loading ? (
                        <SkeletonTable />
                    ) : errorMsg ? (
                        <div className="flex items-center gap-2 text-red-600 font-medium">
                            <FiAlertCircle className="h-5 w-5" /> {errorMsg}
                        </div>
                    ) : routine ? (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                            <Table>
                                <TableCaption className="text-gray-500 italic flex items-center gap-2">
                                    <FiBook /> Routine overview
                                </TableCaption>
                                <TableHeader className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 border-b">
                                    <TableRow>
                                        <TableHead className="w-[140px] font-bold text-gray-700">Day</TableHead>
                                        {allTimes.map((time) => {
                                            const [start, end] = time.split("-");
                                            return (
                                                <TableHead
                                                    key={time}
                                                    className="text-center font-semibold text-indigo-600"
                                                >
                                                    {format24Hour(start)} - {format24Hour(end)}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {routine.days.map((day) => {
                                        const dayName = [
                                            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                                        ][day.dayOfWeek];
                                        return (
                                            <TableRow
                                                key={day.dayOfWeek}
                                                className="hover:bg-indigo-50/40 transition-colors"
                                            >
                                                <TableCell className="font-semibold text-gray-700 flex items-center gap-2">
                                                    <FiCalendar className="text-indigo-500" /> {dayName}
                                                </TableCell>
                                                {allTimes.map((time) => {
                                                    const slot = day.slots.find(
                                                        (s) => `${s.startTime}-${s.endTime}` === time
                                                    );
                                                    return (
                                                        <TableCell key={time} className="text-sm align-top">
                                                            {slot ? (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="flex flex-col gap-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                                                >
                                                                    <span className="font-semibold text-indigo-700 flex items-center gap-2">
                                                                        <FiBookOpen className="h-4 w-4" /> {slot.subject}
                                                                    </span>
                                                                    <span className="flex items-center gap-2 text-gray-600">
                                                                        <FiUser className="h-4 w-4" /> {slot.teacher || "—"}
                                                                    </span>
                                                                    {slot.room && (
                                                                        <span className="flex items-center gap-2 text-gray-500">
                                                                            <FiMapPin className="h-4 w-4" /> {slot.room}
                                                                        </span>
                                                                    )}
                                                                </motion.div>
                                                            ) : (
                                                                <span className="text-gray-300 flex justify-center">
                                                                    <FiMinusCircle />
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-gray-500 flex items-center gap-2">
                            <FiInfo /> No routine found.
                        </div>
                    )}
                </CardContent>

                {/* Legend */}
                <Separator />
                <CardContent className="px-6 pb-6">
                    <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-3">
                        <FiCheckCircle className="text-green-600" /> Legend
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <FiBookOpen className="text-indigo-600" /> Subject
                        </div>
                        <div className="flex items-center gap-2">
                            <FiUser className="text-gray-700" /> Teacher
                        </div>
                        <div className="flex items-center gap-2">
                            <FiMapPin className="text-gray-500" /> Room
                        </div>
                        <div className="flex items-center gap-2">
                            <FiMinusCircle className="text-gray-400" /> Empty slot
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

    );
}

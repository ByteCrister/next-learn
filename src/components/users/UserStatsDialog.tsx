"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { HiAcademicCap, HiSparkles, HiCalendar, HiChartBar } from "react-icons/hi";
import { useUsersStore } from "@/store/useUsersStore";
import { DialogSkeleton } from "./DialogSkeleton";

export function UserStatsDialog({ userId, onOpenChange }: { userId: string | null; onOpenChange: (open: boolean) => void }) {
    const open = Boolean(userId);
    const { fetchUserStatistics, userStatisticsById, perUserState } = useUsersStore();
    const stats = userStatisticsById[userId || ""];
    const state = perUserState[userId || ""] || { loading: false, error: null };

    useEffect(() => {
        if (userId) fetchUserStatistics(userId);
    }, [userId, fetchUserStatistics]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6">
                {state.loading || !stats ? (
                    <>
                        {/* Hidden title for accessibility */}
                        <DialogTitle className="sr-only">User Statistics</DialogTitle>
                        <DialogSkeleton />
                    </>
                ) : (
                    <>
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-bold text-gray-800">{stats.user.name}</DialogTitle>
                            <DialogDescription className="text-gray-500">{stats.user.email}</DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <MiniStat icon={<HiAcademicCap className="text-indigo-500" />} label="Exams taken" value={stats.stats.examsTaken} />
                            <MiniStat icon={<HiChartBar className="text-green-500" />} label="Average score" value={`${stats.stats.averageScore}%`} />
                            <MiniStat icon={<HiSparkles className="text-yellow-500" />} label="Highest score" value={stats.stats.highestScore} />
                            <MiniStat icon={<HiCalendar className="text-pink-500" />} label="Upcoming events" value={stats.stats.upcomingEvents} />
                            <MiniStat icon={<HiSparkles className="text-purple-500" />} label="Study materials" value={stats.stats.studyMaterials} />
                            <MiniStat icon={<HiCalendar className="text-cyan-500" />} label="Routines" value={stats.stats.routines} />
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
    return (
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">{icon} {label}</div>
                <div className="mt-2 text-xl font-semibold text-gray-800">{value}</div>
            </CardContent>
        </Card>
    );
}

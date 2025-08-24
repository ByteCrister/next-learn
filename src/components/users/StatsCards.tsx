"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsersStore } from "@/store/useUsersStore";
import { motion, Variants } from "framer-motion";
import CountUp from "react-countup";
import {
    HiUserGroup,
    HiClipboardCheck,
    HiLibrary,
    HiCalendar,
    HiSparkles
} from "react-icons/hi";

const variants: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
    })
};

function Glimmer({ className = "" }: { className?: string }) {
    return (
        <div
            className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl pointer-events-none ${className}`}
        />
    );
}

export function StatsCards() {
    const { aggregates, aggregatesState } = useUsersStore();

    if (aggregatesState.loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
            </div>
        );
    }

    const buckets = aggregates?.stats;
    const sum = (arr?: { count: number }[]) =>
        (arr || []).reduce((a, b) => a + b.count, 0);

    const cards = [
        {
            label: "Users",
            value: sum(buckets?.users),
            icon: <HiUserGroup className="h-5 w-5" />,
            gradient: "from-fuchsia-500 to-indigo-500"
        },
        {
            label: "Subjects",
            value: sum(buckets?.subjects),
            icon: <HiLibrary className="h-5 w-5" />,
            gradient: "from-cyan-500 to-emerald-500"
        },
        {
            label: "Exams",
            value: sum(buckets?.exam),
            icon: <HiClipboardCheck className="h-5 w-5" />,
            gradient: "from-amber-500 to-rose-500"
        },
        {
            label: "Materials",
            value: sum(buckets?.material),
            icon: <HiSparkles className="h-5 w-5" />,
            gradient: "from-pink-500 to-purple-500"
        },
        {
            label: "Events",
            value: sum(buckets?.event),
            icon: <HiCalendar className="h-5 w-5" />,
            gradient: "from-yellow-500 to-orange-500"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((c, i) => (
                <motion.div
                    key={c.label}
                    custom={i}
                    variants={variants}
                    initial="hidden"
                    animate="show"
                >
                    <Card
                        className="relative overflow-hidden border border-white/10 
                           bg-white/[0.08] dark:bg-white/[0.03] backdrop-blur-xl 
                           hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                        <Glimmer />
                        <CardHeader className="pb-2 flex items-center gap-3">
                            <div
                                className={`flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br ${c.gradient} text-neutral-100 shadow-md`}
                            >
                                {c.icon}
                            </div>
                            <CardTitle className="text-sm font-medium text-neutral-500 tracking-wide">
                                {c.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-3xl font-bold tracking-tight text-neutral-800">
                                <CountUp
                                    start={0}
                                    end={c.value || 0}
                                    duration={1.5}
                                    separator=","
                                />
                            </div>
                            <div
                                className={`mt-4 h-1 rounded-full bg-gradient-to-r ${c.gradient}`}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

export function StatsCardSkeleton() {
    return (
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl animate-pulse">
            <CardHeader className="pb-2 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/10" />
                <div className="h-4 w-24 bg-white/10 rounded" />
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
                <div className="h-8 w-28 bg-white/10 rounded" />
                <div className="h-1 w-full bg-white/10 rounded" />
            </CardContent>
        </Card>
    );
}

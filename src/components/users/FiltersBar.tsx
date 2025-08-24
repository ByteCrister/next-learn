"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { HiCalendar, HiAdjustments } from "react-icons/hi";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { useUsersStore } from "@/store/useUsersStore";
import { IntervalUnit } from "@/types/types.users";

export function FiltersBar() {
    const { range, interval, query, setRange, setInterval, setQuery, fetchAggregates, fetchUsers } = useUsersStore();
    const [open, setOpen] = useState(false);

    const startDate = useMemo(() => new Date(range.start), [range.start]);
    const endDate = useMemo(() => new Date(range.end), [range.end]);

    const apply = async () => {
        await Promise.all([fetchAggregates(), fetchUsers(1)]);
    };

    return (
        <motion.div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent 
                       dark:from-neutral-900/40 dark:via-neutral-900/20 dark:to-transparent 
                       backdrop-blur-xl p-4 md:p-5 shadow-lg shadow-black/5 dark:shadow-black/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
                {/* Search + Filters */}
                <div className="flex-1 flex flex-wrap gap-3">
                    {/* Search */}
                    <div className="w-full md:max-w-sm relative">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search users by name or email"
                            className="pl-10 bg-white/60 dark:bg-white/5 border-white/20 
                                       focus-visible:ring-2 focus-visible:ring-fuchsia-400/50 
                                       placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        />
                        <HiAdjustments className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>

                    {/* Interval */}
                    <Select value={interval} onValueChange={(v: IntervalUnit) => setInterval(v)}>
                        <SelectTrigger className="w-[150px] bg-white/60 dark:bg-white/5 border-white/20 
                                                  hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
                            <HiAdjustments className="mr-2 h-4 w-4 opacity-70" />
                            <SelectValue placeholder="Interval" />
                        </SelectTrigger>
                        <SelectContent className="backdrop-blur-xl bg-white/90 dark:bg-neutral-900/90 border border-white/20">
                            <SelectItem value="day">Day</SelectItem>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                            <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Date Range */}
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="bg-white/60 dark:bg-white/5 border-white/20 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                            >
                                <HiCalendar className="mr-2 h-4 w-4" />
                                {format(startDate, "MMM d, yyyy")} — {format(endDate, "MMM d, yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                            <div className="grid grid-cols-2 gap-2 p-3">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(d) => d && setRange({ start: d.toISOString(), end: range.end })}
                                />
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(d) => d && setRange({ start: range.start, end: d.toISOString() })}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Apply Button */}
                <div className="flex gap-2 md:justify-end">
                    <Button
                        onClick={apply}
                        className={clsx(
                            "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white font-semibold",
                            "shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40",
                            "hover:from-fuchsia-400 hover:via-purple-400 hover:to-indigo-400 transition-all duration-200"
                        )}
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Eye, Edit } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VEvent } from '@/types/types.events';


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

const statusConfig: Record<VEvent['eventStatus'], any> = {
    upcoming: {
        badge: "bg-blue-100/20 text-blue-600 border border-blue-300/30 backdrop-blur-sm",
        card: "bg-white border-2 border-blue-200/20 hover:border-blue-400/40",
        icon: "text-blue-600",
        accent: "bg-gradient-to-br from-blue-400 to-blue-600",
        dot: "bg-blue-500",
        glow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]",
    },
    inProgress: {
        badge: "bg-amber-100/20 text-amber-600 border border-amber-300/30 backdrop-blur-sm",
        card: "bg-white border-2 border-amber-200/20 hover:border-amber-400/40",
        icon: "text-amber-600",
        accent: "bg-gradient-to-br from-amber-400 to-amber-600",
        dot: "bg-amber-500",
        glow: "shadow-[0_0_20px_rgba(251,191,36,0.4)]",
    },
    expired: {
        badge: "bg-red-100/20 text-red-600 border border-red-300/30 backdrop-blur-sm",
        card: "bg-white border-2 border-red-200/20 hover:border-red-400/40",
        icon: "text-red-600",
        accent: "bg-gradient-to-br from-red-400 to-red-600",
        dot: "bg-red-500",
        glow: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    },
    completed: {
        badge: "bg-emerald-100/20 text-emerald-600 border border-emerald-300/30 backdrop-blur-sm",
        card: "bg-white border-2 border-emerald-200/20 hover:border-emerald-400/40",
        icon: "text-emerald-600",
        accent: "bg-gradient-to-br from-emerald-400 to-emerald-600",
        dot: "bg-emerald-500",
        glow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    },
};

function formatDateTime(date: Date | undefined): string {
    if (!date || isNaN(date.getTime())) return '—';
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleString('en-US', options);
}

function toDate(val: string | Date | undefined) {
    if (!val) return undefined;
    return val instanceof Date ? val : new Date(val);
}

interface EventsListProps {
    showEvents: boolean;
    fetching: boolean;
    paginatedEvents: VEvent[];
    openEventModal: (evt: VEvent, mode: 'view' | 'edit') => void;
}

export default function EventsList({ showEvents, fetching, paginatedEvents, openEventModal }: EventsListProps) {
    return (
        <AnimatePresence mode="wait">
            {showEvents && (
                <motion.div
                    key="events-list"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 20 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-1"
                >
                    {fetching
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <div className="h-96 rounded-2xl bg-gray-200 animate-pulse" />
                            </motion.div>
                        ))
                        : paginatedEvents.length === 0
                            ? (
                                <motion.div
                                    variants={itemVariants}
                                    className="col-span-full flex flex-col items-center justify-center py-20"
                                >
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="mb-1"
                                    >
                                        <Calendar className="w-20 h-20 text-gray-300" />
                                    </motion.div>
                                    <p className="text-gray-600 text-xl font-semibold mb-1">No events found</p>
                                    <p className="text-gray-500">Try adjusting your search parameters</p>
                                </motion.div>
                            )
                            : paginatedEvents.map((evt, idx) => {
                                const doneCount = (evt.tasks || []).filter((t) => t.isComplete).length;
                                const totalCount = (evt.tasks || []).length;
                                const config = statusConfig[evt.eventStatus];

                                // Correctly typed icon

                                return (
                                    <motion.div
                                        key={evt._id}
                                        variants={itemVariants}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        className="group"
                                    >
                                        <Card className={`${config.card} rounded-2xl border-2 shadow-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] ${config.glow} overflow-hidden h-full flex flex-col transition-all duration-500 backdrop-blur-md`}>
                                            <CardHeader className="pb-3 px-4 relative">
                                                <div className="flex items-start justify-between mb-2">
                                                    <motion.div
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: idx * 0.05 + 0.2 }}
                                                    >
                                                        <Badge className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${config.badge}`}>
                                                            <motion.span
                                                                className={`inline-block w-1.5 h-1.5 rounded-full ${config.dot} mr-2`}
                                                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                            />
                                                            {evt.eventStatus === 'inProgress' ? 'In Progress' : evt.eventStatus}
                                                        </Badge>
                                                    </motion.div>
                                                </div>
                                                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight neon-text">
                                                    {evt.title.length > 23 ? evt.title.slice(0, 23) + "..." : evt.title}
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="space-y-3 flex-1 flex flex-col relative px-4 pb-3">
                                                <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
                                                    {evt.description
                                                        ? (evt.description.length > 36
                                                            ? evt.description.slice(0, 36) + "..."
                                                            : evt.description)
                                                        : "No description provided."
                                                    }
                                                </p>

                                                <div className="space-y-2 flex-1">
                                                    <motion.div
                                                        className="flex items-start gap-2.5 p-2.5 bg-white/10 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all"
                                                        whileHover={{ x: 2 }}
                                                    >
                                                        <div className="p-2 bg-gray-900/10 rounded-lg flex-shrink-0 shadow-inner border border-gray-200">
                                                            <Calendar className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Start</p>
                                                            <p className="text-gray-900 font-medium text-sm">
                                                                {formatDateTime(toDate(evt.start))}
                                                            </p>
                                                        </div>
                                                    </motion.div>

                                                    <motion.div
                                                        className="flex items-start gap-2.5 p-2.5 bg-white/10 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all"
                                                        whileHover={{ x: 2 }}
                                                    >
                                                        <div className="p-2 bg-gray-900/10 rounded-lg flex-shrink-0 shadow-inner border border-gray-200">
                                                            <Clock className="w-4 h-4 text-amber-500" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">End</p>
                                                            <p className="text-gray-900 font-medium text-sm">
                                                                {(() => {
                                                                    const startDate = toDate(evt.start);
                                                                    if (!startDate) return '—';
                                                                    const endDate = toDate(evt.end);
                                                                    if (endDate && !isNaN(endDate.getTime())) return formatDateTime(endDate);
                                                                    const computedEnd = new Date(startDate.getTime() + (evt.durationMinutes || 0) * 60000);
                                                                    return formatDateTime(computedEnd);
                                                                })()}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                </div>

                                                {evt.tasks && evt.tasks.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="space-y-2.5 pt-4 border-t border-gray-200"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600 font-medium text-xs uppercase tracking-wide">Tasks</span>
                                                            <motion.span
                                                                className={`font-semibold text-sm ${config.icon}`}
                                                                key={`${doneCount}-${totalCount}`}
                                                                animate={{ scale: [1, 1.05, 1] }}
                                                            >
                                                                {doneCount}/{totalCount}
                                                            </motion.span>
                                                        </div>
                                                        <div className="w-full bg-gray-200/40 h-2 rounded-full overflow-hidden">
                                                            <motion.div
                                                                className={`h-full ${config.accent}`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(doneCount / totalCount) * 100}%` }}
                                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </CardContent>

                                            <div className="flex gap-0 px-4 border-t border-gray-200 mt-auto bg-white/10">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-32 flex-shrink-0"
                                                >
                                                    <Button
                                                        onClick={() => openEventModal(evt, 'view')}
                                                        className={`w-11 ${config.accent} hover:opacity-90 text-white rounded-lg py-2.5 px-4 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]`}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </motion.div>

                                                {evt.eventStatus !== 'expired' && evt.eventStatus !== 'completed' && (
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="-ml-19"
                                                    >
                                                        <Button
                                                            onClick={() => openEventModal(evt, 'edit')}
                                                            className="px-4 py-2.5 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all duration-300 flex items-center justify-center h-auto shadow-sm"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

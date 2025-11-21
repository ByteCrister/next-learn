import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Clock, ChevronRight, Star, Sparkles } from "lucide-react";
import { useState } from "react";

export default function HistoryTimeline() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    
    const history = [
        { 
            title: "Data Structures Final", 
            score: 94, 
            date: "2 days ago", 
            status: "excellent",
            subject: "Computer Science",
            questions: 45,
            time: "2h 15m",
            rank: "Top 5%"
        },
        { 
            title: "ML Midterm", 
            score: 87, 
            date: "1 week ago", 
            status: "good",
            subject: "Machine Learning",
            questions: 38,
            time: "1h 50m",
            rank: "Top 15%"
        },
        { 
            title: "Web Dev Quiz", 
            score: 92, 
            date: "2 weeks ago", 
            status: "excellent",
            subject: "Web Development",
            questions: 30,
            time: "1h 30m",
            rank: "Top 8%"
        },
    ];

    const getStatusColor = (status: string) => {
        return status === 'excellent' 
            ? 'from-emerald-50 to-green-50 border-emerald-200' 
            : 'from-blue-50 to-cyan-50 border-blue-200';
    };

    const getScoreGradient = (status: string) => {
        return status === 'excellent'
            ? 'from-emerald-500 to-green-600'
            : 'from-blue-500 to-cyan-600';
    };

    const getBadgeColor = (status: string) => {
        return status === 'excellent'
            ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
            : 'bg-blue-100 text-blue-700 border-blue-300';
    };

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    return (
        <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 sm:mb-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-black via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Your Journey
                        </h1>
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />
                    </div>
                    <p className="text-slate-600 text-base sm:text-lg font-medium px-4">Track your progress and celebrate achievements</p>
                </motion.div>

                <div className="space-y-4 sm:space-y-6">
                    {history.map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                                delay: i * 0.15,
                                type: "spring",
                                stiffness: 100
                            }}
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseLeave={handleMouseLeave}
                            className="relative group"
                        >
                            {/* Glow effect */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-r ${h.status === 'excellent' ? 'from-emerald-200/50 to-green-200/50' : 'from-blue-200/50 to-cyan-200/50'} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                animate={{
                                    scale: hoveredIndex === i ? 1.05 : 1,
                                }}
                            />
                            
                            <motion.div
                                className={`relative bg-gradient-to-br ${getStatusColor(h.status)} backdrop-blur-xl rounded-3xl border-2 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300`}
                                whileHover={{ scale: 1.02, y: -4 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {/* Decorative circles */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-3xl" />

                                <div className="relative p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                        {/* Score Badge */}
                                        <motion.div
                                            className="relative mx-auto sm:mx-0"
                                            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br ${getScoreGradient(h.status)} flex items-center justify-center shadow-xl relative overflow-hidden`}>
                                                {/* Shimmer effect */}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                    animate={{
                                                        x: ['-200%', '200%'],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        repeatDelay: 1,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                                <div className="text-center relative z-10">
                                                    <p className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">{h.score}</p>
                                                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 mx-auto mt-1" fill="currentColor" />
                                                </div>
                                            </div>
                                            {/* Floating ring */}
                                            <motion.div
                                                className={`absolute inset-0 rounded-3xl border-4 ${h.status === 'excellent' ? 'border-emerald-400' : 'border-blue-400'}`}
                                                animate={{
                                                    scale: [1, 1.15, 1],
                                                    opacity: [0.6, 0.2, 0.6],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        </motion.div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 w-full">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4 mb-3">
                                                <div className="w-full sm:w-auto">
                                                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-1 text-center sm:text-left">{h.title}</h3>
                                                    <p className="text-sm text-slate-600 font-semibold text-center sm:text-left">{h.subject}</p>
                                                </div>
                                                <motion.div
                                                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 ${getBadgeColor(h.status)} backdrop-blur-sm rounded-full border-2 shadow-sm mx-auto sm:mx-0`}
                                                    whileHover={{ scale: 1.1, rotate: 2 }}
                                                >
                                                    <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="text-xs font-black">{h.rank}</span>
                                                </motion.div>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 mb-4 text-xs sm:text-sm font-medium text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-700" />
                                                    </div>
                                                    <span>{h.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                                                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-slate-700" />
                                                    </div>
                                                    <span>{h.questions} questions</span>
                                                </div>
                                                <span className="text-slate-400 hidden sm:inline">•</span>
                                                <span className="text-slate-500">{h.date}</span>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="mb-4 sm:mb-5">
                                                <div className="h-2.5 sm:h-3 bg-white/60 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                                    <motion.div
                                                        className={`h-full bg-gradient-to-r ${getScoreGradient(h.status)} relative overflow-hidden`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${h.score}%` }}
                                                        transition={{ delay: i * 0.15 + 0.3, duration: 1, ease: "easeOut" }}
                                                    >
                                                        {/* Animated shine on progress bar */}
                                                        <motion.div
                                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                                            animate={{
                                                                x: ['-100%', '200%'],
                                                            }}
                                                            transition={{
                                                                duration: 1.5,
                                                                repeat: Infinity,
                                                                repeatDelay: 2,
                                                            }}
                                                        />
                                                    </motion.div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* Shine effect on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: hoveredIndex === i ? '100%' : '-100%' }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
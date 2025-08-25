'use client';

import { motion } from 'framer-motion';
import { Sora } from 'next/font/google';
import Link from 'next/link';
import {  Bolt, Zap } from 'lucide-react';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

const sora = Sora({ subsets: ['latin'], weight: ['400', '600', '700'] });

// Mimic palette array for shape & layout consistency
export const palettes = [
    { gradient: 'bg-gray-200', iconBg: 'bg-gray-300', border: 'border-gray-300', text: 'text-gray-400' },
    { gradient: 'bg-gray-200', iconBg: 'bg-gray-300', border: 'border-gray-300', text: 'text-gray-400' },
    { gradient: 'bg-gray-200', iconBg: 'bg-gray-300', border: 'border-gray-300', text: 'text-gray-400' },
    { gradient: 'bg-gray-200', iconBg: 'bg-gray-300', border: 'border-gray-300', text: 'text-gray-400' },
];

export default function DashboardSkeleton() {
    // Number of overview cards & quick actions to match real page
    const overviewPlaceholders = Array.from({ length: 4 });
    const quickActionPlaceholders = Array.from({ length: 3 });

    return (
        <motion.div
            className={`${sora.className} p-6 grid grid-cols-1 lg:grid-cols-4 gap-8 bg-gradient-to-br from-gray-50 to-white min-h-screen`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
        >
            {/* Sidebar */}
            <motion.div
                className="space-y-6"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
            >
                <Link href="#">
                    <Card className="relative overflow-hidden rounded-2xl shadow-lg">
                        <div className="absolute inset-0 bg-gray-300 opacity-80" />
                        <CardHeader className="relative z-10">
                            <Skeleton className="h-6 w-32 bg-gray-400" />
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full bg-gray-400/80" />
                            ))}
                        </CardContent>
                    </Card>
                </Link>
            </motion.div>

            {/* Main Content */}
            <div className="col-span-3 space-y-16">
                {/* Overview */}
                <motion.section initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center mb-6 space-x-3">
                        <div className="p-2 bg-gray-300 rounded-lg shadow-lg text-white">
                            <Bolt size={24} />
                        </div>
                        <div>
                            <Skeleton className="h-6 w-32 bg-gray-400" />
                            <span className="block mt-1 h-1 w-12 rounded-full bg-gray-300" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {overviewPlaceholders.map((_, i) => (
                            <motion.div
                                key={i}
                                className="bg-gray-200 cursor-pointer rounded-2xl backdrop-blur-md border border-gray-300 shadow-lg"
                            >
                                <CardHeader className="flex items-center gap-2 p-4 pb-0">
                                    <div className="p-2 rounded-full bg-gray-300" />
                                    <Skeleton className="h-4 w-20 bg-gray-400" />
                                </CardHeader>
                                <CardContent className="text-3xl font-bold pt-2 pb-4">
                                    <Skeleton className="h-8 w-16 bg-gray-400" />
                                </CardContent>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Quick Actions */}
                <motion.section initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center mb-6 space-x-3">
                        <div className="p-2 bg-gray-300 rounded-lg shadow-lg text-white">
                            <Zap size={24} />
                        </div>
                        <div>
                            <Skeleton className="h-6 w-32 bg-gray-400" />
                            <span className="block mt-1 h-1 w-12 rounded-full bg-gray-300" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {quickActionPlaceholders.map((_, i) => (
                            <Dialog key={i}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex items-center justify-center border-2 border-gray-300 text-gray-400 
                      rounded-xl shadow-md transition-all duration-300 backdrop-blur-sm px-4 py-3"
                                    >
                                        <div className="p-1 rounded-full bg-gray-300" />
                                        <Skeleton className="ml-2 h-4 w-24 bg-gray-400" />
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="p-6 w-full max-w-lg rounded-xl shadow-lg border border-gray-200 bg-white backdrop-blur-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-semibold text-gray-800">Loading...</DialogTitle>
                                        <DialogDescription className="text-gray-500 text-sm">
                                            Please wait
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Skeleton className="h-10 w-full bg-gray-300" />
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
}

"use client";

import { motion } from 'framer-motion';
import { Search, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EventsSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    setCurrentPage: (page: number) => void;
    searchFocused: boolean;
    setSearchFocused: (focused: boolean) => void;
    showEvents: boolean;
    setShowEvents: (show: boolean) => void;
}

export default function EventsSearch({
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    searchFocused,
    setSearchFocused,
    showEvents,
    setShowEvents,
}: EventsSearchProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6 mb-12"
        >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <motion.div
                    className="flex-1 relative group"
                    animate={{ scale: searchFocused ? 1.02 : 1 }}
                >
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search events, dates, status..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="pl-12 pr-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium"
                    />
                    {searchTerm && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => {
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    )}
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={() => setShowEvents(!showEvents)}
                        className="rounded-xl px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 font-semibold text-gray-700 flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl h-auto"
                    >
                        <Eye className="w-5 h-5" />
                        {showEvents ? 'Hide' : 'Show'}
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}
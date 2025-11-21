"use client";

import { motion } from 'framer-motion';
import { Search, Eye, X, Filter, SortAsc, SortDesc, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SortKey = 'title' | 'start' | 'end' | 'allDay' | 'eventStatus';
type SortDirection = 'asc' | 'desc';

interface EventsSortProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortKey: SortKey;
    setSortKey: (key: SortKey) => void;
    sortDirection: SortDirection;
    setSortDirection: (direction: SortDirection) => void;
    searchFocused: boolean;
    setSearchFocused: (focused: boolean) => void;
    showEvents: boolean;
    setShowEvents: (show: boolean) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

export default function EventsSort({
    searchTerm,
    setSearchTerm,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    searchFocused,
    setSearchFocused,
    showEvents,
    setShowEvents,
    setCurrentPage,
}: EventsSortProps) {
    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6 mb-12"
        >
            {/* Search & Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <motion.div
                    className="flex-1 relative group"
                    animate={{ scale: searchFocused ? 1.02 : 1 }}
                >
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
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
                        className="pl-12 pr-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow transition-all duration-300 text-base font-medium"
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

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                        onClick={() => setShowEvents(!showEvents)}
                        className="rounded-xl px-6 py-2 border border-gray-300 bg-white hover:bg-gray-50 font-semibold text-gray-700 flex items-center gap-2 shadow-sm hover:shadow transition-all duration-300 h-auto"
                    >
                        <Eye className="w-5 h-5" />
                        {showEvents ? 'Hide' : 'Show'}
                    </Button>
                </motion.div>
            </div>

            {/* Sort Controls */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm"
            >
                <div className="flex flex-wrap justify-center items-center gap-3">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Sort:</span>
                    <div className="flex flex-wrap gap-2">
                        {(['title', 'start', 'end', 'allDay', 'eventStatus'] as SortKey[]).map((key) => {
                            const isActive = sortKey === key;
                            const Icon = isActive ? (sortDirection === 'asc' ? SortAsc : SortDesc) : Calendar;

                            const label = {
                                title: 'Title',
                                start: 'Start',
                                end: 'End',
                                allDay: 'All Day',
                                eventStatus: 'Status',
                            }[key];

                            return (
                                <motion.div key={key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button
                                        size="sm"
                                        onClick={() => handleSort(key)}
                                        className={`flex items-center gap-2 rounded-lg font-medium px-4 py-2 text-xs transition-all duration-300 h-auto ${isActive
                                            ? 'bg-blue-500 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                            }`}
                                    >
                                        {label}
                                        <Icon size={14} />
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
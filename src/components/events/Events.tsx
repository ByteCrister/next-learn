'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Funnel, SortAsc, SortDesc } from 'lucide-react';
import { useEventsStore } from '@/store/useEventsStore';
import { useBreadcrumbStore } from '@/store/useBreadcrumbStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { VEvent } from '@/types/types.events';

const PAGE_SIZE = 6;

const btnPrimary = 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all duration-300';
const btnSecondary = 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 shadow-sm transition-all duration-300';
const btnDisabled = 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none';

type SortKey = 'title' | 'start' | 'end' | 'allDay';
type SortDirection = 'asc' | 'desc';

function getValueByKey(event: VEvent, key: SortKey) {
  switch (key) {
    case 'title':
      return event.title;
    case 'start':
      return event.start;
    case 'end':
      return event.end;
    case 'allDay':
      return event.allDay;
  }
}

export default function Events() {
  const { events, eventsLoading, fetchEvents } = useEventsStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [showEvents, setShowEvents] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('start');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    if (events.length === 0) fetchEvents();
    setBreadcrumbs([
      { label: 'Home', href: '/' },
      { label: 'Events', href: '/events' },
    ]);
  }, [events.length, fetchEvents, setBreadcrumbs]);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.description?.toLowerCase().includes(term) ||
          e.start?.toLocaleString().toLowerCase().includes(term) ||
          e.end?.toLocaleString().toLowerCase().includes(term)
      );
    }

    filtered = filtered.slice().sort((a, b) => {
      const aVal = getValueByKey(a, sortKey);
      const bVal = getValueByKey(b, sortKey);

      if (sortKey === 'start' || sortKey === 'end') {
        return sortDirection === 'asc'
          ? (aVal as Date).getTime() - (bVal as Date).getTime()
          : (bVal as Date).getTime() - (aVal as Date).getTime();
      }
      if (sortKey === 'allDay') {
        return sortDirection === 'asc'
          ? Number(aVal) - Number(bVal)
          : Number(bVal) - Number(aVal);
      }
      if (sortKey === 'title') {
        return sortDirection === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return 0;
    });

    return filtered;
  }, [events, searchTerm, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-indigo-900 tracking-wide select-none">
        Events
      </h1>

      {/* Search & Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 sm:gap-4 max-w-md mx-auto">
        <Input
          type="search"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-2xl border border-indigo-300 px-5 py-3 text-gray-700 placeholder-indigo-400 focus:border-indigo-500 focus:ring focus:ring-indigo-300 transition"
          autoComplete="off"
        />
        <Button
          onClick={() => setShowEvents((v) => !v)}
          className={showEvents ? btnPrimary : btnSecondary}
          aria-pressed={showEvents}
          aria-label={showEvents ? 'Hide Events' : 'Show Events'}
          size="lg"
        >
          {showEvents ? 'Hide Events' : 'Show Events'}
        </Button>
      </div>

      {/* Sorting Controls */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-3xl px-6 py-4 shadow-sm max-w-xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          <span className="text-indigo-700 font-semibold text-sm self-center select-none">
            Sort by:
          </span>
          {(['title', 'start', 'end', 'allDay'] as SortKey[]).map((key) => {
            const isActive = sortKey === key;
            const Icon = isActive
              ? sortDirection === 'asc'
                ? SortAsc
                : SortDesc
              : Funnel;

            const label = {
              title: 'Title',
              start: 'Start Date',
              end: 'End Date',
              allDay: 'All Day',
            }[key];

            return (
              <Button
                key={key}
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                onClick={() => handleSort(key)}
                className="flex items-center gap-1 rounded-full font-medium px-4 py-2 tracking-wide"
                aria-pressed={isActive}
              >
                {label}
                <Icon size={16} />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Event Cards */}
      <AnimatePresence>
        {showEvents && (
          <motion.div
            key="events-list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {eventsLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-64 rounded-2xl bg-indigo-100"
                  />
                ))
              : paginatedEvents.length === 0
              ? (
                <p className="col-span-full text-center text-indigo-500 italic font-medium">
                  No events found.
                </p>
              ) : (
                paginatedEvents.map((evt) => (
                  <motion.div
                    key={evt._id}
                    whileHover={{
                      y: -6,
                      boxShadow: '0 16px 32px rgba(99, 102, 241, 0.15)',
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className="rounded-3xl overflow-hidden border border-indigo-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-1 px-6 pt-6">
                        <CardTitle className="text-xl font-semibold text-indigo-900 tracking-wide">
                          {evt.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-gray-700 px-6 pb-6 space-y-4 text-sm leading-relaxed">
                        <p className="line-clamp-3">{evt.description || 'No description provided.'}</p>
                        <div className="text-indigo-800 space-y-1">
                          <p>
                            <span className="font-semibold">Start:</span>{' '}
                            {evt.start?.toLocaleString()}
                          </p>
                          <p>
                            <span className="font-semibold">End:</span>{' '}
                            {evt.end?.toLocaleString()}
                          </p>
                        </div>
                        {evt.allDay && (
                          <p className="text-indigo-500 italic text-xs font-semibold">
                            All Day Event
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {showEvents && totalPages > 1 && (
        <nav className="flex justify-center items-center gap-6 mt-10">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={currentPage === 1 ? btnDisabled : btnPrimary}
            aria-label="Previous Page"
          >
            <ChevronLeft size={22} />
          </Button>

          <span className="text-indigo-700 text-base font-semibold select-none">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className={currentPage === totalPages ? btnDisabled : btnPrimary}
            aria-label="Next Page"
          >
            <ChevronRight size={22} />
          </Button>
        </nav>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Funnel,
  SortAsc,
  SortDesc,
  CheckCircle2,
} from 'lucide-react';
import { useEventsStore } from '@/store/useEventsStore';
import { useBreadcrumbStore } from '@/store/useBreadcrumbStore';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VEvent } from '@/types/types.events';
import EventModal from './EventModal';

const PAGE_SIZE = 6;

type SortKey = 'title' | 'start' | 'end' | 'allDay' | 'eventStatus';
type SortDirection = 'asc' | 'desc';

function toDate(val: string | Date | undefined) {
  if (!val) return undefined;
  return val instanceof Date ? val : new Date(val);
}

function getValueByKey(event: VEvent, key: SortKey) {
  switch (key) {
    case 'title':
      return event.title;
    case 'start':
      return toDate(event.start);
    case 'end':
      return toDate(event.end);
    case 'allDay':
      return event.allDay;
    case 'eventStatus':
      return event.eventStatus;
  }
}

const statusColors: Record<VEvent['eventStatus'], string> = {
  upcoming: "bg-blue-500 text-white",
  inProgress: "bg-amber-400 text-black",
  expired: "bg-red-500 text-white",
  completed: "bg-green-500 text-white"
};

// Helper function to get status color with fallback
const getStatusColor = (status: VEvent['eventStatus']): string => {
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

// Card background colors based on status
const cardStatusColors: Record<VEvent['eventStatus'], string> = {
  upcoming: "bg-purple-500 text-white",
  inProgress: "bg-orange-400 text-black",
  expired: "bg-slate-700 text-white",
  completed: "bg-teal-500 text-white"
};

// Helper function to get card status color with fallback
const getCardStatusColor = (status: VEvent['eventStatus']): string => {
  return cardStatusColors[status] || 'bg-gray-100 text-gray-800';
};

export default function Events() {
  const { events, fetching, fetchEvents } = useEventsStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<VEvent | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const [showEvents, setShowEvents] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('start');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    fetchEvents();
    setBreadcrumbs([
      { label: 'Home', href: '/' },
      { label: 'Events', href: '/events' },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredEvents = useMemo(() => {
    if (!events || !Array.isArray(events)) {
      return [];
    }
    
    let filtered = events;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.description?.toLowerCase().includes(term) ||
          toDate(e.start)?.toLocaleString().toLowerCase().includes(term) ||
          toDate(e.end)?.toLocaleString().toLowerCase().includes(term) ||
          e.eventStatus.toLowerCase().includes(term)
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
      if (sortKey === 'title' || sortKey === 'eventStatus') {
        return sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
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

  const openEventModal = (evt: VEvent) => {
    setSelectedEvent(evt);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <h1 className="text-5xl font-extrabold text-indigo-900 tracking-wide select-none">
        Events
      </h1>

      {/* Search & Toggle */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 max-w-xl mx-auto">
        <Input
          type="search"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-2xl border-indigo-300 px-5 py-3 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-all"
        />
        <Button
          onClick={() => setShowEvents((v) => !v)}
          className={`rounded-full px-6 py-3 shadow-lg transition-all duration-300 ${showEvents
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
        >
          {showEvents ? 'Hide Events' : 'Show Events'}
        </Button>
      </div>

      {/* Sorting */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-3xl px-6 py-4 shadow-inner max-w-2xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          <span className="text-indigo-700 font-semibold text-sm">Sort by:</span>
          {(['title', 'start', 'end', 'allDay', 'eventStatus'] as SortKey[]).map(
            (key) => {
              const isActive = sortKey === key;
              const Icon = isActive
                ? sortDirection === 'asc'
                  ? SortAsc
                  : SortDesc
                : Funnel;

              const label = {
                title: 'Title',
                start: 'Start',
                end: 'End',
                allDay: 'All Day',
                eventStatus: 'Status',
              }[key];

              return (
                <Button
                  key={key}
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => handleSort(key)}
                  className={`flex items-center gap-1 rounded-full font-medium px-4 py-2 transition-all ${isActive
                    ? 'bg-indigo-500 text-white shadow-md hover:bg-indigo-600'
                    : 'border border-indigo-300 text-indigo-700 hover:bg-indigo-100'
                    }`}
                >
                  {label}
                  <Icon size={16} />
                </Button>
              );
            }
          )}
        </div>
      </div>

      {/* Events */}
      <AnimatePresence>
        {showEvents && (
          <motion.div
            key="events-list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8"
          >
            {fetching
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-64 rounded-3xl bg-neutral-200 animate-pulse"
                />
              ))
              : paginatedEvents.length === 0
                ? (
                  <p className="col-span-full text-center text-indigo-500 italic text-lg">
                    No events found.
                  </p>
                )
                : paginatedEvents.map((evt) => {
                  const doneCount = (evt.tasks || []).filter((t) => t.isComplete).length;
                  const totalCount = (evt.tasks || []).length;

                  return (
                    <motion.div
                      key={evt._id}
                      whileHover={{
                        y: -8,
                        scale: 1.03,
                      }}
                      transition={{ duration: 0.3 }}
                      onClick={() => openEventModal(evt)}
                      className="cursor-pointer"
                    >
                      <Card className={`px-0 py-0rounded-3xl overflow-hidden border border-indigo-100 shadow-md transition-all duration-300 hover:shadow-indigo-hover ${getCardStatusColor(evt.eventStatus)}`}>

                        {/* Inner Background Layer */}
                        <div className="bg-black/95 px-0 py-0">
                          <CardHeader className="px-6 pt-6 pb-3 flex justify-between items-start">
                            <Badge
                              className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide shadow-sm ${getStatusColor(evt.eventStatus)} uppercase`}
                            >
                              {evt.eventStatus}
                            </Badge>
                            {evt.tasks?.length > 0 && (
                              <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full shadow-inner">
                                {evt.tasks.length} Tasks
                              </span>
                            )}
                          </CardHeader>

                          <CardContent className="px-6 pb-6 space-y-5">
                            <CardTitle className="text-lg font-bold text-indigo-900">
                              {evt.title}
                            </CardTitle>
                            {/* Description */}
                            <p className="line-clamp-3 text-gray-700 leading-relaxed text-sm">
                              {evt.description 
                                ? (evt.description.length > 20 
                                    ? `${evt.description.substring(0, 20)}...` 
                                    : evt.description)
                                : 'No description provided.'}
                            </p>

                            <hr className="border-gray-100" />

                            {/* Dates */}
                            <div className="text-indigo-900 text-sm space-y-1">
                              <p>
                                <span className="font-medium text-gray-500">Start:</span>{' '}
                                <span className="font-semibold">{toDate(evt.start)?.toLocaleString() || '—'}</span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-500">End:</span>{' '}
                                <span className="font-semibold">
                                  {(() => {
                                    const startDate = toDate(evt.start);
                                    const endDate = toDate(evt.end);
                                    if (endDate && !isNaN(endDate.getTime())) return endDate.toLocaleString();
                                    if (startDate && !isNaN(startDate.getTime()) && evt.durationMinutes) {
                                      return new Date(startDate.getTime() + evt.durationMinutes * 60000).toLocaleString();
                                    }
                                    return '—';
                                  })()}
                                </span>
                              </p>
                              {evt.allDay && <p className="text-indigo-500 italic text-xs font-semibold">All Day Event</p>}
                            </div>

                            {/* Task Progress */}
                            {evt.tasks?.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-green-500" />
                                    {doneCount} / {totalCount} tasks complete
                                  </div>
                                  <span className="text-xs text-gray-500">{Math.round((doneCount / totalCount) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                                    style={{ width: `${(doneCount / totalCount) * 100}%` }}
                                    layout
                                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                                  />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {showEvents && totalPages > 1 && (
        <nav className="flex justify-center items-center gap-6 mt-12">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`rounded-full p-3 ${currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg'
              }`}
          >
            <ChevronLeft size={22} />
          </Button>

          <span className="text-indigo-700 text-lg font-semibold select-none">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className={`rounded-full p-3 ${currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg'
              }`}
          >
            <ChevronRight size={22} />
          </Button>
        </nav>
      )}

      {/* Event Modal */}
      {modalOpen && (
        <EventModal
          initial={selectedEvent}
          isOpen={modalOpen}
          onClose={setModalOpen} // this will close the modal when user clicks cancel or after save
        />
      )}
    </div>
  );
}

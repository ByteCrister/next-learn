'use client';

import { useEffect, useState, useMemo } from 'react';
import { useEventsStore } from '@/store/useEventsStore';
import { useBreadcrumbStore } from '@/store/useBreadcrumbStore';
import { VEvent } from '@/types/types.events';
import EventModal from './EventModal';
import EventsHeader from './EventsHeader';
import EventsStats from './EventsStats';
import EventsSort from './EventsSort';
import EventsList from './EventsList';
import EventsPagination from './EventsPagination';

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


export default function Events() {
  const { events, fetching, fetchEvents } = useEventsStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<VEvent | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('edit');

  const [currentPage, setCurrentPage] = useState(1);
  const [showEvents, setShowEvents] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('start');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchFocused, setSearchFocused] = useState(false);

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



  const openEventModal = (evt: VEvent, mode: 'view' | 'edit' = 'edit') => {
    setSelectedEvent(evt);
    setModalMode(mode);
    setModalOpen(true);
  };

  const stats = useMemo(() => {
    if (!events || !Array.isArray(events)) {
      return {
        total: 0,
        upcoming: 0,
        inProgress: 0,
        completed: 0,
      };
    }
    return {
      total: events.length,
      upcoming: events.filter(e => e.eventStatus === 'upcoming').length,
      inProgress: events.filter(e => e.eventStatus === 'inProgress').length,
      completed: events.filter(e => e.eventStatus === 'completed').length,
    };
  }, [events]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <EventsHeader />

        <EventsStats stats={stats} />

        <EventsSort
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortKey={sortKey}
          setSortKey={setSortKey}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          showEvents={showEvents}
          setShowEvents={setShowEvents}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <EventsList
          showEvents={showEvents}
          fetching={fetching}
          paginatedEvents={paginatedEvents}
          openEventModal={openEventModal}
        />

        <EventsPagination
          showEvents={showEvents}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {/* Event Modal */}
        {selectedEvent && (
          <EventModal
            initial={selectedEvent}
            isOpen={modalOpen}
            onClose={setModalOpen}
            mode={modalMode}
          />
        )}
      </div>
    </div>
  );
}
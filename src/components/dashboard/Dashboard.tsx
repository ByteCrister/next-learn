'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Sora } from 'next/font/google';
import Link from 'next/link';
import {
  Map,
  FileText,
  Calendar,
  PlusCircle,
  Link2,
  Bolt,
  Zap,
} from 'lucide-react';

import { useDashboardStore } from '@/store/useDashboardStore';
import { useEventsStore } from '@/store/useEventsStore';
import { useBreadcrumbStore } from '@/store/useBreadcrumbStore';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ExamQAction from './ExamQAction';
import SubjectQAction from './SubjectQAction';
import DashboardSkeleton from './DashboardSkeleton';

const CountUp = dynamic(() => import('react-countup'), { ssr: true });

const sora = Sora({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const palettes = [
  {
    id: 'tealBlue',
    gradient: 'bg-gradient-to-br from-teal-400/90 to-blue-500/90',
    border: 'border-teal-400',
    text: 'text-white',
    iconBg: 'bg-white/20 text-white',
  },
  {
    id: 'purplePink',
    gradient: 'bg-gradient-to-br from-purple-500/90 to-pink-500/90',
    border: 'border-purple-400',
    text: 'text-white',
    iconBg: 'bg-white/20 text-white',
  },
  {
    id: 'orangeYellow',
    gradient: 'bg-gradient-to-br from-orange-400/90 to-yellow-300/90',
    border: 'border-orange-300',
    text: 'text-white',
    iconBg: 'bg-white/30 text-white',
  },
  {
    id: 'indigoViolet',
    gradient: 'bg-gradient-to-br from-indigo-600/90 to-violet-500/90',
    border: 'border-indigo-400',
    text: 'text-white',
    iconBg: 'bg-white/20 text-white',
  },
];

export default function DashboardPage() {
  const {
    subjectsCount,
    routineCount,
    examCount,
    loadingDashboard,
    fetchDashboard,
  } = useDashboardStore();
  const { events, fetching: eventsLoading, fetchEvents } = useEventsStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const fetchedRef = useRef(false);

  // Fetch all data in one go
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchDashboard();
      fetchEvents();
      fetchedRef.current = true;
    }
    setBreadcrumbs([
      { label: 'Home', href: '/' },
      { label: 'Dashboard', href: '/dashboard' },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = new Date().toDateString();
  const todaysEvents = events.filter(
    (evt) => new Date(evt.start ?? '').toDateString() === today
  );

  const overviewCards = [
    { icon: <Map size={20} />, label: 'Subjects', value: subjectsCount, palette: palettes[0], route: '/subjects' },
    { icon: <FileText size={20} />, label: 'Routines', value: routineCount, palette: palettes[2], route: '/routines' },
    { icon: <Calendar size={20} />, label: 'Events', value: events.length, palette: palettes[3], route: '/events' },
    { icon: <Zap size={20} />, label: 'Exams', value: examCount, palette: palettes[1], route: '/exams' },
  ];

  const quickActions = [
    { label: 'Create Subject', icon: <PlusCircle size={18} />, palette: palettes[1], content: <SubjectQAction /> },
    { label: 'Add Routine', icon: <Link2 size={18} />, palette: palettes[3], content: <span className="text-sm text-gray-500">Will create soon</span> },
    { label: 'Create Exam', icon: <Zap size={18} />, palette: palettes[0], content: <ExamQAction /> },
  ];

  const isLoading = loadingDashboard || eventsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      className={`${sora.className} p-6 grid grid-cols-1 lg:grid-cols-4 gap-8 bg-gradient-to-br from-gray-50 to-white min-h-screen relative`}
      initial={false}
      animate={{ opacity: !isLoading ? 1 : 0.9, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated Skeleton Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col gap-6 p-6 bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      {!isLoading && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/events">
            <Card className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-400 to-red-400 opacity-80" />
              <CardHeader className="relative z-10">
                <CardTitle className="font-heading text-white text-xl">Today&apos;s Events</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-2">
                {!todaysEvents.length ? (
                  <p className="text-sm text-white/80">No events today</p>
                ) : (
                  todaysEvents.map((evt) => (
                    <div key={evt._id} className="flex justify-between items-center text-sm text-white">
                      <span>{evt.title}</span>
                      <Calendar size={16} className="text-white/80" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      )}

      {/* Main */}
      {!isLoading && (
        <div className="col-span-3 space-y-16">
          {/* Overview */}
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center mb-6 space-x-3">
              <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg shadow-lg text-white">
                <Bolt size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-heading text-slate-900 uppercase tracking-wide">Overview</h2>
                <span className="block mt-1 h-1 w-12 rounded-full bg-gradient-to-r from-primary-450 to-secondary-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {overviewCards.map(({ icon, label, value, palette, route }) => (
                <Link key={label} href={route} className="block">
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`${palette.gradient} cursor-pointer rounded-2xl backdrop-blur-md border border-white/20 shadow-lg`}
                  >
                    <CardHeader className="flex items-center gap-2 p-4 pb-0">
                      <div className={`p-2 rounded-full ${palette.iconBg}`}>{icon}</div>
                      <CardTitle className={`text-sm font-medium ${palette.text}`}>{label}</CardTitle>
                    </CardHeader>
                    <CardContent className={`text-3xl font-bold pt-2 pb-4 font-body ${palette.text}`}>
                      {typeof value === 'number' ? (
                        <CountUp
                          start={0}
                          end={value}
                          duration={1.5}
                          separator=","
                          decimals={value % 1 !== 0 ? 2 : 0}
                          preserveValue
                        />
                      ) : (
                        0
                      )}
                    </CardContent>
                  </motion.div>
                </Link>
              ))}
            </div>

          </motion.section>

          {/* Quick Actions */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            {/* Section heading */}
            <div className="flex items-center mb-4 sm:mb-6 space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-lg shadow-lg text-white flex-shrink-0">
                <Zap size={20} className="sm:size-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-heading text-slate-900 uppercase tracking-wide">
                  Quick Actions
                </h2>
                <span className="block mt-1 h-1 w-10 sm:w-12 rounded-full bg-gradient-to-r from-accent-300 to-primary-450" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {quickActions.map(({ label, icon, palette, content }, i) => (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className={`flex items-center justify-center border-2 ${palette.border} text-gray-800 
              hover:bg-opacity-10 rounded-xl shadow-md transition-all duration-300 backdrop-blur-sm 
              w-full sm:w-auto px-3 sm:px-4 py-3 sm:py-4`}
                    >
                      <div className="p-1 sm:p-1.5 rounded-full flex-shrink-0">{icon}</div>
                      <span className="ml-2 text-xs sm:text-sm md:text-base font-medium truncate">
                        {label}
                      </span>
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="p-4 sm:p-6 w-full max-w-lg rounded-xl shadow-lg border border-gray-200 bg-white backdrop-blur-md">
                    <DialogHeader>
                      <DialogTitle className="text-base sm:text-lg font-semibold text-gray-800">
                        {label}
                      </DialogTitle>
                      <DialogDescription className="text-gray-500 text-xs sm:text-sm">
                        Fill in the required details below.
                      </DialogDescription>
                    </DialogHeader>
                    {content}
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </motion.section>

        </div>
      )}
    </motion.div>
  );
}

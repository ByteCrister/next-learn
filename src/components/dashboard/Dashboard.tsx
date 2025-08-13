'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Sora } from 'next/font/google';
const CountUp = dynamic(() => import('react-countup'), { ssr: false });

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
import Link from 'next/link';

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

const sora = Sora({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function DashboardPage() {
  const router = useRouter();

  const {
    subjectsCount,
    routineCount,
    user,
    loading,
    fetchDashboard,
  } = useDashboardStore();
  const { events, eventsLoading, fetchEvents } = useEventsStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    if (!user) {
      fetchDashboard();
      fetchEvents();
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
    {
      icon: <Map size={20} />,
      label: 'Subjects',
      value: subjectsCount,
      palette: palettes[0],
      route: '/subjects',
    },
    {
      icon: <FileText size={20} />,
      label: 'Routines',
      value: routineCount,
      palette: palettes[2],
      route: '/routines',
    },
    {
      icon: <Calendar size={20} />,
      label: 'Upcoming',
      value: events.length,
      palette: palettes[3],
      route: '/events',
    },
  ];

  const quickActions = [
    {
      label: 'Create Subject',
      icon: <PlusCircle size={18} />,
      route: '/subjects/new',
      palette: palettes[1],
    },
    {
      label: 'Add Routine',
      icon: <Link2 size={18} />,
      route: '/routines/new',
      palette: palettes[3],
    },
  ];

  return (
    <motion.div
      className={`${sora.className} p-6 grid grid-cols-1 lg:grid-cols-4 gap-8 bg-gradient-to-br from-gray-50 to-white min-h-screen`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Sidebar */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/events">
          <Card className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-400 to-red-400 opacity-80" />
            <CardHeader className="relative z-10">
              <CardTitle className="font-heading text-white text-xl">
                Today’s Events
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-2">
              {eventsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full bg-white/30" />
                ))
              ) : !todaysEvents.length ? (
                <p className="text-sm text-white/80">No events today</p>
              ) : (
                todaysEvents.map((evt) => (
                  <div
                    key={evt._id}
                    className="flex justify-between items-center text-sm text-white"
                  >
                    <span>{evt.title}</span>
                    <Calendar size={16} className="text-white/80" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      {/* Main Section */}
      <div className="col-span-3 space-y-16">
        {/* Overview */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-6 space-x-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg shadow-lg text-white">
              <Bolt size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-heading text-slate-900 uppercase tracking-wide">
                Overview
              </h2>
              <span className="block mt-1 h-1 w-12 rounded-full bg-gradient-to-r from-primary-450 to-secondary-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {overviewCards.map(({ icon, label, value, palette, route }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => router.push(route)}
                className={`${palette.gradient} cursor-pointer rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg transition-all duration-300`}
              >
                <CardHeader className="flex items-center gap-2 p-4 pb-0">
                  <div className={`p-2 rounded-full ${palette.iconBg}`}>{icon}</div>
                  <CardTitle className={`text-sm font-medium ${palette.text}`}>
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent className={`text-3xl font-bold pt-2 pb-4 font-body ${palette.text}`}>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <CountUp
                      start={0}
                      end={typeof value === 'number' ? value : 0}
                      duration={1.5}
                      separator=","
                      decimals={typeof value === 'number' && value % 1 !== 0 ? 2 : 0}
                    />
                  )}
                </CardContent>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-6 space-x-3">
            <div className="p-2 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-lg shadow-lg text-white">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-heading text-slate-900 uppercase tracking-wide">
                Quick Actions
              </h2>
              <span className="block mt-1 h-1 w-12 rounded-full bg-gradient-to-r from-accent-300 to-primary-450" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {quickActions.map(({ label, icon, route, palette }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push(route)}
                  className={`
                    flex items-center justify-center
                    border-2 ${palette.border} ${palette.text}
                    hover:bg-opacity-10 rounded-xl shadow-md
                    transition-all duration-300 backdrop-blur-sm
                  `}
                >
                  <div className="text-neutral-700 p-1 rounded-full">{icon}</div>
                  <span className="ml-2 text-sm font-medium text-neutral-700">
                    {label}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

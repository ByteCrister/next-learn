'use client';

import { motion, Variants } from 'framer-motion';
import CountUp from 'react-countup';
import Link from 'next/link';
import {
    BookOpen as SubjectIcon,
    User as UserIcon,
    ClipboardList as TaskIcon,
    ListOrdered as ChaptersIcon,
} from 'lucide-react';
import { SubjectCounts as SubjectCountsTypes } from '@/types/types.subjects';
import clsx from 'clsx';

import { Inter } from 'next/font/google';
import SubjectBadgesSkeleton from './SubjectBadgesSkeleton';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '600'] });

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, type: 'tween', ease: 'easeOut' },
    }),
    hover: { scale: 1.03, transition: { duration: 0.3 } },
};

const badgeColors = [
    {
        lightBg: 'from-indigo-300 via-violet-400 to-indigo-500',
        darkBg: 'from-indigo-800 via-violet-800 to-indigo-900',
        iconBgLight: 'bg-indigo-50 text-indigo-600',
        iconBgDark: 'bg-indigo-900/40 text-indigo-200',
        borderColorLight: 'border-indigo-300',
        borderColorDark: 'border-indigo-800',
        focusRing: 'focus-visible:ring-indigo-200',
    },
    {
        lightBg: 'from-sky-300 via-cyan-400 to-sky-500',
        darkBg: 'from-sky-800 via-cyan-800 to-sky-900',
        iconBgLight: 'bg-sky-50 text-sky-600',
        iconBgDark: 'bg-sky-900/40 text-sky-200',
        borderColorLight: 'border-sky-300',
        borderColorDark: 'border-sky-800',
        focusRing: 'focus-visible:ring-sky-200',
    },
    {
        lightBg: 'from-emerald-300 via-teal-400 to-emerald-500',
        darkBg: 'from-emerald-800 via-teal-800 to-emerald-900',
        iconBgLight: 'bg-emerald-50 text-emerald-600',
        iconBgDark: 'bg-emerald-900/40 text-emerald-200',
        borderColorLight: 'border-emerald-300',
        borderColorDark: 'border-emerald-800',
        focusRing: 'focus-visible:ring-emerald-200',
    },
    {
        lightBg: 'from-pink-300 via-fuchsia-400 to-pink-500',
        darkBg: 'from-pink-800 via-fuchsia-800 to-pink-900',
        iconBgLight: 'bg-pink-50 text-pink-600',
        iconBgDark: 'bg-pink-900/40 text-pink-200',
        borderColorLight: 'border-pink-300',
        borderColorDark: 'border-pink-800',
        focusRing: 'focus-visible:ring-pink-200',
    },
];

interface Props {
    subjectCounts: SubjectCountsTypes | null;
    subjectId: string;
    loading: boolean;
}

const LINK_HREF: Record<string, string> = {
    notes: 'notes',
    externalLinks: 'external-links',
    studyMaterials: 'study-materials',
    chapters: 'chapters',
};

export default function SubjectBadges({ subjectId, subjectCounts, loading }: Props) {

    if (loading || !subjectCounts) {
        return (
            <SubjectBadgesSkeleton />
        );
    }
    return (
        <div
            className={clsx(
                'grid gap-6 grid-cols-1 md:grid-cols-[repeat(2,minmax(220px,1fr))]',
                inter.variable,
                'font-sans'
            )}
        >
            {Object.entries(subjectCounts).map(([key, count], idx) => {
                const {
                    lightBg,
                    darkBg,
                    iconBgLight,
                    iconBgDark,
                    borderColorLight,
                    borderColorDark,
                    focusRing,
                } = badgeColors[idx % badgeColors.length];

                const Icon =
                    {
                        notes: SubjectIcon,
                        externalLinks: TaskIcon,
                        studyMaterials: UserIcon,
                        chapters: ChaptersIcon,
                    }[key as keyof SubjectCountsTypes] || SubjectIcon;

                const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());

                const href = `/subjects/${subjectId}/${LINK_HREF[key] ?? ''}`;

                return (
                    <Link key={key} href={href} passHref>
                        <motion.div
                            custom={idx}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            className={clsx(
                                `relative flex flex-col justify-between p-6 rounded-xl
       bg-gradient-to-br ${lightBg} dark:${darkBg}
       border-l-4 ${borderColorLight} dark:${borderColorDark}
       shadow-lg dark:shadow-black/40
       min-h-[160px]
       text-gray-900 dark:text-gray-100
       transition-shadow cursor-pointer
       hover:shadow-2xl
       focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${focusRing}`
                            )}
                            aria-label={`Go to ${label}`}
                            tabIndex={0} // Make it keyboard focusable
                        >
                            {/* Icon */}
                            <div
                                className={clsx(
                                    'inline-flex items-center justify-center w-10 h-10 mb-4 rounded-full',
                                    iconBgLight,
                                    `dark:${iconBgDark}`
                                )}
                            >
                                <Icon className="w-6 h-6" strokeWidth={1.5} />
                            </div>

                            {/* Label */}
                            <div className="text-[0.85rem] font-medium tracking-wide text-slate-700 dark:text-slate-200 mb-2">
                                {label}
                            </div>

                            {/* Count */}
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <CountUp
                                    end={count as number}
                                    duration={1.5}
                                    separator=","
                                    className="text-3xl font-bold leading-none text-slate-950 dark:text-slate-100"
                                />
                            </motion.div>
                        </motion.div>
                    </Link>

                );
            })}
        </div>
    );
}

import { motion, Variants } from 'framer-motion'
import CountUp from 'react-countup'
import Link from 'next/link'
import {
    BookOpen as SubjectIcon,
    User as UserIcon,
    ClipboardList as TaskIcon,
} from 'lucide-react'
import { SubjectCounts as SubjectCountsTypes } from '@/types/types.subjects'

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, type: 'spring', stiffness: 120 },
    }),
}

const badgeBackgrounds = [
    'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
    'bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600',
    'bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600',
]

interface Props {
    subjectCounts: SubjectCountsTypes
    subjectId: string;
}

const HREF = {
    '0': 'notes',
    '1': 'external-inks',
    '2': 'study-materials',
}

export default function SubjectBadges({ subjectId, subjectCounts }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(subjectCounts).map(([key, count], idx) => {
                const Icon =
                    { notes: SubjectIcon, externalLinks: TaskIcon, studyMaterials: UserIcon }[
                    key as keyof SubjectCountsTypes
                    ] || SubjectIcon

                const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())

                const href = `/subjects/${subjectId}/${HREF[key as keyof typeof HREF]}`

                return (
                    <Link key={key} href={href} legacyBehavior={false}>
                        <motion.div
                            custom={idx}
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            whileHover="hover"
                            whileTap={{ scale: 0.97 }}
                            className={`
                relative flex items-center space-x-4
                p-4 sm:p-6 lg:p-8
                rounded-3xl
                text-white
                overflow-hidden
                ${badgeBackgrounds[idx % badgeBackgrounds.length]}
                shadow-lg
                ring-1 ring-white/20
                transition-transform
                cursor-pointer
                group
              `}
                            role="link"
                            tabIndex={0}
                        >
                            {/* Frosted Overlay */}
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-70 transition-opacity" />

                            {/* Icon */}
                            <div className="relative z-10 flex-shrink-0 p-2 bg-white/20 rounded-full">
                                <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                            </div>

                            {/* Label & Count */}
                            <div className="relative z-10 flex-1">
                                <div className="text-sm uppercase tracking-wide opacity-80">
                                    {label}
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    <CountUp
                                        end={count as number}
                                        duration={1.2}
                                        separator=","
                                        className="text-2xl sm:text-3xl font-bold"
                                    />
                                </motion.div>
                            </div>

                            {/* Ripple Effect */}
                            <motion.span
                                className="absolute inset-0 bg-white/20 rounded-3xl"
                                variants={{
                                    hover: { scale: 1.05, opacity: 0 },
                                }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                            />
                        </motion.div>
                    </Link>
                )
            })}
        </div>
    )
}

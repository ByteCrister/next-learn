import { motion } from 'framer-motion'
import { Calendar, Clock, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const statCardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12 },
  }),
} as const

const colorMap: Record<string, { accent: string; glow: string; icon: string }> = {
  blue: {
    accent: 'from-blue-400/40 to-blue-600/40',
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.45)]',
    icon: 'text-blue-600',
  },
  cyan: {
    accent: 'from-cyan-400/40 to-cyan-600/40',
    glow: 'shadow-[0_0_25px_rgba(6,182,212,0.45)]',
    icon: 'text-cyan-600',
  },
  amber: {
    accent: 'from-amber-400/40 to-amber-600/40',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.45)]',
    icon: 'text-amber-600',
  },
  emerald: {
    accent: 'from-emerald-400/40 to-emerald-600/40',
    glow: 'shadow-[0_0_25px_rgba(16,185,129,0.45)]',
    icon: 'text-emerald-600',
  },
}

interface EventsStatsProps {
  stats: {
    total: number
    upcoming: number
    inProgress: number
    completed: number
  }
}

export default function EventsStats({ stats }: EventsStatsProps) {
  const items = [
    { label: 'Total Events', value: stats.total, icon: Calendar, color: 'blue' },
    { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'cyan' },
    { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'amber' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'emerald' },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
    >
      {items.map((stat, i) => {
        const Icon = stat.icon
        const colors = colorMap[stat.color]

        return (
          <motion.div
            key={i}
            custom={i}
            variants={statCardVariants}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <Card
              className={`relative rounded-2xl overflow-hidden border border-white/30 backdrop-blur-xl bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:border-white/50 hover:shadow-2xl ${colors.glow}`}
            >
              {/* Glow gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colors.accent} opacity-20 pointer-events-none`} />

              {/* Gloss reflection */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent mix-blend-overlay opacity-50" />

              <CardContent className="relative px-6 py-2">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs text-blue-600 font-semibold tracking-wider uppercase mb-2">
                      {stat.label}
                    </p>
                    <p className="text-6xl font-bold text-blue-600 drop-shadow-md">{stat.value}</p>
                  </div>

                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="p-4 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-md"
                  >
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
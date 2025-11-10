// components/BackgroundFX.tsx
'use client'

import { motion } from 'framer-motion'

export function BackgroundFX() {
    return (
        <div className="pointer-events-none absolute inset-0 -z-10">
            {/* Base vertical gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020] via-[#0A0F1A] to-[#090B12]" />

            {/* Radial color washes */}
            <div className="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]">
                <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(99,102,241,0.25),transparent)]" />
            </div>
            <div className="absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_100%,black,transparent)]">
                <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_100%,rgba(236,72,153,0.18),transparent)]" />
            </div>

            {/* Animated blobs */}
            <motion.div
                aria-hidden
                className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/25 via-fuchsia-500/20 to-sky-400/20 blur-3xl"
                animate={{ x: [0, 30, -10, 0], y: [0, 10, -15, 0], scale: [1, 1.08, 1, 1] }}
                transition={{ duration: 24, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />
            <motion.div
                aria-hidden
                className="absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/20 via-violet-400/20 to-cyan-400/20 blur-3xl"
                animate={{ x: [0, -20, 15, 0], y: [0, -10, 10, 0], scale: [1, 1.05, 0.98, 1] }}
                transition={{ duration: 28, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />

            {/* Subtle grid overlay */}
            <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
                style={{
                    backgroundImage:
                        `linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)`,
                    backgroundSize: '28px 28px',
                }}
            />
            {/* Soft noise */}
            <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 opacity=%220.6%22 viewBox=%220 0 100 100%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
        </div>
    )
}

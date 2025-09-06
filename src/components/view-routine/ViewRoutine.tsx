'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import {
    FiAlertCircle,
    FiCalendar,
    FiClock,
    FiBook,
    FiRefreshCw,
    FiCheck,
    FiShare2,
    FiUser,
    FiMapPin,
} from 'react-icons/fi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import api from '@/utils/api/api.client'
import SkeletonTable from './SkeletonTable'
import axios from 'axios'
import { RoutineResponseDto, SlotDto } from '@/types/types.routine'
import { encodeId } from '@/utils/helpers/IdConversion'

type PageProps = { params: { routineId: string; shareId: string } }
type ApiResponse = { routine: RoutineResponseDto } | { routine: RoutineResponseDto[] }

export default function ViewRoutine({ params }: PageProps) {
    const { routineId, shareId } = params
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [routine, setRoutine] = useState<RoutineResponseDto | null>(null)
    const [copied, setCopied] = useState(false)
    const [showShareDialog, setShowShareDialog] = useState(false)

    const fetchRoutine = useCallback(async () => {
        setLoading(true)
        setErrorMsg(null)
        try {
            const res = await api.get<ApiResponse>('/routines/view', { params: { routineId, shareId } })
            const data: ApiResponse = res.data
            const r = Array.isArray(data.routine) ? data.routine[0] ?? null : data.routine
            if (!r) throw new Error('Routine not found')
            setRoutine(r)
        } catch (err: unknown) {
            let msg = 'Failed to load routine'
            if (axios.isAxiosError(err)) msg = err.response?.data?.message || err.message || msg
            else if (err instanceof Error) msg = err.message
            setErrorMsg(msg)
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }, [routineId, shareId])

    useEffect(() => {
        fetchRoutine()
    }, [fetchRoutine])

    const handleShare = async () => {
        if (!routine) return
        try {
            const encodedRoutineId = encodeId(routine.id)
            const encodedShareId = encodeId(routine.shareId)
            const url = `${window.location.origin}/view-routine/${encodedRoutineId}/${encodedShareId}`
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy link:', err)
        }
    }

    function weekdayName(n: number) {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][n] ?? `Day ${n}`
    }

    function RoutineSlot({ slot }: { slot: SlotDto }) {
        return (
            <Card className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-indigo-900">{slot.subject}</span>
                        <span className="text-xs text-indigo-700">{slot.startTime}–{slot.endTime}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center text-xs text-indigo-700">
                        <span className="flex items-center gap-1">
                            <FiUser /> {slot.teacher || '-'}
                        </span>
                        {slot.room && (
                            <Badge variant="secondary" className="flex items-center gap-1 text-[11px]">
                                <FiMapPin /> {slot.room}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            {/* Header */}
            <div className="relative w-full bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-400 text-white shadow-lg">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none" />
                <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 backdrop-blur-sm bg-white/5 rounded-b-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full">
                            <FiCalendar className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm">{routine?.title ?? 'Routine'}</h1>
                            <p className="text-sm opacity-90">{routine?.description ?? 'Weekly schedule with subjects, teachers, and rooms.'}</p>
                        </div>
                    </div>
                    {routine && (
                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
                            <span className="inline-flex items-center gap-1">
                                <FiClock /> Last updated: {routine.updatedAt ? new Date(routine.updatedAt).toLocaleString() : '—'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <FiBook /> Days: {routine.days.length}
                            </span>

                            {/* Share dialog using AlertDialog */}
                            <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                                <AlertDialogTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-white shadow-sm hover:bg-white/20 transition"
                                    >
                                        {copied ? <FiCheck className="text-green-400" /> : <FiShare2 />}
                                        {copied ? 'Copied!' : 'Share'}
                                    </motion.button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Share Routine</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Copy the link below to share your routine.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex gap-2 mt-4">
                                        <input
                                            type="text"
                                            readOnly
                                            value={`${window.location.origin}/view-routine/${encodeId(routine.id)}/${encodeId(routine.shareId)}`}
                                            className="flex-1 border px-3 py-2 rounded-md text-sm"
                                        />
                                        <Button onClick={handleShare}>
                                            {copied ? <FiCheck /> : <FiShare2 />}
                                        </Button>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Close</AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-6">
                {loading && <SkeletonTable headerCount={6} rowCount={7} />}

                {!loading && (errorMsg || !routine) && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center bg-muted/10">
                        <FiAlertCircle className="mb-3 h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Routine not found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{errorMsg ?? 'Unavailable right now.'}</p>
                        <Button className="mt-5" onClick={fetchRoutine}>
                            <FiRefreshCw className="mr-2 h-4 w-4" /> Retry
                        </Button>
                    </div>
                )}

                {!loading && routine && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="grid gap-5"
                        >
                            {routine.days.map((day) => (
                                <Card
                                    key={day.dayOfWeek}
                                    className="overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all border-l-4"
                                    style={{ borderColor: `hsl(${day.dayOfWeek * 50}, 70%, 50%)` }}
                                >
                                    <CardHeader className="bg-muted/10 flex items-center justify-between px-4 py-2">
                                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                            <FiCalendar /> {weekdayName(day.dayOfWeek)}
                                        </CardTitle>
                                        <Badge variant="secondary">
                                            {day.slots.length} {day.slots.length === 1 ? 'slot' : 'slots'}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="p-4 flex flex-col gap-3">
                                        {day.slots.length === 0 && (
                                            <div className="text-sm text-muted-foreground italic">No slots</div>
                                        )}
                                        {day.slots.map((slot, idx) => (
                                            <motion.div
                                                key={`${day.dayOfWeek}-${idx}`}
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                            >
                                                <RoutineSlot slot={slot} />
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}

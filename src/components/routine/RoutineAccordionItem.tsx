'use client'

import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBook, FiCalendar, FiCheck, FiClock, FiEdit2, FiMapPin, FiShare2, FiTrash2, FiUser } from 'react-icons/fi'
import { RoutineResponseDto } from '@/types/types.routine'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { useState } from 'react'
import { encodeId } from '@/utils/helpers/IdConversion'

type Props = {
    routine: RoutineResponseDto
    onEdit: () => void
    onDelete: () => void
    isMutating: boolean
}

export default function RoutineAccordionItem({
    routine,
    onEdit,
    onDelete,
    isMutating,
}: Props) {
    const totalSlots = routine.days.reduce((acc, d) => acc + d.slots.length, 0);

    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        try {
            const encodedRoutineId = encodeId(routine.id)
            const encodedShareId = encodeId(routine.shareId)
            const url = `${window.location.origin}/view-routine/${encodedRoutineId}/${encodedShareId}`
            console.log(routine);
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000) // reset after 2s
        } catch (err) {
            console.error('Failed to copy link:', err)
        }
    }

    return (
        <AccordionItem value={routine.id} className="px-2">
            <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex w-full items-center justify-between gap-4">
                    <div className="text-left">
                        <div className="font-medium">{routine.title}</div>
                        <div className="text-xs text-muted-foreground">
                            {routine.description || 'No description'}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">{totalSlots} slots</Badge>
                        <Badge variant="outline">
                            Updated {new Date(routine.updatedAt).toLocaleDateString()}
                        </Badge>

                        {/* Share button */}
                        <motion.div
                            onClick={(e) => {
                                e.stopPropagation()
                                handleShare()
                            }} whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="rounded-md border border-indigo-500/30 bg-indigo-50 px-2 py-1 text-indigo-600 shadow-sm hover:bg-indigo-100"
                            title="Copy share link"
                        >
                            {copied ? (
                                <FiCheck className="text-green-600" />
                            ) : (
                                <FiShare2 className="text-indigo-600" />
                            )}
                        </motion.div>
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent>
                <AnimatePresence initial={false}>
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="rounded-lg bg-muted/30 p-4"
                    >
                        {routine.days.length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                                No days configured.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            <th className="border px-3 py-2 text-left">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar className="text-indigo-600" /> Day
                                                </div>
                                            </th>
                                            <th className="border px-3 py-2 text-left">
                                                <div className="flex items-center gap-2">
                                                    <FiBook className="text-indigo-600" /> Subject
                                                </div>
                                            </th>
                                            <th className="border px-3 py-2 text-left">
                                                <div className="flex items-center gap-2">
                                                    <FiClock className="text-green-600" /> Start
                                                </div>
                                            </th>
                                            <th className="border px-3 py-2 text-left">
                                                <div className="flex items-center gap-2">
                                                    <FiClock className="text-red-600" /> End
                                                </div>
                                            </th>
                                            <th className="border px-3 py-2 text-left">
                                                <div className="flex items-center gap-2">
                                                    <FiUser className="text-purple-600" /> Teacher
                                                </div>
                                            </th>
                                            <th className="border px-3 py-2 text-left">
                                                <div className="flex items-center gap-2">
                                                    <FiMapPin className="text-orange-600" /> Room
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {routine.days.map((day) =>
                                            day.slots.length > 0 ? (
                                                day.slots.map((slot, idx) => (
                                                    <tr key={`${day.dayOfWeek}-${idx}`} className="bg-card">
                                                        {idx === 0 && (
                                                            <td
                                                                rowSpan={day.slots.length}
                                                                className="border px-3 py-2 font-medium align-top"
                                                            >
                                                                {weekdayName(day.dayOfWeek)}
                                                            </td>
                                                        )}
                                                        <td className="border px-3 py-2">{slot.subject}</td>
                                                        <td className="border px-3 py-2">{slot.startTime}</td>
                                                        <td className="border px-3 py-2">{slot.endTime}</td>
                                                        <td className="border px-3 py-2">
                                                            {slot.teacher || '-'}
                                                        </td>
                                                        <td className="border px-3 py-2">
                                                            {slot.room || '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr key={day.dayOfWeek} className="bg-card">
                                                    <td className="border px-3 py-2 font-medium">
                                                        {weekdayName(day.dayOfWeek)}
                                                    </td>
                                                    <td
                                                        colSpan={5}
                                                        className="border px-3 py-2 text-muted-foreground"
                                                    >
                                                        No slots
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={onEdit}>
                                <FiEdit2 className="mr-2" /> Edit
                            </Button>
                            {/* Delete with confirmation modal */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={isMutating}
                                    >
                                        <FiTrash2 className="mr-2" /> Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Routine</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete <strong>{routine.title}</strong>?
                                            This action cannot be undone and will permanently remove the routine and all its slots.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={onDelete}
                                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                        >
                                            Yes, Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </AccordionContent>
        </AccordionItem>
    )
}

function weekdayName(n: number) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][n] ?? `Day ${n}`
}

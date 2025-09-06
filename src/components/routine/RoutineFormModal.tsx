'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
    FiPlus,
    FiTrash2,
    FiBookOpen,
    FiType,
    FiClock,
    FiMapPin,
    FiUser,
} from 'react-icons/fi'
import { RoutineResponseDto, DayRoutineDto, SlotDto } from '@/types/types.routine'
import { useRoutineStore } from '@/store/useRoutineStore'
import Image from 'next/image'
import { toast } from 'react-toastify'

type Props = {
    open: boolean
    onOpenChange: (o: boolean) => void
    editing: RoutineResponseDto | null
}


export default function RoutineFormModal({ open, onOpenChange, editing }: Props) {
    const isEdit = Boolean(editing)
    const { createRoutine, updateRoutine, isMutating } = useRoutineStore()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [days, setDays] = useState<DayRoutineDto[]>([])

    useEffect(() => {
        if (editing) {
            setTitle(editing.title)
            setDescription(editing.description ?? '')
            setDays(editing.days)
        } else {
            setTitle('')
            setDescription('')
            setDays([])
        }
    }, [editing, open])

    const canSubmit = useMemo(() => title.trim().length > 0, [title])

    const addDay = () => {
        const unused = Array.from({ length: 7 }, (_, i) => i).find(
            (d) => !days.some((x) => x.dayOfWeek === d)
        )
        if (unused === undefined) return
        setDays((prev) => [...prev, { dayOfWeek: unused, slots: [] }])
    }

    const removeDay = (dayOfWeek: number) => {
        setDays((prev) => prev.filter((d) => d.dayOfWeek !== dayOfWeek))
    }

    const addSlot = (dayOfWeek: number) => {
        setDays((prev) =>
            prev.map((d) =>
                d.dayOfWeek === dayOfWeek
                    ? {
                        ...d,
                        slots: [
                            ...d.slots,
                            {
                                startTime: '09:00',
                                endTime: '10:00',
                                subject: 'New Subject',
                            } as SlotDto,
                        ],
                    }
                    : d
            )
        )
    }

    const updateSlot = (dayOfWeek: number, index: number, patch: Partial<SlotDto>) => {
        setDays((prev) =>
            prev.map((d) =>
                d.dayOfWeek === dayOfWeek
                    ? {
                        ...d,
                        slots: d.slots.map((s, i) => (i === index ? { ...s, ...patch } : s)),
                    }
                    : d
            )
        )
    }

    const removeSlot = (dayOfWeek: number, index: number) => {
        setDays((prev) =>
            prev.map((d) =>
                d.dayOfWeek === dayOfWeek
                    ? { ...d, slots: d.slots.filter((_, i) => i !== index) }
                    : d
            )
        )
    }

    const validateRoutine = (): string | null => {
        // Title validations
        if (!title.trim()) return 'Title is required';
        if (title.length > 100) return 'Title cannot exceed 100 characters';

        // Description validations
        if (description.length > 500) return 'Description cannot exceed 500 characters';

        // Days validations
        if (days.length === 0) return 'Add at least one day';
        const daySet = new Set<number>();
        for (const d of days) {
            if (daySet.has(d.dayOfWeek)) return `Duplicate day: ${weekdayName(d.dayOfWeek)}`;
            daySet.add(d.dayOfWeek);

            // Slots validations
            if (d.slots.length === 0) return `Add at least one slot for ${weekdayName(d.dayOfWeek)}`;

            // Track slot times to check overlaps
            const slotTimes: [number, number][] = [];

            for (const s of d.slots) {
                // Subject validations
                if (!s.subject.trim()) return `Subject is required in ${weekdayName(d.dayOfWeek)}`;
                if (s.subject.length > 100) return `Subject cannot exceed 100 characters in ${weekdayName(d.dayOfWeek)}`;

                // Optional teacher and room validations
                if (s.teacher && s.teacher.length > 50) return `Teacher name cannot exceed 50 characters in ${weekdayName(d.dayOfWeek)}`;
                if (s.room && s.room.length > 50) return `Room name cannot exceed 50 characters in ${weekdayName(d.dayOfWeek)}`;

                // Time format validations
                if (!s.startTime || !/^\d{2}:\d{2}$/.test(s.startTime)) return `Valid start time required in ${weekdayName(d.dayOfWeek)}`;
                if (!s.endTime || !/^\d{2}:\d{2}$/.test(s.endTime)) return `Valid end time required in ${weekdayName(d.dayOfWeek)}`;

                const [startH, startM] = s.startTime.split(':').map(Number);
                const [endH, endM] = s.endTime.split(':').map(Number);

                // Ensure startTime < endTime
                if (startH > endH || (startH === endH && startM >= endM))
                    return `Start time must be before end time in ${weekdayName(d.dayOfWeek)}`;

                const startMinutes = startH * 60 + startM;
                const endMinutes = endH * 60 + endM;

                // Check overlapping slots
                for (const [sStart, sEnd] of slotTimes) {
                    if (startMinutes < sEnd && endMinutes > sStart)
                        return `Slot times overlap in ${weekdayName(d.dayOfWeek)}`;
                }

                slotTimes.push([startMinutes, endMinutes]);
            }
        }

        return null; // Valid
    };


    const onSubmit = async () => {
        if (!canSubmit) return
        const error = validateRoutine();
        if (error) {
            toast.warning(error);
            return;
        }
        if (isEdit && editing) {
            await updateRoutine(editing.id, { title, description, days })
        } else {
            await createRoutine({ title, description, days })
        }
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 space-y-6"
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-indigo-600">
                            <Image
                                src={isEdit ? "/images/routines/pages.png" : "/images/routines/schedule.png"}
                                alt={isEdit ? "Edit Routine" : "Create Routine"}
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            {isEdit ? "Edit Routine" : "Create Routine"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2">
                                <FiBookOpen /> Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Fall Semester Schedule"
                                className="focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2">
                                <FiType /> Description
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Optional"
                                className="focus-visible:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                            <FiClock /> Days & Slots
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addDay}
                            disabled={days.length >= 7}
                            className="flex items-center gap-2 hover:bg-indigo-50"
                        >
                            <FiPlus /> Add day
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {days.length === 0 ? (
                            <div className="text-sm text-muted-foreground italic">
                                No days added yet. Click <strong>Add day</strong> to start.
                            </div>
                        ) : (
                            days
                                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                                .map((d) => (
                                    <div
                                        key={d.dayOfWeek}
                                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="text-sm font-semibold text-slate-700">
                                                {weekdayName(d.dayOfWeek)}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeDay(d.dayOfWeek)}
                                                className="text-red-500 hover:text-red-600 flex items-center gap-1"
                                            >
                                                <FiTrash2 /> Remove day
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            {d.slots.map((s, i) => (
                                                <div
                                                    key={i}
                                                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4"
                                                >
                                                    {/* Row 1: Subject + Teacher */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="flex flex-col">
                                                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                                <FiBookOpen className="text-slate-400" /> Subject
                                                            </label>
                                                            <Input
                                                                value={s.subject}
                                                                onChange={(e) => updateSlot(d.dayOfWeek, i, { subject: e.target.value })}
                                                                placeholder="e.g., Mathematics"
                                                                className="mt-1 h-10"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                                <FiUser className="text-slate-400" /> Teacher
                                                            </label>
                                                            <Input
                                                                value={s.teacher ?? ""}
                                                                onChange={(e) => updateSlot(d.dayOfWeek, i, { teacher: e.target.value })}
                                                                placeholder="e.g., Mr. Rahman"
                                                                className="mt-1 h-10"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Row 2: Time + Room */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="flex flex-col">
                                                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                                <FiClock className="text-slate-400" /> Start Time
                                                            </label>
                                                            <Input
                                                                type="time" // <-- Add this
                                                                value={s.startTime}
                                                                onChange={(e) => updateSlot(d.dayOfWeek, i, { startTime: e.target.value })}
                                                                className="mt-1 h-10"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                                <FiClock className="text-slate-400" /> End Time
                                                            </label>
                                                            <Input
                                                                type="time" // <-- Add this
                                                                value={s.endTime}
                                                                onChange={(e) => updateSlot(d.dayOfWeek, i, { endTime: e.target.value })}
                                                                className="mt-1 h-10"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                                <FiMapPin className="text-slate-400" /> Room
                                                            </label>
                                                            <Input
                                                                value={s.room ?? ""}
                                                                onChange={(e) => updateSlot(d.dayOfWeek, i, { room: e.target.value })}
                                                                placeholder="Room 101"
                                                                className="mt-1 h-10"
                                                            />
                                                        </div>
                                                    </div>


                                                    {/* Row 3: Actions */}
                                                    <div className="flex justify-end">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeSlot(d.dayOfWeek, i)}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <FiTrash2 /> Remove Slot
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addSlot(d.dayOfWeek)}
                                                className="flex items-center gap-2 hover:bg-indigo-50"
                                            >
                                                <FiPlus /> Add slot
                                            </Button>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>

                    <DialogFooter className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onSubmit}
                            disabled={!canSubmit || isMutating}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isEdit ? 'Save changes' : 'Create routine'}
                        </Button>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}

function weekdayName(n: number) {
    return (
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][n] ??
        `Day ${n}`
    )
}

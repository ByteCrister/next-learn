'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
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
  FiChevronRight,
} from 'react-icons/fi'
import { AiOutlineSchedule, AiOutlineCalendar } from 'react-icons/ai'
import { RoutineResponseDto, DayRoutineDto, SlotDto } from '@/types/types.routine'
import { useRoutineStore } from '@/store/useRoutineStore'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { PresetManager } from './PresetManager'
import { ComboPresetSelect } from './ComboPresetSelect'
import { usePresets } from '@/hooks/usePresets'

type Props = {
  editing?: RoutineResponseDto | null
  onCancel?: () => void
  onSuccess?: (routine?: RoutineResponseDto) => void
}

export default function RoutineFormPage({ editing = null, onCancel, onSuccess }: Props) {
  const isEdit = Boolean(editing)
  const { createRoutine, updateRoutine, isMutating } = useRoutineStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [days, setDays] = useState<DayRoutineDto[]>([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const routeKey = useMemo(() => (editing ? `routine:${editing.id}` : 'routine:new'), [editing?.id])

  const { add: _noopAdd } = usePresets(routeKey) // we will call add below to seed
  const seededRef = useRef<Record<string, boolean>>({})

  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setDescription(editing.description ?? '')
      setDays(editing.days ?? [])
    } else {
      setTitle('')
      setDescription('')
      setDays([])
    }
  }, [editing])

  useEffect(() => {
    if (!editing) return
    if (seededRef.current[routeKey]) return

    const subjects = new Set<string>()
    const teachers = new Set<string>()
    const rooms = new Set<string>()

    for (const d of editing.days ?? []) {
      for (const s of d.slots ?? []) {
        if (s.subject && s.subject.trim()) subjects.add(s.subject.trim())
        if (s.teacher && s.teacher.trim()) teachers.add(s.teacher.trim())
        if (s.room && s.room.trim()) rooms.add(s.room.trim())
      }
    }

    subjects.forEach((label) => _noopAdd('subject', label))
    teachers.forEach((label) => _noopAdd('teacher', label))
    rooms.forEach((label) => _noopAdd('room', label))

    seededRef.current[routeKey] = true
  }, [editing, routeKey, _noopAdd])

  const canSubmit = useMemo(() => title.trim().length > 0, [title])

  const addDay = () => {
    const unused = Array.from({ length: 7 }, (_, i) => i).find((d) => !days.some((x) => x.dayOfWeek === d))
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
        d.dayOfWeek === dayOfWeek ? { ...d, slots: d.slots.map((s, i) => (i === index ? { ...s, ...patch } : s)) } : d
      )
    )
  }

  const removeSlot = (dayOfWeek: number, index: number) => {
    setDays((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, slots: d.slots.filter((_, i) => i !== index) } : d)))
  }

  const validateRoutine = (): string | null => {
    if (!title.trim()) return 'Title is required'
    if (title.length > 100) return 'Title cannot exceed 100 characters'
    if (description.length > 500) return 'Description cannot exceed 500 characters'
    if (days.length === 0) return 'Add at least one day'
    const daySet = new Set<number>()
    for (const d of days) {
      if (daySet.has(d.dayOfWeek)) return `Duplicate day: ${weekdayName(d.dayOfWeek)}`
      daySet.add(d.dayOfWeek)
      if (!d.slots || d.slots.length === 0) return `Add at least one slot for ${weekdayName(d.dayOfWeek)}`
      const slotTimes: [number, number][] = []
      for (const s of d.slots) {
        if (!s.subject || !s.subject.trim()) return `Subject is required in ${weekdayName(d.dayOfWeek)}`
        if (s.subject.length > 100) return `Subject cannot exceed 100 characters in ${weekdayName(d.dayOfWeek)}`
        if (s.teacher && s.teacher.length > 50) return `Teacher name cannot exceed 50 characters in ${weekdayName(d.dayOfWeek)}`
        if (s.room && s.room.length > 50) return `Room name cannot exceed 50 characters in ${weekdayName(d.dayOfWeek)}`
        if (!s.startTime || !/^\d{2}:\d{2}$/.test(s.startTime)) return `Valid start time required in ${weekdayName(d.dayOfWeek)}`
        if (!s.endTime || !/^\d{2}:\d{2}$/.test(s.endTime)) return `Valid end time required in ${weekdayName(d.dayOfWeek)}`
        const [startH, startM] = s.startTime.split(':').map(Number)
        const [endH, endM] = s.endTime.split(':').map(Number)
        if (startH > endH || (startH === endH && startM >= endM)) return `Start time must be before end time in ${weekdayName(d.dayOfWeek)}`
        const startMinutes = startH * 60 + startM
        const endMinutes = endH * 60 + endM
        for (const [sStart, sEnd] of slotTimes) {
          if (startMinutes < sEnd && endMinutes > sStart) return `Slot times overlap in ${weekdayName(d.dayOfWeek)}`
        }
        slotTimes.push([startMinutes, endMinutes])
      }
    }
    return null
  }

  const onSubmit = async () => {
    if (!canSubmit) return
    const error = validateRoutine()
    if (error) {
      toast.warning(error)
      return
    }
    if (isEdit && editing) {
      await updateRoutine(editing.id, { title, description, days })
      toast.success('Routine updated successfully!')
      onSuccess?.(undefined)
    } else {
      await createRoutine({ title, description, days })
      toast.success('Routine created successfully!')
      onSuccess?.(undefined)
    }
  }

  return (
    <main className="max-w-4xl mx-auto font-sans antialiased text-slate-800">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
        <header className="flex items-start gap-4">
          <div className="rounded-md bg-indigo-50 p-2 flex items-center justify-center">
            <Image src={isEdit ? '/images/routines/pages.png' : '/images/routines/schedule.png'} alt={isEdit ? 'Edit Routine' : 'Create Routine'} width={36} height={36} className="w-9 h-9" />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-semibold leading-tight text-slate-900">{isEdit ? 'Edit Routine' : 'Create Routine'}</h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <AiOutlineSchedule className="text-slate-400" /> Build and manage weekly schedule
            </p>

          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" onClick={() => onCancel?.()} className="px-3 py-2">
              Cancel
            </Button>

            <Button onClick={onSubmit} disabled={!canSubmit || isMutating} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              {isEdit ? 'Save changes' : 'Create routine'} <FiChevronRight />
            </Button>
          </div>
        </header>
        {/* Inline Preset Manager (small) */}
        <PresetManager routeKey={routeKey} initialKind="subject" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiBookOpen className="text-slate-400" /> Title
            </Label>

            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Fall Semester Schedule" className="focus-visible:ring-indigo-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiType className="text-slate-400" /> Description
            </Label>

            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" className="focus-visible:ring-indigo-500" />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <AiOutlineCalendar className="text-indigo-500" /> Days & Slots
          </div>

          <div className="sm:hidden flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onSubmit} disabled={!canSubmit || isMutating}>
              {isEdit ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {days.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">No days added yet. Use the Add day button below to start.</div>
          ) : (
            days
              .slice()
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
              .map((d) => (
                <section key={d.dayOfWeek} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 font-medium">{weekdayName(d.dayOfWeek).slice(0, 3)}</div>

                      <div>
                        <div className="text-sm font-semibold text-slate-800">{weekdayName(d.dayOfWeek)}</div>
                        <div className="text-xs text-slate-500">Day overview</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => addSlot(d.dayOfWeek)} className="flex items-center gap-2">
                        <FiPlus /> Add slot
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => removeDay(d.dayOfWeek)} className="text-red-500 hover:text-red-600 flex items-center gap-2">
                        <FiTrash2 /> Remove day
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {d.slots.map((s, i) => (
                      <div key={i} className="rounded-lg border border-slate-100 p-4 bg-slate-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <FiBookOpen className="text-slate-400" /> Subject
                            </label>

                            <ComboPresetSelect
                              routeKey={routeKey}
                              kind="subject"
                              value={{ presetId: undefined, text: s.subject }}
                              onChange={(v) => updateSlot(d.dayOfWeek, i, { subject: v.text })}
                              placeholder="e.g., Mathematics"
                            />
                          </div>

                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <FiUser className="text-slate-400" /> Teacher
                            </label>

                            <ComboPresetSelect
                              routeKey={routeKey}
                              kind="teacher"
                              value={{ presetId: undefined, text: s.teacher ?? '' }}
                              onChange={(v) => updateSlot(d.dayOfWeek, i, { teacher: v.text })}
                              placeholder="e.g., Mr. Rahman"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <FiClock className="text-slate-400" /> Start Time
                            </label>

                            <Input type="time" value={s.startTime} onChange={(e) => updateSlot(d.dayOfWeek, i, { startTime: e.target.value })} className="mt-1 h-10" />
                          </div>

                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <FiClock className="text-slate-400" /> End Time
                            </label>

                            <Input type="time" value={s.endTime} onChange={(e) => updateSlot(d.dayOfWeek, i, { endTime: e.target.value })} className="mt-1 h-10" />
                          </div>

                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <FiMapPin className="text-slate-400" /> Room
                            </label>

                            <ComboPresetSelect
                              routeKey={routeKey}
                              kind="room"
                              value={{ presetId: undefined, text: s.room ?? '' }}
                              onChange={(v) => updateSlot(d.dayOfWeek, i, { room: v.text })}
                              placeholder="Room 101"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end mt-3">
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeSlot(d.dayOfWeek, i)} className="flex items-center gap-2">
                            <FiTrash2 /> Remove Slot
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
          )}
        </div>

        {/* Bottom action area — Add day + primary submit for convenience (responsive, non-sticky, no overflow) */}
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/80 backdrop-blur-md border border-slate-100 rounded-lg px-4 py-3 shadow-lg">
            {/* left group: actions and helper text */}
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 min-w-0">
              <div className="flex shrink-0 items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onCancel?.()}
                  className="px-3 py-2"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addDay}
                  disabled={days.length >= 7}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <FiPlus /> Add day
                </Button>
              </div>

              <div className="mt-1 text-sm text-slate-500 sm:mt-0 sm:ml-2 truncate">
                You can add up to 7 days
              </div>
            </div>

            {/* right group: preview + submit */}
            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end min-w-0">
              <div className="hidden sm:flex items-center gap-3 text-sm text-slate-500 mr-2 whitespace-nowrap">
                Preview
              </div>

              <div className="flex w-full gap-3 sm:w-auto sm:gap-3 items-center min-w-0">
                {/* compact preview label for very small screens */}
                <div className="flex items-center sm:hidden text-sm text-slate-500 whitespace-nowrap">
                  Preview
                </div>

                <div className="w-full sm:w-auto min-w-0">
                  <Button
                    onClick={onSubmit}
                    disabled={!canSubmit || isMutating}
                    className="flex w-full max-w-full items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 sm:w-auto"
                  >
                    <FiChevronRight />
                    <span className="truncate">{isEdit ? 'Save changes' : 'Create routine'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

function weekdayName(n: number) {
  return (['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][n] ?? `Day ${n}`)
}

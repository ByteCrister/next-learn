import { NextRequest, NextResponse } from 'next/server'
import Routine from '@/models/Routine'
import { Types } from 'mongoose'
import ConnectDB from '@/config/ConnectDB'
import { getUserIdFromSession } from '@/utils/helpers/session'
import { CreateRoutineDto, DayRoutineDto, RoutineResponseDto, SlotDto, UpdateRoutineDto } from '@/types/types.routine'

// Helper to get weekday name
function weekdayName(n: number) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][n] ?? `Day ${n}`
}

// Backend validation function
function validateRoutinePayload(payload: CreateRoutineDto): string | null {
    if (!payload.title || typeof payload.title !== 'string' || !payload.title.trim())
        return 'Title is required';
    if (payload.title.length > 100) return 'Title cannot exceed 100 characters';

    if (payload.description && payload.description.length > 500)
        return 'Description cannot exceed 500 characters';

    if (!Array.isArray(payload.days) || payload.days.length === 0)
        return 'Add at least one day';

    const daySet = new Set<number>();
    for (const d of payload.days as DayRoutineDto[]) {
        if (typeof d.dayOfWeek !== 'number') return 'Invalid dayOfWeek';
        if (daySet.has(d.dayOfWeek)) return `Duplicate day: ${weekdayName(d.dayOfWeek)}`;
        daySet.add(d.dayOfWeek);

        if (!Array.isArray(d.slots) || d.slots.length === 0)
            return `Add at least one slot for ${weekdayName(d.dayOfWeek)}`;

        const slotTimes: [number, number][] = [];

        for (const s of d.slots as SlotDto[]) {
            if (!s.subject || !s.subject.trim()) return `Subject is required in ${weekdayName(d.dayOfWeek)}`;
            if (s.subject.length > 100) return `Subject cannot exceed 100 characters in ${weekdayName(d.dayOfWeek)}`;
            if (s.teacher && s.teacher.length > 50)
                return `Teacher name cannot exceed 50 characters in ${weekdayName(d.dayOfWeek)}`;
            if (s.room && s.room.length > 50)
                return `Room name cannot exceed 50 characters in ${weekdayName(d.dayOfWeek)}`;

            if (!s.startTime || !/^\d{2}:\d{2}$/.test(s.startTime))
                return `Valid start time required in ${weekdayName(d.dayOfWeek)}`;
            if (!s.endTime || !/^\d{2}:\d{2}$/.test(s.endTime))
                return `Valid end time required in ${weekdayName(d.dayOfWeek)}`;

            const [startH, startM] = s.startTime.split(':').map(Number);
            const [endH, endM] = s.endTime.split(':').map(Number);

            if (startH > endH || (startH === endH && startM >= endM))
                return `Start time must be before end time in ${weekdayName(d.dayOfWeek)}`;

            const startMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;

            for (const [sStart, sEnd] of slotTimes) {
                if (startMinutes < sEnd && endMinutes > sStart)
                    return `Slot times overlap in ${weekdayName(d.dayOfWeek)}`;
            }

            slotTimes.push([startMinutes, endMinutes]);
        }
    }

    return null;
}

/**
 * GET /api/routines
 *  - Returns a list of routines for the current user
 */
export async function GET() {
    try {
        const userId = await getUserIdFromSession()
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        await ConnectDB()
        const docs = await Routine.find({ userId }).sort({ createdAt: -1 })

        const data: RoutineResponseDto[] = docs.map((doc) => ({
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            title: doc.title,
            description: doc.description,
            days: doc.days,
            shareId: doc.shareId,
            createdAt: doc.createdAt.toISOString(),
            updatedAt: doc.updatedAt.toISOString(),
        }))

        return NextResponse.json({ data }, { status: 200 })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        return NextResponse.json({ message }, { status: 400 })
    }
}

/**
 * POST /api/routines
 *  - Create a new routine
 *  - Body: CreateRoutineDto
 */
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserIdFromSession()
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const payload = (await req.json()) as CreateRoutineDto
        // Backend validation
        const error = validateRoutinePayload(payload)
        if (error) {
            return NextResponse.json({ message: error }, { status: 400 })
        }

        // Validation
        if (!payload.title || typeof payload.title !== 'string') {
            return NextResponse.json({ message: 'Title is required and must be a string' }, { status: 400 })
        }
        if (!payload.description || typeof payload.description !== 'string') {
            return NextResponse.json({ message: 'Description is required and must be a string' }, { status: 400 })
        }
        if (!Array.isArray(payload.days)) {
            return NextResponse.json({ message: 'Days must be an array' }, { status: 400 })
        }

        await ConnectDB()
        const created = await Routine.create({ ...payload, userId })

        const response: RoutineResponseDto = {
            id: created._id.toString(),
            userId: created.userId.toString(),
            title: created.title,
            description: created.description,
            days: created.days,
            shareId: created.shareId,
            createdAt: created.createdAt.toISOString(),
            updatedAt: created.updatedAt.toISOString(),
        }

        return NextResponse.json({ data: response }, { status: 201 })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        return NextResponse.json({ message }, { status: 400 })
    }
}

/**
 * PUT /api/routines
 *  - Update an existing routine
 *  - Body: { id: string } & UpdateRoutineDto
 */
export async function PUT(req: NextRequest) {
    try {
        const userId = await getUserIdFromSession()
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const body = (await req.json()) as UpdateRoutineDto & { id?: string }
        const { id, ...payload } = body

        if (!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid or missing id' }, { status: 400 })
        }

        // Validation
        if (payload.title && typeof payload.title !== 'string') {
            return NextResponse.json({ message: 'Title must be a string' }, { status: 400 })
        }
        if (payload.description && typeof payload.description !== 'string') {
            return NextResponse.json({ message: 'Description must be a string' }, { status: 400 })
        }
        if (payload.days) {
            if (!Array.isArray(payload.days)) {
                return NextResponse.json({ message: 'Days must be an array' }, { status: 400 })
            }

            for (const [i, day] of payload.days.entries()) {
                if (
                    typeof day.dayOfWeek !== 'number' ||
                    day.dayOfWeek < 0 ||
                    day.dayOfWeek > 6
                ) {
                    return NextResponse.json(
                        { message: `days[${i}].dayOfWeek must be an integer between 0 and 6` },
                        { status: 400 }
                    )
                }

                if (!Array.isArray(day.slots)) {
                    return NextResponse.json(
                        { message: `days[${i}].slots must be an array` },
                        { status: 400 }
                    )
                }
            }
        }


        await ConnectDB()
        const updated = await Routine.findOneAndUpdate(
            { _id: id, userId },
            payload,
            { new: true, runValidators: true }
        )

        if (!updated) {
            return NextResponse.json(
                { message: 'Not found or no permission to update' },
                { status: 404 }
            )
        }

        const response: RoutineResponseDto = {
            id: updated._id.toString(),
            userId: updated.userId.toString(),
            title: updated.title,
            description: updated.description,
            days: updated.days,
            shareId: updated.shareId,
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
        }

        return NextResponse.json({ data: response }, { status: 200 })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        return NextResponse.json({ message }, { status: 400 })
    }
}

/**
 * DELETE /api/routines
 *  - Delete a routine
 *  - Body: { id: string }
 */
export async function DELETE(req: NextRequest) {
    try {
        const userId = await getUserIdFromSession()
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = (await req.json()) as { id?: string }

        if (!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid or missing id' }, { status: 400 })
        }

        await ConnectDB()
        const deleted = await Routine.findOneAndDelete({ _id: id, userId })

        if (!deleted) {
            return NextResponse.json(
                { message: 'Not found or no permission to delete' },
                { status: 404 }
            )
        }

        const response: RoutineResponseDto = {
            id: deleted._id.toString(),
            userId: deleted.userId.toString(),
            title: deleted.title,
            description: deleted.description,
            days: deleted.days,
            shareId: deleted.shareId,
            createdAt: deleted.createdAt.toISOString(),
            updatedAt: deleted.updatedAt.toISOString(),
        }

        return NextResponse.json({ data: response }, { status: 200 })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        return NextResponse.json({ message }, { status: 400 })
    }
}

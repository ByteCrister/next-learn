import { NextRequest, NextResponse } from 'next/server'
import mongoose, { FlattenMaps, Require_id } from 'mongoose'
import type { RoutineResponseDto } from '@/types/types.routine'
import ConnectDB from '@/config/ConnectDB'
import Routine, { IRoutine } from '@/models/Routine'
import { getUserIdFromSession } from '@/utils/helpers/session'

type LeanRoutine = Require_id<FlattenMaps<IRoutine>>

function normalizeRoutine(doc: LeanRoutine): RoutineResponseDto {
    return {
        id: doc._id.toString(),
        userId: doc.userId?.toString() ?? '',
        shareId: doc.shareId,
        title: doc.title,
        description: doc.description,
        days: doc.days ?? [],
        createdAt: doc.createdAt
            ? new Date(doc.createdAt).toISOString()
            : new Date().toISOString(),
        updatedAt: doc.updatedAt
            ? new Date(doc.updatedAt).toISOString()
            : new Date().toISOString(),
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { routineId?: string } }
) {
    const id = decodeURIComponent(((await params)?.routineId ?? '').toString())
    if (!id) {
        return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    try {
        await ConnectDB()

        // getUserIdFromSession should accept NextRequest and return string | null
        const userId: string | null = await getUserIdFromSession()
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const isObjectId = mongoose.Types.ObjectId.isValid(id)
        let doc: LeanRoutine | null = null

        if (isObjectId) {
            doc = await Routine.findOne({ _id: id, userId }).lean<LeanRoutine | null>()
        }

        if (!doc) {
            doc = await Routine.findOne({ shareId: id, userId }).lean<LeanRoutine | null>()
        }

        if (!doc) {
            const exists = isObjectId
                ? await Routine.exists({ _id: id })
                : await Routine.exists({ shareId: id })

            if (exists) {
                return NextResponse.json(
                    { error: 'Forbidden: not the owner of this routine' },
                    { status: 403 }
                )
            }

            return NextResponse.json({ error: 'Routine not found' }, { status: 404 })
        }

        const payload: RoutineResponseDto = normalizeRoutine(doc)
        return NextResponse.json({ data: payload }, { status: 200 })
    } catch (err) {
        console.error('GET /routes/[id] error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

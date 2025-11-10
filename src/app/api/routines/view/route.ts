// app/api/routines/view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';
import Routine, { IRoutine } from '@/models/Routine';
import ConnectDB from '@/config/ConnectDB';
import { RoutineResponseDto } from '@/types/types.routine';

export async function GET(req: NextRequest) {

    function mapRoutineToDto(routine: IRoutine): RoutineResponseDto {
        return {
            id: (routine._id as Types.ObjectId).toString(),
            userId: routine.userId.toString(),
            shareId: routine.shareId,
            title: routine.title,
            description: routine.description,
            days: routine.days.map(d => ({
                dayOfWeek: d.dayOfWeek,
                slots: d.slots.map(s => ({
                    startTime: s.startTime,
                    endTime: s.endTime,
                    subject: s.subject,
                    teacher: s.teacher,
                    room: s.room,
                })),
            })),
            createdAt: routine.createdAt.toISOString(),
            updatedAt: routine.updatedAt.toISOString(),
        };
    }

    try {
        await ConnectDB();

        const url = new URL(req.url);
        const routineId = url.searchParams.get('routineId');
        const shareId = url.searchParams.get('shareId');

        if (!routineId || !shareId) {
            return NextResponse.json(
                { message: 'Both routineId and shareId are required' },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(routineId)) {
            return NextResponse.json(
                { message: 'Invalid routineId format' },
                { status: 400 }
            );
        }

        const routine = await Routine.findOne({
            _id: routineId,
            shareId: shareId,
        });

        if (!routine) {
            return NextResponse.json(
                { message: 'Routine not found' },
                { status: 404 }
            );
        }

        const routineDto: RoutineResponseDto = mapRoutineToDto(routine);

        return NextResponse.json({ routine: routineDto }, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        return NextResponse.json({ message }, { status: 400 });
    }
}

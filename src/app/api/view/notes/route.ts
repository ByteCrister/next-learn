import ConnectDB from "@/config/ConnectDB";
import { SubjectNote } from "@/models/SubjectNote";
import { Subject } from "@/models/Subject";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
    try {
        await ConnectDB();

        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get('subjectId');
        const noteId = searchParams.get('noteId');

        if (!subjectId || !noteId || !mongoose.isValidObjectId(subjectId) || !mongoose.isValidObjectId(noteId)) {
            return NextResponse.json(
                { message: 'Invalid or missing subjectId or noteId parameters' },
                { status: 400 }
            );
        }

        const note = await SubjectNote.findById(noteId)
            .select('title content createdAt updatedAt subjectId')
            .lean();

        if (!note || note.subjectId.toString() !== subjectId) {
            return NextResponse.json(
                { message: 'Note not found or does not belong to the subject' },
                { status: 404 }
            );
        }

        const subject = await Subject.findById(subjectId)
            .select('title code')
            .lean();

        if (!subject) {
            return NextResponse.json(
                { message: 'Subject not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            note,
            subject: {
                title: subject.title,
                code: subject.code,
            },
        });
    } catch (error) {
        console.error('API note fetch error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

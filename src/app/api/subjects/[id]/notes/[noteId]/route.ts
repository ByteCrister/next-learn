import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth/authOptions";
import connectDB from "@/config/ConnectDB";
import { SubjectNote } from "@/models/SubjectNote";
import { Subject } from "@/models/Subject";
import { Types } from "mongoose";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string; noteId: string }> }
) {
    try {
        const params = await context.params;
        const subjectId = params.id;
        const noteId = params.noteId;
        console.log('Received subjectId in PUT: ', subjectId, 'noteId: ', noteId);
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const userId = new Types.ObjectId(session.user.id);
        if (!Types.ObjectId.isValid(subjectId) || !Types.ObjectId.isValid(noteId)) {
            return NextResponse.json({ message: "Invalid subject ID or note ID" }, { status: 400 });
        }
        const dbSubjectId = new Types.ObjectId(subjectId);
        const dbNoteId = new Types.ObjectId(noteId);

        const subject = await Subject.findOne({ _id: dbSubjectId, userId });
        if (!subject) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        const note = await SubjectNote.findOne({ _id: dbNoteId, userId, subjectId: dbSubjectId });
        if (!note) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }

        const body = await request.json();
        const { title: noteTitle, content, attachments } = body;

        if (!content) {
            return NextResponse.json({ message: "Content is required" }, { status: 400 });
        }

        note.title = noteTitle;
        note.content = content;
        note.attachments = attachments || [];

        const updatedNote = await note.save();

        return NextResponse.json(updatedNote);
    } catch (error) {
        console.error("Error updating note:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string; noteId: string }> }
) {
    try {
        const params = await context.params;
        const subjectId = params.id;
        const noteId = params.noteId;
        console.log('Received subjectId in DELETE: ', subjectId, 'noteId: ', noteId);
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const userId = new Types.ObjectId(session.user.id);
        if (!Types.ObjectId.isValid(subjectId) || !Types.ObjectId.isValid(noteId)) {
            return NextResponse.json({ message: "Invalid subject ID or note ID" }, { status: 400 });
        }
        const dbSubjectId = new Types.ObjectId(subjectId);
        const dbNoteId = new Types.ObjectId(noteId);

        const subject = await Subject.findOne({ _id: dbSubjectId, userId });
        if (!subject) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        const note = await SubjectNote.findOneAndDelete({ _id: dbNoteId, userId, subjectId: dbSubjectId });
        if (!note) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

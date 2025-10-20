import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth/authOptions";
import connectDB from "@/config/ConnectDB";
import { SubjectNote } from "@/models/SubjectNote";
import { Subject } from "@/models/Subject";
import mongoose, { Types } from "mongoose";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const subjectId = params.id;
        console.log('Received subjectId in GET: ', subjectId, 'length: ', subjectId.length, 'isValid: ', Types.ObjectId.isValid(subjectId));
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const userId = new Types.ObjectId(session.user.id);
        if (!Types.ObjectId.isValid(subjectId)) {
            console.log('Invalid subjectId validation failed for: ', subjectId);
            return NextResponse.json({ message: "Invalid subject ID" }, { status: 400 });
        }
        const dbSubjectId = new Types.ObjectId(subjectId);

        const subject = await Subject.findOne({ _id: dbSubjectId, userId });
        if (!subject) {
            console.log(`Subject not found for subjectId: ${subjectId}, userId: ${userId}`);
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        if (page < 1 || limit < 1) {
            return NextResponse.json({ message: "Invalid page or limit" }, { status: 400 });
        }

        const skip = (page - 1) * limit;

        const notes = await SubjectNote.find({ subjectId: dbSubjectId, userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await SubjectNote.countDocuments({ subjectId: dbSubjectId, userId });
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({ 
            notes, 
            total, 
            totalPages,
            page 
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const subjectId = params.id;
        console.log('Received subjectId in POST: ', subjectId, 'length: ', subjectId.length, 'isValid: ', Types.ObjectId.isValid(subjectId));
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const userId = new Types.ObjectId(session.user.id);
        if (!Types.ObjectId.isValid(subjectId)) {
            console.log('Invalid subjectId validation failed for: ', subjectId);
            return NextResponse.json({ message: "Invalid subject ID" }, { status: 400 });
        }
        const dbSubjectId = new Types.ObjectId(subjectId);

        const subject = await Subject.findOne({ _id: dbSubjectId, userId });
        if (!subject) {
            console.log(`Subject not found for subjectId: ${subjectId}, userId: ${userId}`);
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        const body = await request.json();
        const { title: noteTitle, content, attachments } = body;

        if (!content) {
            return NextResponse.json({ message: "Content is required" }, { status: 400 });
        }

        const newNote = new SubjectNote({
            userId,
            subjectId: dbSubjectId,
            title: noteTitle,
            content,
            attachments: attachments || [],
        });

        const savedNote = await newNote.save();

        return NextResponse.json(savedNote, { status: 201 });
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

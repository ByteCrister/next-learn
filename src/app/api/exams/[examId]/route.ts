// src\app\api\exams\[examId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExamModel from "@/models/ExamModel";
import ConnectDB from "@/config/ConnectDB";
import { getUserIdFromSession } from "@/utils/helpers/session";
import ExamResultModel from "@/models/ExamResultModel";

async function ensureOwner(examId: string, userId: string) {
    if (!mongoose.isValidObjectId(examId)) {
        throw new Error("Invalid examId");
    }
    const exam = await ExamModel.findOne({ _id: examId, createdBy: userId });
    if (!exam) throw new Error("Not found or not yours");
    return exam;
}

export async function GET(
    _req: NextRequest,
    { params }: { params: { examId: string } }
) {
    try {
        await ConnectDB();
        const userId = await getUserIdFromSession();
        const exam = await ensureOwner(params.examId, userId);

        const results = await ExamResultModel.find({ exam: exam._id })
            .lean()
            .select("participantId participantEmail score status startedAt endedAt");

        return NextResponse.json({ ...exam.toObject(), results }, { status: 200 });
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 404 });
    }

}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { examId: string } }
) {
    try {
        await ConnectDB();
        const userId = await getUserIdFromSession();
        const updates = await req.json();

        const updated = await ExamModel.findOneAndUpdate(
            { _id: params.examId, createdBy: userId },
            updates,
            { new: true, runValidators: true }
        ).lean();

        if (!updated) throw new Error("Not found or not yours");
        return NextResponse.json(updated, { status: 200 });
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 404 });
    }

}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { examId: string } }
) {
    try {
        await ConnectDB();
        const userId = await getUserIdFromSession();
        const deleted = await ExamModel.findOneAndDelete({
            _id: params.examId,
            createdBy: userId,
        }).lean();

        if (!deleted) throw new Error("Not found or not yours");
        await ExamResultModel.deleteMany({ exam: deleted._id });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 404 });
    }
}

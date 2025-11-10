// src\app\api\exams\[examId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExamModel from "@/models/ExamModel";
import ConnectDB from "@/config/ConnectDB";
import { getUserIdFromSession } from "@/utils/helpers/session";
import ExamResultModel from "@/models/ExamResultModel";

type ContextType = {
    params: {
        examId: string;
    };
};

async function ensureOwner(examId: string, userId: string) {
    if (!mongoose.isValidObjectId(examId)) {
        throw new Error("Invalid examId");
    }
    const exam = await ExamModel.findOne({ _id: examId, createdBy: userId });
    if (!exam) throw new Error("Not found or not yours");
    return exam;
}

// * get a specific exam with the results
export async function GET(
    _req: NextRequest,
    context: unknown
) {
    try {
        await ConnectDB();
        const { examId } = (context as ContextType).params;;
        const userId = await getUserIdFromSession();
        const exam = await ensureOwner(examId, userId);

        // Include `answers` in the projection
        const results = await ExamResultModel.find({ exam: exam._id })
            .lean()
            .select(
                "participantId participantEmail score status startedAt endedAt answers"
            );

        return NextResponse.json(
            {
                ...exam.toObject(),
                results,
            },
            { status: 200 }
        );
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 404 });
    }
}

// * update a specific exams format/validation/questions/answers etc
export async function PATCH(
    req: NextRequest,
    context: unknown
) {
    try {
        await ConnectDB();
        const userId = await getUserIdFromSession();
        const updates = await req.json();
        const { examId } = (context as ContextType).params;

        const updated = await ExamModel.findOneAndUpdate(
            { _id: examId, createdBy: userId },
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

// * delete any specific question that created by that user
export async function DELETE(
    _req: NextRequest,
    context: unknown
) {
    try {
        await ConnectDB();
        const userId = await getUserIdFromSession();
        const deleted = await ExamModel.findOneAndDelete({
            _id: (context as ContextType).params.examId,
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

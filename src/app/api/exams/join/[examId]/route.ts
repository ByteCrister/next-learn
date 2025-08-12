/** after verifying examId, examCode user has to give this information */
// src/app/api/exams/join/[examId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import ExamModel from "@/models/ExamModel";
import ExamResultModel from "@/models/ExamResultModel";
import ConnectDB from "@/config/ConnectDB";
import { validateParticipantId } from "@/utils/helpers/validateParticipantId";

type StartExamSuccess = {
    success: true;
    message: "Exam session ready";
    data: {
        examId: string;
        examTitle: string;
        questions: unknown[];        // adjust to your Question type
        examResultId: string;
        startedAt: string;          // ISO string
    };
};

type StartExamError = {
    success: false;
    message: string;
};

export async function POST(
    req: NextRequest,
    { params }: { params: { examId: string } }
): Promise<NextResponse<StartExamSuccess | StartExamError>> {
    // 1) DB connection
    try {
        await ConnectDB();
    } catch (err) {
        console.error("[StartExam] DB connection error:", err);
        return NextResponse.json(
            { success: false, message: "Unable to connect to database" },
            { status: 500 }
        );
    }

    const examId = params.examId;
    // 2) Param validation
    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
        return NextResponse.json(
            { success: false, message: "Invalid examId parameter" },
            { status: 400 }
        );
    }

    // 3) Body parsing
    let body: { participantId: string; participantEmail: string; subjectCode: string };
    try {
        body = await req.json();
    } catch (err) {
        console.error("[StartExam] JSON parse error:", err);
        return NextResponse.json(
            { success: false, message: "Malformed request body" },
            { status: 400 }
        );
    }

    const { participantId, participantEmail, subjectCode } = body;
    // 4) Body fields validation
    if (
        !participantId ||
        !participantEmail ||
        !subjectCode ||
        typeof participantId !== "string" ||
        typeof participantEmail !== "string" ||
        typeof subjectCode !== "string"
    ) {
        return NextResponse.json(
            {
                success: false,
                message: "participantId, participantEmail, and subjectCode are required",
            },
            { status: 400 }
        );
    }

    // 5) Fetch exam
    let exam;
    try {
        exam = await ExamModel.findById(examId).lean();
    } catch (err) {
        console.error(`[StartExam] Error fetching exam ${examId}:`, err);
        return NextResponse.json(
            { success: false, message: "Error retrieving exam data" },
            { status: 500 }
        );
    }

    if (!exam) {
        return NextResponse.json(
            { success: false, message: "Exam not found" },
            { status: 404 }
        );
    }

    // 6) Subject code check
    if (exam.subjectCode !== subjectCode) {
        return NextResponse.json(
            { success: false, message: "Subject code mismatch" },
            { status: 401 }
        );
    }

    // 7) Participant ID rule check
    if (!validateParticipantId(participantId, exam.validationRule)) {
        return NextResponse.json(
            {
                success: false,
                message: "Participant ID does not meet validation requirements",
            },
            { status: 401 }
        );
    }

    const now = Date.now();
    // 8) Schedule checks
    if (exam.scheduledStartAt && now < new Date(exam.scheduledStartAt).getTime()) {
        return NextResponse.json(
            { success: false, message: "Exam has not started yet" },
            { status: 403 }
        );
    }
    if (exam.scheduledEndAt && now > new Date(exam.scheduledEndAt).getTime()) {
        return NextResponse.json(
            { success: false, message: "Exam has already ended" },
            { status: 403 }
        );
    }

    // 9) Find or create ExamResult
    let examResult;
    try {
        examResult = await ExamResultModel.findOne({
            exam: exam._id,
            participantId,
            status: { $in: ["in-progress", "submitted"] },
        });

        if (!examResult) {
            examResult = new ExamResultModel({
                exam: exam._id,
                participantId,
                participantEmail,
                startedAt: new Date(),
                totalQuestions: exam.questions.length,
                answers: [],
                status: "in-progress",
            });
            await examResult.save();
        }
    } catch (err) {
        console.error(
            `[StartExam] Error finding/creating examResult for ${participantId}:`,
            err
        );
        return NextResponse.json(
            { success: false, message: "Could not initialize exam session" },
            { status: 500 }
        );
    }

    // 10) Success response
    return NextResponse.json(
        {
            success: true,
            message: "Exam session ready",
            data: {
                examId: exam._id.toString(),
                examTitle: exam.title,
                questions: exam.questions,
                examResultId: (examResult._id as Types.ObjectId).toString(),
                startedAt: examResult.startedAt.toISOString(),
            },
        },
        { status: 200 }
    );
}

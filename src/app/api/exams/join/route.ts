/** to join on a exam user has to give this info first */
// src/app/api/exams/join/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExamModel from "@/models/ExamModel";
import ConnectDB from "@/config/ConnectDB";

type JoinExamSuccess = {
    success: true;
    message: "Exam code validated, you can join";
    data: {
        title: string;
        subjectCode: string;
    };
};

type JoinExamError = {
    success: false;
    message: string;
};

export async function POST(
    req: NextRequest
): Promise<NextResponse<JoinExamSuccess | JoinExamError>> {
    // 1) Connect to DB
    try {
        await ConnectDB();
    } catch (err) {
        console.error("[JoinExam] DB connection failed:", err);
        return NextResponse.json(
            { success: false, message: "Database connection failed" },
            { status: 500 }
        );
    }

    // 2) Parse & validate payload
    let body: { examId: string, examCode: string };
    try {
        body = await req.json();
    } catch (err) {
        console.error("[JoinExam] Invalid JSON body:", err);
        return NextResponse.json(
            { success: false, message: "Invalid JSON payload" },
            { status: 400 }
        );
    }

    const { examId, examCode } = body;
    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
        return NextResponse.json(
            { success: false, message: "Invalid or missing examId" },
            { status: 400 }
        );
    }
    if (!examCode || typeof examCode !== "string") {
        return NextResponse.json(
            { success: false, message: "Exam code is required" },
            { status: 400 }
        );
    }

    // 3) Lookup exam
    let exam;
    try {
        exam = await ExamModel.findById(examId).lean();
    } catch (err) {
        console.error(`[JoinExam] Error fetching exam ${examId}:`, err);
        return NextResponse.json(
            { success: false, message: "Error retrieving exam" },
            { status: 500 }
        );
    }

    if (!exam) {
        return NextResponse.json(
            { success: false, message: "Exam not found" },
            { status: 404 }
        );
    }

    // 4) Verify code
    if (exam.examCode !== examCode) {
        return NextResponse.json(
            { success: false, message: "Invalid exam code" },
            { status: 401 }
        );
    }

    // 5) Check schedule
    if (exam.scheduledEndAt) {
        const now = Date.now();
        const end = new Date(exam.scheduledEndAt).getTime();
        if (now > end) {
            return NextResponse.json(
                { success: false, message: "Exam has already ended" },
                { status: 403 }
            );
        }
    }

    // 6) Success
    return NextResponse.json(
        {
            success: true,
            message: "Exam code validated, you can join",
            data: {
                title: exam.title,
                subjectCode: exam.subjectCode,
            },
        },
        { status: 200 }
    );
}

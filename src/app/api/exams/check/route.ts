// pages/api/exams/check.ts
import mongoose from "mongoose";
import ExamModel, { IExamValidationRule } from "@/models/ExamModel";
import ConnectDB from "@/config/ConnectDB";
import { cryptoHash } from "@/utils/helpers/cryptoHash";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get("createdBy");
    const examId = searchParams.get("examId");

    if (!createdBy || !examId) {
        return NextResponse.json(
            { message: "Missing createdBy or examId" },
            { status: 400 }
        );
    }

    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
        return NextResponse.json(
            { message: "Invalid createdBy ID" },
            { status: 400 }
        );
    }

    if (!mongoose.Types.ObjectId.isValid(examId)) {
        return NextResponse.json(
            { message: "Invalid examId" },
            { status: 400 }
        );
    }

    try {
        const exam = await ExamModel.findOne({ _id: examId, createdBy });

        if (!exam) {
            return NextResponse.json(
                { message: "Exam not found or not created by this user" },
                { status: 404 }
            );
        }
        if (exam.scheduledStartAt && exam.durationMinutes) {
            const examStart = exam.scheduledStartAt.getTime();
            const examEnd = examStart + exam.durationMinutes * 60 * 1000;

            // Add late submission window if allowed
            let finalEnd = examEnd;
            if (exam.allowLateSubmissions && exam.lateWindowMinutes) {
                finalEnd += exam.lateWindowMinutes * 60 * 1000;
            }

            const now = Date.now();

            if (now > finalEnd) {
                return NextResponse.json(
                    { message: "Exam time has already ended" },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { success: true, exam },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { participantId, subjectCode, examCode, createdBy } = body;

        // 1. Basic type checks
        if (!subjectCode || typeof subjectCode !== "string") {
            return NextResponse.json(
                { success: false, message: "subjectCode is required." },
                { status: 400 }
            );
        }

        if (!examCode || typeof examCode !== "string") {
            return NextResponse.json(
                { success: false, message: "examCode is required." },
                { status: 400 }
            );
        }

        if (!participantId || typeof participantId !== "string") {
            return NextResponse.json(
                { success: false, message: "participant ID is required." },
                { status: 400 }
            );
        }

        if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
            return NextResponse.json(
                { success: false, message: "Invalid createdBy ID." },
                { status: 400 }
            );
        }

        // 2. Exam lookup
        const exam = await ExamModel.findOne({ examCode, createdBy });
        if (!exam) {
            return NextResponse.json(
                { success: false, message: "Exam not found." },
                { status: 404 }
            );
        }

        const validationRule = exam.validationRule as IExamValidationRule;

        // 3. Validate subjectCode against exam.validationRule
        const { startsWith, minLength, maxLength } = validationRule;

        if (startsWith && startsWith.length > 0) {
            const validPrefix = startsWith.some((prefix) =>
                participantId.startsWith(prefix)
            );
            if (!validPrefix) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Participants ID must start with one of: ${startsWith.join(", ")}`,
                    },
                    { status: 400 }
                );
            }
        }

        if (minLength && participantId.length < minLength) {
            return NextResponse.json(
                {
                    success: false,
                    message: `subjectCode must be at least ${minLength} characters.`,
                },
                { status: 400 }
            );
        }

        if (maxLength && participantId.length > maxLength) {
            return NextResponse.json(
                {
                    success: false,
                    message: `subjectCode must be at most ${maxLength} characters.`,
                },
                { status: 400 }
            );
        }

        if (subjectCode.toString() !== exam.subjectCode.toString()) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Enter a valid subject code.`,
                },
                { status: 400 }
            );
        }

        // 4. Timing checks
        if (exam.scheduledStartAt && exam.durationMinutes) {
            const now = Date.now();
            const endsAt = exam.scheduledStartAt.getTime() + exam.durationMinutes * 60 * 1000;

            let allowedUntil = endsAt;

            if (exam.allowLateSubmissions && exam.lateWindowMinutes) {
                allowedUntil += exam.lateWindowMinutes * 60 * 1000;
            }

            if (now > allowedUntil) {
                return NextResponse.json(
                    { success: false, message: "The exam window has closed." },
                    { status: 400 }
                );
            }
        }

        // 5. Hash the title before sending back
        const examObj = exam.toObject();
        examObj.examCode = cryptoHash(exam.examCode);

        return NextResponse.json(
            { exam: examObj },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
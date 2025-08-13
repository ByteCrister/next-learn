import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExamResultModel, { IAnswer } from "@/models/ExamResultModel";
import ExamModel from "@/models/ExamModel";
import ConnectDB from "@/config/ConnectDB";

/** Creator wants to get results of a specific exam */
export async function GET(req: NextRequest) {
    await ConnectDB();

    const examId = req.nextUrl.searchParams.get("exam");
    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
        return NextResponse.json({ message: "Invalid or missing exam ID" }, { status: 400 });
    }

    try {
        // Fetch exam to check start time
        const exam = await ExamModel.findById(examId).lean();

        if (!exam) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        // Check if exam has scheduledStartAt and if it has started
        if (exam.scheduledStartAt) {
            const now = new Date();
            const startDate = new Date(exam.scheduledStartAt);
            if (now < startDate) {
                return NextResponse.json(
                    { message: "Exam has not started yet" },
                    { status: 403 }
                );
            }
        }

        // If we reach here, exam has started or has no schedule, return results
        const results = await ExamResultModel.find({ exam: examId }).lean();
        return NextResponse.json(results, { status: 200 });
    } catch (err) {
        console.error("GET /api/results error:", err);
        return NextResponse.json({ message: "Failed to fetch results" }, { status: 500 });
    }
}

/** Submit exam results to the creator */
export async function POST(req: NextRequest) {
    await ConnectDB();

    try {
        const body = await req.json();
        const {
            exam,
            participantId,
            participantEmail,
            answers,
            startedAt,
            endedAt,
        } = body;

        // Basic validations
        if (!exam || !mongoose.Types.ObjectId.isValid(exam)) {
            return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 });
        }
        if (
            !participantId ||
            typeof participantId !== "string" ||
            !participantEmail ||
            typeof participantEmail !== "string" ||
            !Array.isArray(answers)
        ) {
            return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 });
        }

        // Load exam document for grading
        const examDoc = await ExamModel.findById(exam).lean();
        if (!examDoc) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        // Grade answers — compare selectedChoiceIndex with correct choice
        let score = 0;
        const gradedAnswers = answers.map((ans: IAnswer) => {
            const question = examDoc.questions[ans.questionIndex];
            const isCorrect = question && question.choices[ans.selectedChoiceIndex]?.isCorrect === true;
            if (isCorrect) score++;
            return {
                questionIndex: ans.questionIndex,
                selectedChoiceIndex: ans.selectedChoiceIndex,
                isCorrect,
            };
        });

        const totalQuestions = examDoc.questions.length;
        const status = "submitted";
        const startedAtDate = startedAt ? new Date(startedAt) : new Date();
        const endedAtDate = endedAt ? new Date(endedAt) : new Date();
        const timeTakenSeconds = Math.floor((endedAtDate.getTime() - startedAtDate.getTime()) / 1000);

        // Save result
        const result = await ExamResultModel.create({
            exam,
            participantId,
            participantEmail,
            startedAt: startedAtDate,
            endedAt: endedAtDate,
            timeTakenSeconds,
            score,
            totalQuestions,
            answers: gradedAnswers,
            status,
        });

        return NextResponse.json(result, { status: 201 });
    } catch (err) {
        console.error("POST /api/results error:", err);
        return NextResponse.json({ message: "Failed to submit result" }, { status: 500 });
    }
}

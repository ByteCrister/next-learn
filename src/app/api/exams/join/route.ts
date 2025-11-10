// src/app/api/exams/join/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExamModel from "@/models/ExamModel";
import { AnswerDTO, ExamResultDTO } from "@/types/types.exam";
import ExamResultModel, { IAnswer } from "@/models/ExamResultModel";
import { decodeId } from "@/utils/helpers/IdConversion";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const examId = searchParams.get("examId");
    const createdBy = searchParams.get("createdBy");
    const participantId = searchParams.get("participantId"); // from URL param
    const rawExamCode = searchParams.get("examCode") ?? "";
    // Decode once to remove double encoding
    const examCodeOnceDecoded = decodeURIComponent(rawExamCode);
    const decodedExamCode = decodeId(examCodeOnceDecoded);

    // Basic validation
    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing examId." },
        { status: 400 }
      );
    }
    if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing createdBy." },
        { status: 400 }
      );
    }
    if (!participantId) {
      return NextResponse.json(
        { success: false, message: "Missing participantId." },
        { status: 400 }
      );
    }
    if (!decodedExamCode) {
      return NextResponse.json(
        { success: false, message: "Missing examCode." },
        { status: 400 }
      );
    }

    // Fetch exam by ID and creator
    const exam = await ExamModel.findOne({ _id: examId, createdBy });
    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found." },
        { status: 404 }
      );
    }

    // Validate examCode
    if (exam.examCode !== decodedExamCode) {
      return NextResponse.json(
        { success: false, message: "Exam code mismatch." },
        { status: 400 }
      );
    }

    // Validate participantId according to validationRule
    const { startsWith, minLength, maxLength } = exam.validationRule || {};
    if (startsWith?.length) {
      const isValidPrefix = startsWith.some((prefix) =>
        participantId.startsWith(prefix)
      );
      if (!isValidPrefix) {
        return NextResponse.json(
          {
            success: false,
            message: "Participant ID does not match required prefix.",
          },
          { status: 400 }
        );
      }
    }
    if (minLength && participantId.length < minLength) {
      return NextResponse.json(
        {
          success: false,
          message: `Participant ID must be at least ${minLength} characters.`,
        },
        { status: 400 }
      );
    }
    if (maxLength && participantId.length > maxLength) {
      return NextResponse.json(
        {
          success: false,
          message: `Participant ID must not exceed ${maxLength} characters.`,
        },
        { status: 400 }
      );
    }

    // Timing check
    if (exam.scheduledStartAt && exam.durationMinutes) {
      const now = Date.now();
      const endsAt =
        exam.scheduledStartAt.getTime() +
        exam.durationMinutes * 60 * 1000 +
        (exam.lateWindowMinutes ?? 0) * 60 * 1000;
      if (now > endsAt) {
        return NextResponse.json(
          { success: false, message: "The exam window has closed." },
          { status: 400 }
        );
      }
    }

    // Passed all checks
    return NextResponse.json(exam, { status: 200 });
  } catch (err) {
    console.error("Error validating exam:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}

// * Submit participant answers

/** Helper to map DTO to Mongoose IAnswer */
const mapAnswers = (answers: AnswerDTO[]): IAnswer[] =>
  answers.map((a) => ({
    questionIndex: a.questionIndex,
    selectedChoiceIndex: a.selectedChoiceIndex,
    isCorrect: a.isCorrect, // optionally precomputed or left undefined
  }));

export async function POST(req: NextRequest) {
  try {
    const body: ExamResultDTO = await req.json();

    const { _id, participantId, participantEmail, status, startedAt, answers } =
      body;

    // Validate required fields
    if (
      !participantId ||
      !_id ||
      !participantEmail ||
      !startedAt ||
      !status ||
      !answers
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the exam to ensure it exists
    const exam = await ExamModel.findOne({ _id });
    if (!exam) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    // Check if participant has already submitted
    const existingResult = await ExamResultModel.findOne({
      exam: exam._id,
      participantId,
    });
    if (existingResult && existingResult.status === "submitted") {
      return NextResponse.json(
        { message: "Already submitted" },
        { status: 409 }
      );
    }

    // Create or update the result
    const result = existingResult
      ? existingResult
      : new ExamResultModel({
          exam: exam._id,
          participantId,
          participantEmail: participantEmail, // you can add email if available
          startedAt: startedAt,
          totalQuestions: exam.questions.length,
        });

    result.answers = mapAnswers(answers);
    result.endedAt = new Date();
    result.status = "submitted";

    // Optional: calculate score
    result.score = answers.reduce((sum, a) => (a.isCorrect ? sum + 1 : sum), 0);

    await result.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SubmitExam error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

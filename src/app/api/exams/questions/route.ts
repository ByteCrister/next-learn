import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/config/ConnectDB";
import ExamModel from "@/models/ExamModel";

// Update question
export async function PUT(request: NextRequest) {
    try {
        await ConnectDB();

        const { examId, questionIndex, question } = await request.json();

        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 });
        }

        const index = parseInt(questionIndex, 10);
        if (isNaN(index) || index < 0) {
            return NextResponse.json({ message: "Invalid question index" }, { status: 400 });
        }

        const exam = await ExamModel.findById(examId);
        if (!exam) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        if (!exam.questions[index]) {
            return NextResponse.json({ message: "Question not found" }, { status: 404 });
        }

        exam.questions[index] = question;
        await exam.save();

        return NextResponse.json(
            { message: "Question updated successfully", question: exam.questions[index] },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating question:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Delete question
export async function DELETE(request: NextRequest) {
    try {
        await ConnectDB();

        const { examId, questionIndex } = await request.json();

        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 });
        }

        const index = parseInt(questionIndex, 10);
        if (isNaN(index) || index < 0) {
            return NextResponse.json({ message: "Invalid question index" }, { status: 400 });
        }

        const exam = await ExamModel.findById(examId);
        if (!exam) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        if (!exam.questions[index]) {
            return NextResponse.json({ message: "Question not found" }, { status: 404 });
        }

        exam.questions.splice(index, 1);
        await exam.save();

        return NextResponse.json(
            { message: "Question deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting question:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

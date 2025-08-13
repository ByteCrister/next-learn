// \src\app\api\exams\route.ts
import ConnectDB from "@/config/ConnectDB";
import ExamModel from "@/models/ExamModel";
import { ExamOverviewCard, GetExamOverviewResponse } from "@/types/types.exam";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type ExamOverviewCardDB = {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    subjectCode: string;
    examCode: string;
};

// * get all exams as cards in the creator interface
export async function GET() {
    try {
        await ConnectDB();
        const userId = await getUserIdFromSession();

        // fetch only overview fields
        const examsDB = await ExamModel
            .find({ createdBy: userId })
            .select("_id title description subjectCode examCode")
            .lean<ExamOverviewCardDB[]>();

        const exams: ExamOverviewCard[] = examsDB.map((doc) => ({
            _id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            subjectCode: doc.subjectCode,
            examCode: doc.examCode,
        }));

        return NextResponse.json(exams as GetExamOverviewResponse, { status: 200 });
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 404 });
    }
}

// * create a new exam
export async function POST(req: NextRequest) {
    try {
        await ConnectDB();
        const userId = await getUserIdFromSession();
        const data = await req.json();

        const newExam = new ExamModel({
            title: data.title,
            description: data.description,
            subjectCode: data.subjectCode,
            examCode: data.examCode,
            createdBy: userId,
            validationRule: data.validationRule || {},
            questions: [],
            isTimed: false,
        }); await newExam.save();

        return NextResponse.json(newExam, { status: 201 });
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 404 });
    }
}

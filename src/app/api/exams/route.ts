// \src\app\api\exams\route.ts
import ConnectDB from "@/config/ConnectDB";
import ExamModel, { IExam } from "@/models/ExamModel";
import { ExamOverviewCard, GetExamOverviewResponse } from "@/types/types.exam";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// * get all exams as cards in the creator interface
export async function GET(req: NextRequest) {
  try {
    await ConnectDB();
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // read searchedId query param if present (null-safe)
    const url = new URL(req.url);
    const sidParam = url.searchParams.get("searchedId");
    const searchedId = sidParam ? decodeURIComponent(sidParam) : null;


    // fetch only overview fields
    const examsDB = await ExamModel.find({ createdBy: userId })
      .select(
        "_id title description subjectCode examCode isTimed durationMinutes scheduledStartAt allowLateSubmissions createdAt updatedAt questions"
      )
      .lean<IExam[]>();

    const exams: ExamOverviewCard[] = examsDB.map((doc) => {
      const now = new Date();
      let status: "draft" | "scheduled" | "active" | "completed" = "draft";

      if (doc.scheduledStartAt) {
        if (doc.scheduledStartAt > now) status = "scheduled";
        else if (doc.isTimed && doc.durationMinutes) {
          const end = new Date(
            doc.scheduledStartAt.getTime() + doc.durationMinutes * 60000
          );
          status = end > now ? "active" : "completed";
        } else {
          status = "active";
        }
      }

      return {
        _id: (doc._id as Types.ObjectId).toString(),
        title: doc.title,
        description: doc.description,
        subjectCode: doc.subjectCode,
        examCode: doc.examCode,
        isTimed: doc.isTimed ?? false,
        durationMinutes: doc.durationMinutes,
        scheduledStartAt: doc.scheduledStartAt?.toISOString() ?? null,
        allowLateSubmissions: doc.allowLateSubmissions ?? false,
        questionCount: doc.questions?.length ?? 0,
        status,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      };
    });

    // If searchedId provided and found, move that exam to the front while preserving relative order of the rest
    if (searchedId) {
      const idx = exams.findIndex((e) => e._id === searchedId);
      if (idx > 0) {
        const [found] = exams.splice(idx, 1);
        exams.unshift(found);
      }
    }

    return NextResponse.json(exams as GetExamOverviewResponse, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// * create a new exam
export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const userId = await getUserIdFromSession();
    
    if (!userId) {
      return NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 }
      );
  }
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
    });
    await newExam.save();

    return NextResponse.json(newExam, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

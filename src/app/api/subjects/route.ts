// app/api/subjects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Subject } from "@/models/Subject";
import ConnectDB from "@/config/ConnectDB";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { ClassNote } from "@/models/ClassNote";
import { ExternalLink } from "@/models/ExternalLink";
import { StudyMaterial } from "@/models/StudyMaterial";

export async function GET() {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await ConnectDB();

        // Get all subjects
        const subjects = await Subject.find({ userId }).sort({ createdAt: -1 });

        // Get overall counts in parallel
        const [notesCount, externalLinksCount, studyMaterialsCount] = await Promise.all([
            ClassNote.countDocuments({ userId }),
            ExternalLink.countDocuments({ userId }),
            StudyMaterial.countDocuments({ userId }),
        ]);

        return NextResponse.json(
            {
                subjects,
                counts: {
                    notes: notesCount,
                    externalLinks: externalLinksCount,
                    studyMaterials: studyMaterialsCount,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/subjects error:", error);
        return NextResponse.json(
            { message: "Failed to fetch subjects" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, code, description } = await request.json();

        if (!title || !code) {
            return NextResponse.json(
                { message: "Title and code are required" },
                { status: 400 }
            );
        }

        await ConnectDB();
        const newSubject = await Subject.create({
            userId,
            title,
            code,
            description,
        });

        return NextResponse.json(newSubject, { status: 201 });
    } catch (error) {
        console.error("POST /api/subjects error:", error);
        return NextResponse.json(
            { message: "Failed to create subject" },
            { status: 500 }
        );
    }
}

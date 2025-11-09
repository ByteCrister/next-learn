// app/api/subjects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { Subject } from "@/models/Subject";
import ConnectDB from "@/config/ConnectDB";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { SubjectNote } from "@/models/SubjectNote";
import { ExternalLink } from "@/models/ExternalLink";
import { StudyMaterial } from "@/models/StudyMaterial";

const getSubjectsData = unstable_cache(
    async (userId: string) => {
        await ConnectDB();

        // Get all subjects
        const subjects = await Subject.find({ userId }).sort({ createdAt: -1 });

        // Get overall counts in parallel
        const [notesCount, externalLinksCount, studyMaterialsCount] = await Promise.all([
            SubjectNote.countDocuments({ userId }),
            ExternalLink.countDocuments({ userId }),
            StudyMaterial.countDocuments({ userId }),
        ]);

        return {
            subjects,
            subjectCounts: {
                notes: notesCount,
                externalLinks: externalLinksCount,
                studyMaterials: studyMaterialsCount,
            },
        };
    },
    ["subjects-data"],
    { revalidate: 60 } // Cache for 60 seconds
);

export async function GET() {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await getSubjectsData(userId);
        return NextResponse.json(data, { status: 200 });
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

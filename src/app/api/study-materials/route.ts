import { NextRequest, NextResponse } from "next/server";
import { StudyMaterial } from "@/models/StudyMaterial";
import ConnectDB from "@/config/ConnectDB";
import { getUserIdFromSession } from "@/utils/helpers/session";

export async function GET(request: NextRequest) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await ConnectDB();

        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get("subjectId");
        const roadmapId = searchParams.get("roadmapId");

        const query: any = { userId };
        if (subjectId) query.subjectId = subjectId;
        if (roadmapId) query.roadmapId = roadmapId;

        const studyMaterials = await StudyMaterial.find(query).sort({ uploadedAt: -1 });

        return NextResponse.json(studyMaterials, { status: 200 });
    } catch (error) {
        console.error("GET /api/study-materials error:", error);
        return NextResponse.json(
            { message: "Failed to fetch study materials" },
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
        const { subjectId, roadmapId, filename, urls, fileTypes, tags, description, visibility } = await request.json();

        if (!filename || !urls || !fileTypes || urls.length === 0 || fileTypes.length === 0 || urls.length !== fileTypes.length) {
            return NextResponse.json(
                { message: "Filename, URLs, and fileTypes are required, and arrays must have matching lengths" },
                { status: 400 }
            );
        }

        await ConnectDB();
        const newStudyMaterial = await StudyMaterial.create({
            userId,
            subjectId,
            roadmapId,
            filename,
            urls,
            fileTypes,
            tags: tags || [],
            description,
            visibility: visibility || "private",
        });

        return NextResponse.json(newStudyMaterial, { status: 201 });
    } catch (error) {
        console.error("POST /api/study-materials error:", error);
        return NextResponse.json(
            { message: "Failed to create study material" },
            { status: 500 }
        );
    }
}

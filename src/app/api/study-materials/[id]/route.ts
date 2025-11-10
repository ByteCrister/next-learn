import { NextRequest, NextResponse } from "next/server";
import { StudyMaterial } from "@/models/StudyMaterial";
import ConnectDB from "@/config/ConnectDB";
import { getUserIdFromSession } from "@/utils/helpers/session";

type ContextType = {
    params: {
        id: string;
    };
};

export async function GET(
    request: NextRequest,
    context: unknown
) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await ConnectDB();
        const { id } = (context as ContextType).params;

        const studyMaterial = await StudyMaterial.findOne({ _id: id, userId });
        if (!studyMaterial) {
            return NextResponse.json(
                { message: "Study material not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(studyMaterial, { status: 200 });
    } catch (error) {
        console.error("GET /api/study-materials/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to fetch study material" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: unknown
) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const updates = await request.json();

        await ConnectDB();
        const { id } = (context as ContextType).params;
        const updatedStudyMaterial = await StudyMaterial.findOneAndUpdate(
            { _id: id, userId },
            updates,
            { new: true }
        );

        if (!updatedStudyMaterial) {
            return NextResponse.json(
                { message: "Study material not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedStudyMaterial, { status: 200 });
    } catch (error) {
        console.error("PUT /api/study-materials/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to update study material" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: unknown
) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await ConnectDB();
        const { id } = (context as ContextType).params;

        const deletedStudyMaterial = await StudyMaterial.findOneAndDelete({ _id: id, userId });
        if (!deletedStudyMaterial) {
            return NextResponse.json(
                { message: "Study material not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Study material deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/study-materials/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to delete study material" },
            { status: 500 }
        );
    }
}

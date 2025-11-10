import ConnectDB from "@/config/ConnectDB";
import { CourseRoadmap } from "@/models/CourseRoadmap";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        const body = await req.json();
        const { title, description, subjectId } = body;

        if (!title || !subjectId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (title.length < 5 || title.length > 50) {
            return NextResponse.json({ message: "Title must be between 5 and 50 characters" }, { status: 400 });
        }

        if (description.length < 10 && description.length > 120) {
            return NextResponse.json({ message: "Description must be between 10 and 120 characters" }, { status: 400 });
        }

        const roadmap = new CourseRoadmap({
            title,
            description,
            subjectId,
            roadmap: {}, // empty initial TipTap JSON or whatever default you want
            chapters: [],
        });

        await roadmap.save();

        return NextResponse.json(roadmap, { status: 201 });
    } catch (err) {
        console.error("Error creating roadmap:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await ConnectDB();

        const body = await req.json();
        const { roadmapId, roadmapContent } = body;

        if (!roadmapId || !roadmapContent) {
            return NextResponse.json({ message: "Missing roadmapId or roadmapContent" }, { status: 400 });
        }

        const roadmap = await CourseRoadmap.findById(roadmapId);
        if (!roadmap) {
            return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
        }

        roadmap.roadmap = roadmapContent; // update only the roadmap content field

        await roadmap.save();

        return NextResponse.json(roadmap, { status: 200 });
    } catch (err) {
        console.error("Error updating roadmap content:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await ConnectDB();

        const body = await req.json();
        const { roadmapId, title, description } = body;

        if (!roadmapId || !title) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const roadmap = await CourseRoadmap.findById(roadmapId);
        if (!roadmap) {
            return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
        }

        roadmap.title = title;
        roadmap.description = description || roadmap.description;

        await roadmap.save();

        return NextResponse.json(roadmap, { status: 200 });
    } catch (err) {
        console.error("Error updating roadmap:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await ConnectDB();

        const url = new URL(req.url);
        const roadmapId = url.searchParams.get("id");

        if (!roadmapId) {
            return NextResponse.json({ message: "Missing roadmap id" }, { status: 400 });
        }

        const roadmap = await CourseRoadmap.findById(roadmapId);
        if (!roadmap) {
            return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
        }

        await roadmap.deleteOne();

        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error deleting roadmap:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
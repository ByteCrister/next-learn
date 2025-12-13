// app/api/subjects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

import { ISubject, Subject } from "@/models/Subject";
import { StudyMaterial } from "@/models/StudyMaterial";
import { SubjectNote } from "@/models/SubjectNote";
import ConnectDB from "@/config/ConnectDB";
import { CourseRoadmap, ICourseRoadmap } from "@/models/CourseRoadmap";
import { Chapter } from "@/models/Chapter";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { ExternalLink } from "@/models/ExternalLink";
import { Types } from "mongoose";
import { Subject as SubjectTypes } from "@/types/types.subjects";

type ContextType = {
    params: {
        id: string;
    };
};

export async function GET(
    request: NextRequest,
    context: unknown
) {

    try {
        await ConnectDB();

        const { id } = (context as ContextType).params;
        const sId = decodeURIComponent(id);
        const userId = await getUserIdFromSession();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Fetch subject
        const subjectDoc = await Subject.findById(sId).lean<ISubject & { _id: Types.ObjectId }>();
        if (!subjectDoc || subjectDoc.userId.toString() !== userId) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        // Fetch roadmap
        const roadmapDoc = await CourseRoadmap.findOne({ subjectId: subjectDoc._id })
            .select("title description roadmap subjectId chapters")
            .lean<ICourseRoadmap>();

        // Count related items inline
        const [studyMaterials, notes, externalLinks, chapters] = await Promise.all([
            StudyMaterial.countDocuments({ subjectId: subjectDoc._id }),
            SubjectNote.countDocuments({ subjectId: subjectDoc._id }),
            ExternalLink.countDocuments({ subjectId: subjectDoc._id }),
            roadmapDoc ? Chapter.countDocuments({ roadmapId: roadmapDoc._id }) : Promise.resolve(0),
        ]);

        // Fetch chapters for roadmap if needed
        const roadmap = roadmapDoc
            ? {
                ...roadmapDoc,
                chapters: await Chapter.find({ roadmapId: roadmapDoc._id }).sort({ createdAt: 1 }).lean().then(chapters =>
                    chapters.map((chapter) => ({
                        _id: chapter._id?.toString(),
                        title: chapter.title,
                        content: chapter.content
                    }))
                ),
            }
            : null;

        // Build typed Subject
        const subject: SubjectTypes = {
            _id: subjectDoc._id.toString(),
            userId: subjectDoc.userId.toString(),
            title: subjectDoc.title,
            code: subjectDoc.code,
            description: subjectDoc.description,
            createdAt: subjectDoc.createdAt.toISOString(),
            updatedAt: subjectDoc.updatedAt.toISOString(),
            selectedSubjectCounts: {
                studyMaterials,
                notes,
                externalLinks,
                chapters,
            },
        };

        return NextResponse.json({ subject, roadmap }, { status: 200 });
    } catch (error) {
        console.error("GET /api/subjects/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to fetch subject and roadmap" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    context: unknown
) {

    try {
        await ConnectDB();

        const updates = await request.json();
        const { id } = (context as ContextType).params;
        const userId = await getUserIdFromSession();

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const subject = await Subject.findOneAndUpdate(
            { _id: id, userId },
            updates,
            { new: true, runValidators: true }
        );

        if (!subject) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        return NextResponse.json(subject, { status: 200 });
    } catch (error) {
        console.error("PATCH /api/subjects/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to update subject" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: unknown
) {
    
    try {
        await ConnectDB();

        const userId = await getUserIdFromSession();
        const { id } = (context as ContextType).params;

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        // Delete only if the subject belongs to this user
        const deleted = await Subject.findOneAndDelete({
            _id: id,
            userId,
        });
        if (!deleted) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        // Get roadmap IDs first
        const roadmapIds = await CourseRoadmap.find({ subjectId: id }).distinct('_id');

        // Cascade deletes
        await Promise.all([
            StudyMaterial.deleteMany({ subjectId: id }),
            CourseRoadmap.deleteMany({ subjectId: id }),
            SubjectNote.deleteMany({ subjectId: id }),
            Chapter.deleteMany({ roadmapId: { $in: roadmapIds } }),
        ]);

        return NextResponse.json(
            { message: "Subject and related data deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE /api/subjects/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to delete subject" },
            { status: 500 }
        );
    }
}

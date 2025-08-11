// app/api/subjects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

import { ISubject, Subject } from "@/models/Subject";
import { StudyMaterial } from "@/models/StudyMaterial";
import { ClassNote } from "@/models/ClassNote";
import ConnectDB from "@/config/ConnectDB";
import { CourseRoadmap, IChapter, ICourseRoadmap } from "@/models/CourseRoadmap";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { ExternalLink } from "@/models/ExternalLink";
import { Types } from "mongoose";
import { Subject as SubjectTypes } from "@/types/types.subjects";


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } =await params;
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await ConnectDB();

        // Fetch subject
        const subjectDoc = await Subject.findById(id).lean<ISubject & { _id: Types.ObjectId }>();
        if (!subjectDoc || subjectDoc.userId.toString() !== userId) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        // Count related items inline
        const [studyMaterials, notes, externalLinks] = await Promise.all([
            StudyMaterial.countDocuments({ subjectId: subjectDoc._id }),
            ClassNote.countDocuments({ subjectId: subjectDoc._id }),
            ExternalLink.countDocuments({ subjectId: subjectDoc._id }),
        ]);

        // Fetch roadmap
        const roadmapDoc = await CourseRoadmap.findOne({ subjectId: subjectDoc._id })
            .select("title description roadmap subjectId chapters")
            .lean<ICourseRoadmap & { chapters: IChapter[] }>();

        const roadmap = roadmapDoc
            ? {
                ...roadmapDoc,
                chapters: (roadmapDoc.chapters ?? []).map((chapter) => ({
                    _id: chapter._id?.toString(),
                    title: chapter.title,
                })),
            }
            : null;

            const chapters = roadmapDoc ? (roadmapDoc.chapters ?? []).length : 0;

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
    { params }: { params: { id: string } }
) {
    const userId = await getUserIdFromSession();

    try {
        const updates = await request.json();
        await ConnectDB();

        const subject = await Subject.findOneAndUpdate(
            { _id: params.id, userId },
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = await getUserIdFromSession();

    try {
        await ConnectDB();

        // Delete only if the subject belongs to this user
        const deleted = await Subject.findOneAndDelete({
            _id: params.id,
            userId,
        });
        if (!deleted) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        // Cascade deletes
        await Promise.all([
            StudyMaterial.deleteMany({ subjectId: params.id }),
            CourseRoadmap.deleteMany({ subjectId: params.id }),
            ClassNote.deleteMany({ subjectId: params.id }),
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

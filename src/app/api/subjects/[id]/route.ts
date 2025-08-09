// app/api/subjects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

import { ISubject, Subject } from "@/models/Subject";
import { StudyMaterial } from "@/models/StudyMaterial";
import { ClassNote } from "@/models/ClassNote";
import ConnectDB from "@/config/ConnectDB";
import { CourseRoadmap, IChapter, ICourseRoadmap } from "@/models/CourseRoadmap";
import { getUserIdFromSession } from "@/utils/helpers/session";

// Define minimal chapter info type for your mapping
interface MinimalChapter {
    _id: string;
    title: string;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } } // Destructure params from the second argument
) {
    const {id} = await params;
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await ConnectDB();

        // Subject with full type
        const subject: ISubject | null = await Subject.findById(id);
        if (!subject || subject.userId.toString() !== userId) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        // Find roadmap for subjectId
        // .select() returns a Mongoose Document, so we type it accordingly
        const roadmapDoc = await CourseRoadmap.findOne({ subjectId: subject._id })
            .select("title description roadmap subjectId chapters")
            .lean<ICourseRoadmap & { chapters: IChapter[] }>(); // use .lean() for plain JS object

        let roadmap = null;
        if (roadmapDoc) {
            // Map chapters to minimal info
            const minimalChapters: MinimalChapter[] = (roadmapDoc.chapters ?? []).map(
                (chapter) => ({
                    _id: chapter._id.toString(),
                    title: chapter.title,
                })
            );

            roadmap = {
                ...roadmapDoc,
                chapters: minimalChapters,
            };
        }

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

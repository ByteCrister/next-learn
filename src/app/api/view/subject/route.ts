import ConnectDB from "@/config/ConnectDB";
import { CourseRoadmap } from "@/models/CourseRoadmap";
import { Subject } from "@/models/Subject";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
    try {
        await ConnectDB();

        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get('subjectId');

        if (!subjectId || !mongoose.isValidObjectId(subjectId)) {
            return NextResponse.json(
                { message: 'Invalid or missing subjectId parameter' },
                { status: 400 }
            );
        }

        const subject = await Subject.findById(subjectId)
            .select('title code description')
            .lean();

        if (!subject) {
            return NextResponse.json(
                { message: 'Subject not found. Maybe removed or Invalid parameters.' },
                { status: 404 }
            );
        }

        const roadmap = await CourseRoadmap.findOne({ subjectId })
            .select('title description roadmap chapters.title chapters.content')
            .lean();

        return NextResponse.json({
            subject,
            roadmap: roadmap || null,
        });
    } catch (error) {
        console.error('API subject fetch error:', error);
        return NextResponse.json(
            { message: 'Internal server error' }, // unify error key
            { status: 500 }
        );
    }
}

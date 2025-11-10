import ConnectDB from "@/config/ConnectDB";
import { StudyMaterial } from "@/models/StudyMaterial";
import { ExternalLink } from "@/models/ExternalLink";
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

        // Verify subject exists
        const subject = await Subject.findById(subjectId)
            .select('title code')
            .lean();

        if (!subject) {
            return NextResponse.json(
                { message: 'Subject not found' },
                { status: 404 }
            );
        }

        // Fetch only public study materials for the subject
        const studyMaterials = await StudyMaterial.find({
            subjectId,
            visibility: 'public'
        })
            .select('filename urls fileTypes tags description uploadedAt')
            .sort({ uploadedAt: -1 })
            .lean();

        // Fetch only public external links for the subject
        const externalLinks = await ExternalLink.find({
            subjectId,
            visibility: 'public'
        })
            .select('title url description category addedAt')
            .sort({ addedAt: -1 })
            .lean();

        return NextResponse.json({
            studyMaterials,
            externalLinks,
            subject: {
                title: subject.title,
                code: subject.code,
            },
        });
    } catch (error) {
        console.error('API study materials fetch error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

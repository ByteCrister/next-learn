import ConnectDB from "@/config/ConnectDB";
import { ExternalLink } from "@/models/ExternalLink";
import { Subject } from "@/models/Subject";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import { decodeId } from "@/utils/helpers/IdConversion";

export async function GET(request: NextRequest) {
    try {
        await ConnectDB();

        const { searchParams } = new URL(request.url);
        const encodedSubjectId = searchParams.get('subjectId');
        const encodedExternalLinkId = searchParams.get('externalLinkId');

        if (!encodedSubjectId || !encodedExternalLinkId) {
            return NextResponse.json(
                { message: 'Invalid or missing subjectId or externalLinkId parameters' },
                { status: 400 }
            );
        }

        const decodedSubjectId = decodeURIComponent(encodedSubjectId);
        const decodedExternalLinkId = decodeURIComponent(encodedExternalLinkId);

        const subjectId = decodeId(decodedSubjectId);
        const externalLinkId = decodeId(decodedExternalLinkId);

        if (!mongoose.isValidObjectId(subjectId) ||
            !mongoose.isValidObjectId(externalLinkId)) {
            return NextResponse.json(
                { message: 'Invalid subjectId or externalLinkId parameters' },
                { status: 400 }
            );
        }

        // Fetch the external link and ensure it's public
        const externalLink = await ExternalLink.findOne({
            _id: externalLinkId,
            subjectId,
            visibility: 'public'
        })
            .select('title url description category addedAt')
            .lean();

        if (!externalLink) {
            return NextResponse.json(
                { message: 'External link not found or not public' },
                { status: 404 }
            );
        }

        // Get subject info
        const subject = await Subject.findById(subjectId)
            .select('title code')
            .lean();

        if (!subject) {
            return NextResponse.json(
                { message: 'Subject not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            externalLink,
            subject: {
                title: subject.title,
                code: subject.code,
            },
        });
    } catch (error) {
        console.error('API external link fetch error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

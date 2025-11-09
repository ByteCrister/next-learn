import ConnectDB from "@/config/ConnectDB";
import { StudyMaterial } from "@/models/StudyMaterial";
import { ExternalLink } from "@/models/ExternalLink";
import { Subject } from "@/models/Subject";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import { decodeId } from "@/utils/helpers/IdConversion";

export async function GET(request: NextRequest) {
    try {
        await ConnectDB();

        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get('subjectId');
        const studyMaterialId = searchParams.get('studyMaterialId');

        if (!subjectId || !studyMaterialId ||
            !mongoose.isValidObjectId(subjectId) ||
            !mongoose.isValidObjectId(studyMaterialId)) {
            return NextResponse.json(
                { message: 'Invalid or missing subjectId or studyMaterialId parameters' },
                { status: 400 }
            );
        }

        // Fetch the study material and ensure it's public
        const studyMaterial = await StudyMaterial.findOne({
            _id: studyMaterialId,
            subjectId,
            visibility: 'public'
        })
            .select('filename urls fileTypes tags description uploadedAt subjectId')
            .lean();

        // Fetch the external link and ensure it's public
        const externalLink = await ExternalLink.findOne({
            _id: studyMaterialId,
            subjectId,
            visibility: 'public'
        })
            .select('title url description category addedAt subjectId')
            .lean();

        if (!studyMaterial && !externalLink) {
            return NextResponse.json(
                { message: 'Study material or external link not found or not public' },
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
            studyMaterial,
            externalLink,
            subject: {
                title: subject.title,
                code: subject.code,
            },
        });
    } catch (error) {
        console.error('API study material fetch error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

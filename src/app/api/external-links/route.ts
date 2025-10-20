import { NextRequest, NextResponse } from "next/server";
import { ExternalLink } from "@/models/ExternalLink";
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

        const query: any = { userId };
        if (subjectId) query.subjectId = subjectId;

        const externalLinks = await ExternalLink.find(query).sort({ addedAt: -1 });

        return NextResponse.json(externalLinks, { status: 200 });
    } catch (error) {
        console.error("GET /api/external-links error:", error);
        return NextResponse.json(
            { message: "Failed to fetch external links" },
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
        const { subjectId, url, title, description, category } = await request.json();

        if (!url || !title || !category) {
            return NextResponse.json(
                { message: "URL, title, and category are required" },
                { status: 400 }
            );
        }

        // Basic URL validation
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { message: "Invalid URL format" },
                { status: 400 }
            );
        }

        await ConnectDB();
        const newExternalLink = await ExternalLink.create({
            userId,
            subjectId,
            url,
            title,
            description,
            category,
            isNew: true,
        });

        return NextResponse.json(newExternalLink, { status: 201 });
    } catch (error) {
        console.error("POST /api/external-links error:", error);
        return NextResponse.json(
            { message: "Failed to create external link" },
            { status: 500 }
        );
    }
}

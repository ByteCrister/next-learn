import { NextRequest, NextResponse } from "next/server";
import { ExternalLink } from "@/models/ExternalLink";
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

        const externalLink = await ExternalLink.findOne({ _id: id, userId });
        if (!externalLink) {
            return NextResponse.json(
                { message: "External link not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(externalLink, { status: 200 });
    } catch (error) {
        console.error("GET /api/external-links/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to fetch external link" },
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

        if (updates.url) {
            try {
                new URL(updates.url);
            } catch {
                return NextResponse.json(
                    { message: "Invalid URL format" },
                    { status: 400 }
                );
            }
        }

        await ConnectDB();
        const { id } = (context as ContextType).params;

        const updatedExternalLink = await ExternalLink.findOneAndUpdate(
            { _id: id, userId },
            updates,
            { new: true }
        );

        if (!updatedExternalLink) {
            return NextResponse.json(
                { message: "External link not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedExternalLink, { status: 200 });
    } catch (error) {
        console.error("PUT /api/external-links/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to update external link" },
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

        const deletedExternalLink = await ExternalLink.findOneAndDelete({ _id: id, userId });
        if (!deletedExternalLink) {
            return NextResponse.json(
                { message: "External link not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "External link deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/external-links/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to delete external link" },
            { status: 500 }
        );
    }
}

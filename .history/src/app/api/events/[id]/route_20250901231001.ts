// /app/api/events/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/models/Event";
import { getUserIdFromSession } from "@/utils/helpers/session";
import ConnectDB from "@/config/ConnectDB";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await ConnectDB();

        const userId = await getUserIdFromSession();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const updates = await req.json();
        const updated = await Event.findOneAndUpdate(
            { _id: params.id, userId },
            updates,
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { error: "Not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error(`PUT /api/events/${params.id} error:`, error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await ConnectDB();

        const userId = await getUserIdFromSession();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const deleted = await Event.findOneAndDelete({
            _id: params.id,
            userId,
        });

        if (!deleted) {
            return NextResponse.json(
                { error: "Not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`DELETE /api/events/${params.id} error:`, error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
// /app/api/events/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/models/Event";
import { getUserIdFromSession } from "@/utils/helpers/session";
import ConnectDB from "@/config/ConnectDB";

export async function GET() {
    try {
        await ConnectDB();

        const userId = await getUserIdFromSession();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const events = await Event.find({ userId });
        return NextResponse.json(events);

    } catch (error) {
        console.log("GET /api/events error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        const userId = await getUserIdFromSession();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description, start, end, allDay } = await req.json();

        const newEvent = await Event.create({
            userId,
            title,
            description,
            start,
            end,
            allDay,
        });

        return NextResponse.json(newEvent, { status: 201 });

    } catch (error) {
        console.log("POST /api/events error:", error);
        // handle JSON parse errors, validation, DB errors, etc.
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
// /app/api/events/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose, { FilterQuery } from "mongoose";
import { Event, IEvent, ITask } from "@/models/Event";
import { getUserIdFromSession } from "@/utils/helpers/session";
import ConnectDB from "@/config/ConnectDB";

/**
 * Helper to format and return errors
 */
function handleError(error: unknown) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json(
            { message: "Validation Failed", errors: error.errors },
            { status: 400 }
        );
    }
    return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    );
}

/**
 * GET /api/events
 * Returns all events for the current user, including virtual fields.
 */
export async function GET(req: NextRequest) {
    try {
        await ConnectDB();

        const userId = await getUserIdFromSession();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") ?? undefined;

        // Properly typed filter
        const filter: FilterQuery<IEvent> = { userId };
        if (status) {
            filter.eventStatus = status;
        }

        const events = await Event.find(filter)
            .sort({ start: 1 })
            .lean({ virtuals: true });

        return NextResponse.json(events);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * POST /api/events
 * Creates a new event. Expects:
 * {
 *   title,
 *   description?,
 *   start,               // ISO string or Date
 *   durationMinutes,     // number
 *   allDay?,             // boolean
 *   tasks: [             // must have at least one
 *     { title, description?, isComplete? }
 *   ]
 * }
 */
export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        const userId = await getUserIdFromSession();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const payload = await req.json();

        //
        // GUARD CLAUSES
        //
        if (
            typeof payload.title !== "string" ||
            !payload.title.trim()
        ) {
            return NextResponse.json(
                { message: "Invalid or missing `title`" },
                { status: 400 }
            );
        }

        const startDate = new Date(payload.start);
        if (isNaN(startDate.getTime())) {
            return NextResponse.json(
                { message: "Invalid or missing `start` date" },
                { status: 400 }
            );
        }

        if (
            !Number.isInteger(payload.durationMinutes) ||
            payload.durationMinutes < 1
        ) {
            return NextResponse.json(
                { message: "Invalid or missing `durationMinutes`" },
                { status: 400 }
            );
        }

        if (
            payload.allDay !== undefined &&
            typeof payload.allDay !== "boolean"
        ) {
            return NextResponse.json(
                { message: "`allDay` must be a boolean" },
                { status: 400 }
            );
        }

        if (
            !Array.isArray(payload.tasks) ||
            payload.tasks.length === 0
        ) {
            return NextResponse.json(
                { message: "At least one task is required" },
                { status: 400 }
            );
        }

        for (const [i, task] of payload.tasks.entries()) {
            if (
                typeof task.title !== "string" ||
                !task.title.trim()
            ) {
                return NextResponse.json(
                    { message: `Task #${i + 1} has invalid or missing title` },
                    { status: 400 }
                );
            }
            if (
                task.description !== undefined &&
                typeof task.description !== "string"
            ) {
                return NextResponse.json(
                    { message: `Task #${i + 1} description must be a string` },
                    { status: 400 }
                );
            }
            if (
                task.isComplete !== undefined &&
                typeof task.isComplete !== "boolean"
            ) {
                return NextResponse.json(
                    { message: `Task #${i + 1} isComplete must be a boolean` },
                    { status: 400 }
                );
            }
        }

        //
        // CREATE & RETURN
        //
        const newEvent = await Event.create({
            userId,
            title: payload.title.trim(),
            description: payload.description?.trim() || "",
            start: startDate,
            durationMinutes: payload.durationMinutes,
            allDay: payload.allDay ?? false,
            tasks: payload.tasks.map((t: ITask) => ({
                title: t.title.trim(),
                description: t.description?.trim() || "",
                isComplete: t.isComplete ?? false,
            })),
        });

        // Re‐fetch with virtuals
        const saved = await Event.findById(newEvent._id).lean({ virtuals: true });
        return NextResponse.json(saved, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}


/** Update event */
export async function PUT(req: NextRequest) {
    try {
        await ConnectDB();

        const userId = await getUserIdFromSession();
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body: { id: string; updates: Partial<IEvent> } = await req.json();
        const { id, updates } = body;

        if (!id) return NextResponse.json({ message: "Event ID is required" }, { status: 400 });

        const event = await Event.findOne({ _id: id, userId });
        if (!event) return NextResponse.json({ message: "Not Found" }, { status: 404 });

        // Apply updates
        if (updates.title !== undefined) event.title = updates.title;
        if (updates.description !== undefined) event.description = updates.description;
        if (updates.start !== undefined) event.start = new Date(updates.start);
        if (updates.durationMinutes !== undefined) event.durationMinutes = updates.durationMinutes;
        if (updates.allDay !== undefined) event.allDay = updates.allDay;
        if (Array.isArray(updates.tasks)) event.tasks = updates.tasks as ITask[];

        await event.save();

        const returned = await Event.findById(id).lean({ virtuals: true });
        return NextResponse.json(returned);
    } catch (error) {
        return handleError(error);
    }
}

/** Delete event */
export async function DELETE(req: NextRequest) {
    try {
        await ConnectDB();

        const userId = await getUserIdFromSession();
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await req.json();
        if (!id) return NextResponse.json({ message: "Event ID is required" }, { status: 400 });

        const result = await Event.findOneAndDelete({ _id: id, userId });
        if (!result) return NextResponse.json({ message: "Not Found" }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleError(error);
    }
}
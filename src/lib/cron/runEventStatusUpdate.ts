// lib/cron/runEventStatusUpdate.ts
import ConnectDB from "@/config/ConnectDB";
import { Event } from "@/models/Event";
import type { IEvent } from "@/models/Event";
import type { FilterQuery, UpdateResult } from "mongoose";

export async function runEventStatusUpdate() {
    await ConnectDB();
    const now = new Date();

    const completedFilter: FilterQuery<IEvent> = {
        tasks: { $not: { $elemMatch: { isComplete: false } } },
        eventStatus: { $ne: "completed" },
    };
    const completedUpdate = { $set: { eventStatus: "completed", updatedAt: new Date() } };

    const hasIncomplete: FilterQuery<IEvent> = { tasks: { $elemMatch: { isComplete: false } } };

    const upcomingFilter: FilterQuery<IEvent> = {
        ...hasIncomplete,
        start: { $gt: now },
        eventStatus: { $ne: "upcoming" },
    };
    const upcomingUpdate = { $set: { eventStatus: "upcoming", updatedAt: new Date() } };

    const inProgressFilter: FilterQuery<IEvent> = {
        ...hasIncomplete,
        eventStatus: { $ne: "inProgress" },
        $expr: {
            $and: [
                { $lte: ["$start", now] },
                { $gt: [{ $add: ["$start", { $multiply: ["$durationMinutes", 60000] }] }, now] },
            ],
        },
    };
    const inProgressUpdate = { $set: { eventStatus: "inProgress", updatedAt: new Date() } };

    const expiredFilter: FilterQuery<IEvent> = {
        ...hasIncomplete,
        eventStatus: { $ne: "expired" },
        $expr: {
            $gte: [now, { $add: ["$start", { $multiply: ["$durationMinutes", 60000] }] }],
        },
    };
    const expiredUpdate = { $set: { eventStatus: "expired", updatedAt: new Date() } };

    const [
        completedResult,
        upcomingResult,
        inProgressResult,
        expiredResult,
    ]: UpdateResult[] = await Promise.all([
        Event.updateMany(completedFilter, completedUpdate),
        Event.updateMany(upcomingFilter, upcomingUpdate),
        Event.updateMany(inProgressFilter, inProgressUpdate),
        Event.updateMany(expiredFilter, expiredUpdate),
    ]);

    return {
        ok: true,
        now: now.toISOString(),
        results: {
            completed: { matched: completedResult.matchedCount, modified: completedResult.modifiedCount ?? 0 },
            upcoming: { matched: upcomingResult.matchedCount, modified: upcomingResult.modifiedCount ?? 0 },
            inProgress: { matched: inProgressResult.matchedCount, modified: inProgressResult.modifiedCount ?? 0 },
            expired: { matched: expiredResult.matchedCount, modified: expiredResult.modifiedCount ?? 0 },
        },
    };
}

export default runEventStatusUpdate;

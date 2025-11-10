// app/api/search/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getUserIdFromSession } from "@/utils/helpers/session";
import { encodeId } from "@/utils/helpers/IdConversion";

import { Subject, ISubject } from "@/models/Subject";
import Routine from "@/models/Routine";
import ExamModel, { IExam } from "@/models/ExamModel";

import {
    SubjectSearchResult,
    RoutineSearchResult,
    EventSearchResult,
    ExamSearchResult,
    SearchResponse,
} from "@/types/types.searching";
import { Event, IEvent } from "@/models/Event";

const MAX_PER_MODEL = 8;

function escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseDateRange(input: string): { start: Date; end: Date } | null {
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/;
    const m = input.match(isoMatch);
    if (!m) return null;
    const [y, mo, d] = [m[1], m[2], m[3]];
    const start = new Date(`${y}-${mo}-${d}T00:00:00.000Z`);
    const end = new Date(`${y}-${mo}-${d}T23:59:59.999Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    return { start, end };
}

// safe helper inside your handler (place near other helpers)
function normalizeTasksToStrings(tasks: unknown): string[] {
    if (!tasks) return [];
    if (Array.isArray(tasks)) {
        return tasks.map((t) => {
            if (typeof t === "string") return t;
            if (t == null) return "";
            // common subdocument shapes: { text: "..." } or { name: "..." } or simple object
            if (typeof t === "object") {
                const obj = t as Record<string, unknown>;
                if (typeof obj.text === "string") return obj.text;
                if (typeof obj.name === "string") return obj.name;
                if (typeof obj.title === "string") return obj.title;
                // fallback to JSON or string coercion
                try {
                    return JSON.stringify(obj);
                } catch {
                    return String(obj);
                }
            }
            return String(t);
        }).filter(Boolean);
    }
    // tasks is single value (string or object)
    if (typeof tasks === "string") return [tasks];
    if (typeof tasks === "object") {
        const obj = tasks as Record<string, unknown>;
        if (typeof obj.text === "string") return [obj.text];
        if (typeof obj.name === "string") return [obj.name];
        if (typeof obj.title === "string") return [obj.title];
        try {
            return [JSON.stringify(obj)];
        } catch {
            return [String(obj)];
        }
    }
    return [String(tasks)];
}


export async function GET(req: NextRequest) {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const q = (url.searchParams.get("q") || "").trim();
        if (!q) {
            const empty: SearchResponse = { results: [] };
            return NextResponse.json(empty);
        }

        // Optional: ensure mongoose connection is established in your app bootstrap.
        // if (mongoose.connection.readyState === 0) { await mongoose.connect(process.env.MONGODB_URI!); }

        const escaped = escapeRegex(q);
        const genericRegex = new RegExp(escaped, "i");
        const dateRange = parseDateRange(q);

        // SUBJECTS
        type SubjectLean = Pick<
            ISubject,
            "_id" | "title" | "code" | "description" | "createdAt"
        >;
        const subjectOr: Array<Record<string, unknown>> = [
            { title: genericRegex },
            { code: genericRegex },
            { description: genericRegex },
        ];
        if (dateRange) {
            subjectOr.push({
                createdAt: { $gte: dateRange.start, $lte: dateRange.end },
            });
        }

        const subjects = await Subject.find({ userId, $or: subjectOr })
            .limit(MAX_PER_MODEL)
            .select("title code description createdAt")
            .lean<SubjectLean[]>();

        const subjectResults: SubjectSearchResult[] = subjects.map((s) => {
            const labelParts: string[] = [];
            if (s.title) labelParts.push(s.title);
            if (s.code) labelParts.push(s.code);
            if (s.description) labelParts.push(s.description);
            if (dateRange && s.createdAt)
                labelParts.push(s.createdAt.toISOString().slice(0, 10));
            return {
                type: "subject",
                label: labelParts.join(" — "),
                href: `${process.env.DOMAIN}/subjects?searched=${encodeId(
                    String(s._id)
                )}`,
                meta: {
                    id: String(s._id),
                    rawId: String(s._id),
                    createdAt: s.createdAt?.toISOString(),
                },
            };
        });

        // ROUTINES (aggregation to compute totalSlots)
        type RoutineAggResult = {
            _id: mongoose.Types.ObjectId;
            title?: string;
            description?: string;
            totalSlots?: number;
            createdAt?: Date;
        };

        const routinePipeline: mongoose.PipelineStage[] = [
            { $match: { userId: new mongoose.Types.ObjectId(String(userId)) } },
            {
                $addFields: {
                    totalSlots: {
                        $reduce: {
                            input: "$days",
                            initialValue: 0,
                            in: {
                                $add: ["$$value", { $size: { $ifNull: ["$$this.slots", []] } }],
                            },
                        },
                    },
                },
            },
            {
                $match: {
                    $or: [
                        { title: genericRegex },
                        { description: genericRegex },
                        ...(Number.isFinite(Number(q)) ? [{ totalSlots: Number(q) }] : []),
                        ...(dateRange
                            ? [{ createdAt: { $gte: dateRange.start, $lte: dateRange.end } }]
                            : []),
                    ],
                },
            },
            { $project: { title: 1, description: 1, totalSlots: 1, createdAt: 1 } },
            { $limit: MAX_PER_MODEL },
        ];
        const routines = (await Routine.aggregate(
            routinePipeline
        ).exec()) as RoutineAggResult[];

        const routineResults: RoutineSearchResult[] = routines.map((r) => {
            const labelParts: string[] = [];
            if (r.title) labelParts.push(r.title);
            if (r.description) labelParts.push(r.description);
            labelParts.push(`slots: ${r.totalSlots ?? 0}`);
            if (dateRange && r.createdAt)
                labelParts.push(r.createdAt.toISOString().slice(0, 10));
            return {
                type: "routine",
                label: labelParts.join(" — "),
                href: `${process.env.DOMAIN}/routines?searched=${encodeId(
                    String(r._id)
                )}`,
                meta: {
                    id: String(r._id),
                    rawId: String(r._id),
                    totalSlots: r.totalSlots ?? 0,
                    createdAt: r.createdAt?.toISOString(),
                },
            };
        });

        // EVENTS
        type EventLean = Pick<
            IEvent,
            "_id" | "title" | "description" | "start" | "durationMinutes" | "tasks"
        >;
        const eventOr: Array<Record<string, unknown>> = [
            { title: genericRegex },
            { description: genericRegex },
            { tasks: genericRegex },
        ];
        if (!Number.isNaN(Number(q)) && Number(q) > 0) {
            eventOr.push({ durationMinutes: Number(q) });
        }
        if (dateRange) {
            eventOr.push({ starts: { $gte: dateRange.start, $lte: dateRange.end } });
        }

        const events = await Event.find({ userId, $or: eventOr })
            .limit(MAX_PER_MODEL)
            .select("title description starts durationMinutes tasks")
            .lean<EventLean[]>();

        const eventsResults: EventSearchResult[] = events.map((e) => {
            const labelParts: string[] = [];
            if (genericRegex.test(e.title ?? "")) labelParts.push(e.title ?? "");
            if (genericRegex.test(e.description ?? ""))
                labelParts.push(e.description ?? "");

            const taskStrings = normalizeTasksToStrings(e.tasks);
            const matchedTasks: string[] = taskStrings.filter((t) => genericRegex.test(t)).slice(0, 3);

            if (matchedTasks.length)
                labelParts.push(`tasks: ${matchedTasks.join(", ")}`);
            if (e.durationMinutes) labelParts.push(`duration: ${e.durationMinutes}m`);
            if (dateRange && e.start)
                labelParts.push(e.start.toISOString().slice(0, 10));
            if (labelParts.length === 0)
                labelParts.push(e.title ?? e.description ?? `Event ${e._id}`);
            return {
                type: "event",
                label: labelParts.join(" — "),
                href: `${process.env.DOMAIN}/events?searched=${encodeId(
                    String(e._id)
                )}`,
                meta: {
                    id: String(e._id),
                    rawId: String(e._id),
                    starts: e.start?.toISOString(),
                    durationMinutes: e.durationMinutes,
                    matchedTasks,
                },
            };
        });

        // EXAMS
        type ExamLean = Pick<
            IExam,
            | "_id"
            | "title"
            | "description"
            | "examCode"
            | "subjectCode"
            | "durationMinutes"
            | "scheduledStartAt"
        >;
        const examOr: Array<Record<string, unknown>> = [
            { title: genericRegex },
            { description: genericRegex },
            { examCode: genericRegex },
            { subjectCode: genericRegex },
        ];
        if (!Number.isNaN(Number(q)) && Number(q) > 0) {
            examOr.push({ durationMinutes: Number(q) });
        }
        if (dateRange) {
            examOr.push({
                scheduledStartAt: { $gte: dateRange.start, $lte: dateRange.end },
            });
        }

        const exams = await ExamModel.find({ $or: examOr })
            .limit(MAX_PER_MODEL)
            .select(
                "title description examCode subjectCode durationMinutes scheduledStartAt"
            )
            .lean<ExamLean[]>();

        const examResults: ExamSearchResult[] = exams.map((ex) => {
            const labelParts: string[] = [];
            if (ex.title) labelParts.push(ex.title);
            if (ex.description) labelParts.push(ex.description);
            if (ex.examCode) labelParts.push(ex.examCode);
            if (ex.subjectCode) labelParts.push(ex.subjectCode);
            if (ex.durationMinutes)
                labelParts.push(`duration: ${ex.durationMinutes}m`);
            if (dateRange && ex.scheduledStartAt)
                labelParts.push(ex.scheduledStartAt!.toISOString().slice(0, 10));
            return {
                type: "exam",
                label: labelParts.join(" — "),
                href: `${process.env.DOMAIN}/exams?searched=${encodeId(
                    String(ex._id)
                )}`,
                meta: {
                    id: String(ex._id),
                    rawId: String(ex._id),
                    examCode: ex.examCode,
                    scheduledStartAt: ex.scheduledStartAt?.toISOString(),
                },
            };
        });

        const results = [
            ...subjectResults,
            ...routineResults,
            ...eventsResults,
            ...examResults,
        ].slice(0, 50);
        const response: SearchResponse = { results };
        return NextResponse.json(response);
    } catch (err: unknown) {
        // keep the error typed and avoid leaking sensitive info
        console.error("Search error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

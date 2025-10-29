// src/app/api/batches/route.ts
import ConnectDB from "@/config/ConnectDB";
import { Batch } from "@/models/Batch";
import { NextRequest, NextResponse } from "next/server";
import type { Batch as BatchType } from "@/types/types.batch";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { parseYear, sanitizeSemesters, toObjectIdIfValid } from "@/lib/batch-validators";

type ListBatchesResponse = {
    data: BatchType[];
    total: number;
};

/* -------------------- GET and POST handlers -------------------- */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
    try {
        await ConnectDB();

        const userId = getUserIdFromSession();
        if (!userId) return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });

        const docs = (await Batch.find({ deletedAt: null, createdBy: userId }).sort({ createdAt: -1 }).lean()) as unknown as BatchType[];

        const resp: ListBatchesResponse = {
            data: docs,
            total: docs.length,
        };

        return NextResponse.json(resp, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ status: 500, message: "Failed to fetch batches", details: (err as Error)?.message ?? err }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        const userId = getUserIdFromSession();
        if (!userId) return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        if (!body || typeof body !== "object") {
            return NextResponse.json({ status: 400, message: "Invalid request body" }, { status: 400 });
        }
        if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
            return NextResponse.json({ status: 400, message: "Missing required field: name" }, { status: 400 });
        }

        const { value: semestersSanitized, errors: semErrors } = sanitizeSemesters(body.semesters);
        if (semErrors.length > 0) {
            return NextResponse.json({ status: 400, message: "Validation failed", details: semErrors }, { status: 400 });
        }

        const payload: Partial<Record<string, unknown>> = {
            name: String(body.name).trim(),
            program: typeof body.program === "string" && body.program.trim() !== "" ? body.program.trim() : undefined,
            year: parseYear(body.year),
            notes: typeof body.notes === "string" && body.notes.trim() !== "" ? body.notes.trim() : undefined,
            semesters: semestersSanitized,
            createdBy: toObjectIdIfValid(userId),
            updatedBy: toObjectIdIfValid(userId),
        };

        const doc = new Batch(payload);
        await doc.save();

        console.log(doc);

        const saved = (await Batch.findById(doc._id).lean()) as BatchType | null;
        return NextResponse.json({ data: saved, total: saved ? 1 : 0 }, { status: 201 });
    } catch (err: unknown) {
        return NextResponse.json({ status: 500, message: "Failed to create batch", details: (err as Error)?.message ?? err }, { status: 500 });
    }
}

// src/app/api/batches/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/config/ConnectDB";
import { Batch } from "@/models/Batch";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { parseYear, sanitizeSemesters, toObjectIdIfValid } from "@/lib/batch-validators";

/* -------------------- Route handlers: GET / PUT / DELETE -------------------- */

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await ConnectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ status: 400, message: "Invalid id" }, { status: 400 });
    }

    try {
        const doc = await Batch.findById(id).lean();
        if (!doc || doc.deletedAt) return NextResponse.json({ status: 404, message: "Batch not found" }, { status: 404 });
        return NextResponse.json({ data: doc }, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ status: 500, message: "Failed to fetch batch", details: (err as Error)?.message ?? err }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await ConnectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ status: 400, message: "Invalid id" }, { status: 400 });
    }

    try {
        const userId = getUserIdFromSession();
        if (!userId) return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });

        const raw = await req.json().catch(() => ({}));
        if (!raw || typeof raw !== "object") {
            return NextResponse.json({ status: 400, message: "Invalid request body" }, { status: 400 });
        }

        // Whitelist fields and validate them
        const updates: Record<string, unknown> = {};

        if ("name" in raw) {
            if (typeof raw.name !== "string" || !raw.name.trim()) return NextResponse.json({ status: 400, message: "Invalid name" }, { status: 400 });
            updates.name = raw.name.trim();
        }

        if ("program" in raw) {
            updates.program = typeof raw.program === "string" && raw.program.trim() !== "" ? raw.program.trim() : null;
        }

        if ("year" in raw) {
            const parsedYear = parseYear(raw.year);
            if (raw.year != null && raw.year !== "" && parsedYear == null) return NextResponse.json({ status: 400, message: "Invalid year" }, { status: 400 });
            updates.year = parsedYear ?? null;
        }

        if ("notes" in raw) {
            updates.notes = typeof raw.notes === "string" && raw.notes.trim() !== "" ? raw.notes.trim() : null;
        }

        if ("updatedBy" in raw) {
            const oid = toObjectIdIfValid(raw.updatedBy);
            if (raw.updatedBy != null && !oid) return NextResponse.json({ status: 400, message: "Invalid updatedBy id" }, { status: 400 });
            if (oid) updates.updatedBy = oid;
        } else {
            // set session user as updatedBy for audit
            const uid = toObjectIdIfValid(userId);
            if (uid) updates.updatedBy = uid;
        }

        if ("semesters" in raw) {
            const { value: semestersSanitized, errors: semErrors } = sanitizeSemesters(raw.semesters);
            if (semErrors.length > 0) {
                return NextResponse.json({ status: 400, message: "Invalid semesters", details: semErrors }, { status: 400 });
            }
            updates.semesters = semestersSanitized;
        }

        updates.updatedAt = new Date();

        // run validators so enums/min constraints are enforced on nested documents
        const updated = await Batch.findOneAndUpdate({ _id: id }, { $set: updates }, { new: true, runValidators: true, context: "query" }).lean();

        if (!updated) return NextResponse.json({ status: 404, message: "Batch not found" }, { status: 404 });

        return NextResponse.json({ data: updated }, { status: 200 });
    } catch (err: unknown) {
        // type guard for Mongoose ValidationError
        function isMongooseValidationError(e: unknown): e is mongoose.Error.ValidationError {
            return (
                typeof e === "object" &&
                e !== null &&
                (e as { name?: unknown }).name === "ValidationError" &&
                "errors" in (e as object)
            );
        }

        if (isMongooseValidationError(err)) {
            const validationErr = err as mongoose.Error.ValidationError;
            const details = Object.values(validationErr.errors).map((v) => v.message);
            return NextResponse.json({ status: 400, message: "Validation failed", details }, { status: 400 });
        }

        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ status: 500, message: "Failed to update batch", details: message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await ConnectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ status: 400, message: "Invalid id" }, { status: 400 });
    }

    try {
        const raw = await req.json().catch(() => ({}));
        const deletedByRaw = (raw && typeof raw === "object" && "deletedBy" in raw) ? (raw as Record<string, unknown>).deletedBy : undefined;
        const deletedBy = toObjectIdIfValid(typeof deletedByRaw === "string" ? deletedByRaw : undefined);

        const doc = await Batch.findById(id);
        if (!doc || doc.deletedAt) return NextResponse.json({ status: 404, message: "Batch not found" }, { status: 404 });

        doc.deletedAt = new Date();
        if (deletedBy) doc.updatedBy = deletedBy;
        await doc.save();

        return NextResponse.json({ success: true, _id: id }, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ status: 500, message: "Failed to delete batch", details: (err as Error)?.message ?? err }, { status: 500 });
    }
}

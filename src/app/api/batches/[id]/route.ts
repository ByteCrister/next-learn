// src/app/api/batches/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/config/ConnectDB";
import { Batch } from "@/models/Batch";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await ConnectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ status: 400, message: "Invalid id" }, { status: 400 });
    }

    try {
        const doc = await Batch.findById(id).lean();
        if (!doc || doc.deletedAt) {
            return NextResponse.json({ status: 404, message: "Batch not found" }, { status: 404 });
        }
        return NextResponse.json({ data: doc }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ status: 500, message: "Failed to fetch batch", details: err }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await ConnectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ status: 400, message: "Invalid id" }, { status: 400 });
    }

    try {
        const body = await req.json();
        // allow partial updates; prevent replacing _id
        delete body._id;

        const updates: Record<string, unknown> = {};
        if (typeof body.name === "string") updates.name = body.name.trim();
        if ("program" in body) updates.program = body.program ?? null;
        if ("year" in body) updates.year = body.year ?? null;
        if ("notes" in body) updates.notes = body.notes ?? null;
        if ("semesters" in body && Array.isArray(body.semesters)) updates.semesters = body.semesters;
        if ("updatedBy" in body) updates.updatedBy = body.updatedBy;

        updates.updatedAt = new Date();

        const updated = await Batch.findOneAndUpdate({ _id: id }, { $set: updates }, { new: true }).lean();
        if (!updated) {
            return NextResponse.json({ status: 404, message: "Batch not found" }, { status: 404 });
        }

        return NextResponse.json({ data: updated }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ status: 500, message: "Failed to update batch", details: err }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await ConnectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ status: 400, message: "Invalid id" }, { status: 400 });
    }

    try {
        const body = await req.json().catch(() => ({}));
        const deletedBy = body.deletedBy ?? undefined;

        const doc = await Batch.findById(id);
        if (!doc || doc.deletedAt) {
            return NextResponse.json({ status: 404, message: "Batch not found" }, { status: 404 });
        }

        doc.deletedAt = new Date();
        if (deletedBy) doc.updatedBy = deletedBy;
        await doc.save();

        return NextResponse.json({ success: true, _id: id }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ status: 500, message: "Failed to delete batch", details: err }, { status: 500 });
    }
}

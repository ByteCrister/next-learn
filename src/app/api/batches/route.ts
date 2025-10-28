// src/app/api/batches/route.ts
import ConnectDB from "@/config/ConnectDB";
import { Batch } from "@/models/Batch";
import { NextRequest, NextResponse } from "next/server";
import type { Batch as BatchType } from "@/types/types.batch";

type ListBatchesResponse = {
    data: BatchType[];
    total: number;
    page: number;
    pageSize: number;
};

export async function GET(req: NextRequest) {
    await ConnectDB();

    try {
        const url = new URL(req.url);
        const all = url.searchParams.get("all");
        const page = Number(url.searchParams.get("page") ?? 1);
        const pageSize = Number(url.searchParams.get("pageSize") ?? 0);
        const q = url.searchParams.get("q") ?? "";

        if (all === "true") {
            const docs = (await Batch.find({ deletedAt: null }).sort({ createdAt: -1 }).lean()) as unknown as BatchType[];
            const resp: ListBatchesResponse = {
                data: docs,
                total: docs.length,
                page: 1,
                pageSize: docs.length,
            };
            return NextResponse.json(resp, { status: 200 });
        }

        // simple paginated list (fallback)
        const filter: Partial<Record<string, unknown>> = { deletedAt: null };
        if (q) filter.name = { $regex: q, $options: "i" };

        const skip = pageSize > 0 ? (page - 1) * pageSize : 0;
        const query = Batch.find(filter).sort({ createdAt: -1 });
        if (pageSize > 0) query.skip(skip).limit(pageSize);
        const [docs, total] = await Promise.all([query.lean() as unknown as Promise<BatchType[]>, Batch.countDocuments(filter)]);
        const resp: ListBatchesResponse = { data: docs, total, page, pageSize };
        return NextResponse.json(resp, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ status: 500, message: "Failed to fetch batches", details: err }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await ConnectDB();

    try {
        const body = await req.json();
        if (!body || typeof body.name !== "string" || !body.name.trim()) {
            return NextResponse.json({ status: 400, message: "Missing required field: name" }, { status: 400 });
        }

        const doc = new Batch({
            name: body.name.trim(),
            program: body.program ?? undefined,
            year: body.year ?? undefined,
            semesters: Array.isArray(body.semesters) ? body.semesters : [],
            notes: body.notes ?? undefined,
            createdBy: body.createdBy ?? undefined,
            updatedBy: body.updatedBy ?? undefined,
        });

        await doc.save();
        const saved = (await Batch.findById(doc._id).lean()) as BatchType | null;

        return NextResponse.json({ data: saved }, { status: 201 });
    } catch (err: unknown) {
        return NextResponse.json({ status: 500, message: "Failed to create batch", details: err }, { status: 500 });
    }
}

// app/api/cron/update-event-status/route.ts
"use server";
import runEventStatusUpdate from "@/lib/cron/runEventStatusUpdate";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
    try {
        const result = await runEventStatusUpdate();
        return NextResponse.json(result, { status: 200 });
    } catch (err: unknown) {
        console.error("cron route error:", err);
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}

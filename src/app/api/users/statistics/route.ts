// /api/users/statistics
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import { Subject } from "@/models/Subject";
import ConnectDB from "@/config/ConnectDB";
import { StudyMaterial } from "@/models/StudyMaterial";
import { Event } from "@/models/Event";
import ExamModel from "@/models/ExamModel";

const ASC = 1 as const;
type IntervalUnit = "day" | "week" | "month" | "year";

const unitMs: Record<IntervalUnit, number> = {
    day: 1000 * 60 * 60 * 24,
    week: 1000 * 60 * 60 * 24 * 7,
    month: 1000 * 60 * 60 * 24 * 30, // approx for bucketing
    year: 1000 * 60 * 60 * 24 * 365,
};

export async function GET(req: NextRequest) {
    let message = "Something went wrong";

    try {
        await ConnectDB();
        const { searchParams } = new URL(req.url);

        const start = searchParams.get("start");
        const end = searchParams.get("end");
        const intervalParam = searchParams.get("interval");
        const validIntervals: IntervalUnit[] = ["day", "week", "month", "year"];
        const interval: IntervalUnit = validIntervals.includes(intervalParam as IntervalUnit)
            ? (intervalParam as IntervalUnit)
            : "day"; // day, week, month, year
        const intervalCount = parseInt(searchParams.get("count") || "1", 10); // e.g., 2 days, 3 weeks

        if (!start || !end) {
            return NextResponse.json({ message: "Start and end dates are required" }, { status: 400 });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (!unitMs[interval]) {
            return NextResponse.json({ message: "Invalid interval" }, { status: 400 });
        }

        const bucketSizeMs = unitMs[interval] * intervalCount;

        // Function to build aggregation for any model
        const buildStatsPipeline = (dateField: string) => [
            {
                $match: {
                    [dateField]: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $addFields: {
                    bucketIndex: {
                        $floor: {
                            $divide: [
                                { $subtract: [`$${dateField}`, startDate] },
                                bucketSizeMs,
                            ],
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$bucketIndex",
                    count: { $sum: 1 },
                    minDate: { $min: `$${dateField}` },
                    maxDate: { $max: `$${dateField}` },
                },
            },
            { $sort: { _id: ASC } },
        ];

        // Run stats for users and subjects
        const [userStats, subjectStats, materialStats, eventStats, examStats] = await Promise.all([
            User.aggregate(buildStatsPipeline("createdAt")),
            Subject.aggregate(buildStatsPipeline("createdAt")),
            StudyMaterial.aggregate(buildStatsPipeline("createdAt")),
            Event.aggregate(buildStatsPipeline("createdAt")),
            ExamModel.aggregate(buildStatsPipeline("createdAt")),
        ]);

        return NextResponse.json({
            range: { start: startDate, end: endDate },
            interval: `${intervalCount} ${interval}${intervalCount > 1 ? "s" : ""}`,
            stats: {
                users: userStats,
                subjects: subjectStats,
                material: materialStats,
                event: eventStats,
                exam: examStats
            },
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            message = error.message || message;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}
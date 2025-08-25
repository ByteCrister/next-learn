// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isValidObjectId, Types } from "mongoose";

import ConnectDB from "@/config/ConnectDB";
import { getUserIdFromSession } from "@/utils/helpers/session";

import { User } from "@/models/User";
import { Event } from "@/models/Event";
import { DashboardData } from "@/types/types.dashboard";
import { Subject } from "@/models/Subject";
import { Routine } from "@/models/Routine";
import ExamModel from "@/models/ExamModel";
import { VEventOverview } from "@/types/types.events";

function errorResponse(
    message: string = "Internal Server Error",
    status: number = 500
) {
    return NextResponse.json({ message }, { status });
}

export async function GET() {
    try {
        const userId = await getUserIdFromSession();

        if (!isValidObjectId(userId)) {
            return errorResponse("Invalid user ID", 400);
        }
        await ConnectDB();
        const objectUserId = new Types.ObjectId(userId);
        // fetch counts + next 5 events as plain objects
        const [subjectsCount, routineCount, examCount, eventsDocs] =
            await Promise.all([
                Subject.countDocuments({ userId: objectUserId }),
                Routine.countDocuments({ userId: objectUserId }),
                ExamModel.countDocuments({ createdBy: objectUserId }),
                Event.find({ userId: objectUserId, start: { $gte: new Date() } })
                    .sort({ start: 1 })
                    .limit(5)
                    .select('_id title start description durationMinutes allDay')
                    .lean<VEventOverview[]>(),
            ]);

        // map ObjectId → string
        const upcomingEvents = eventsDocs.map((evt) => ({
            _id: evt._id?.toString(),
            title: evt.title,
            start: evt.start,
            description: evt.description,
            durationMinutes: evt.durationMinutes,
            allDay: evt.allDay,
        }));


        const payload: DashboardData = {
            subjectsCount,
            routineCount,
            examCount,
            upcomingEvents,
        };

        return NextResponse.json(payload, { status: 200 });
    } catch (err: unknown) {
        console.error("GET /api/dashboard error:", err);
        return errorResponse();
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const userId = await getUserIdFromSession();
        await ConnectDB();

        const { name, image, currentPassword, newPassword } =
            await request.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // update basic fields
        if (name) user.name = name;
        if (image) user.image = image;

        // handle password change
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { message: "Current password is required" },
                    { status: 400 }
                );
            }

            const isMatch = user.passwordHash
                ? await bcrypt.compare(currentPassword, user.passwordHash)
                : false;

            if (!isMatch) {
                return NextResponse.json(
                    { message: "Current password is incorrect" },
                    { status: 400 }
                );
            }

            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        // return safe user object
        const safeUser = {
            _id: (user._id as Types.ObjectId).toString(),
            name: user.name,
            email: user.email,
            image: user.image,
        };

        return NextResponse.json(safeUser, { status: 200 });
    } catch (err: unknown) {
        console.error("PATCH /api/dashboard error:", err);
        return errorResponse();
    }
}

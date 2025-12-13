// api/user/route.ts
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import ConnectDB from "@/config/ConnectDB";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { User } from "@/models/User";

async function getUserData(userId: string) {
    await ConnectDB();

    const rawUser = await User.findById(userId)
        .select("_id name email image role")
        .lean();

    if (!rawUser) {
        throw new Error("User not found");
    }

    return {
        _id: rawUser._id.toString(),
        name: rawUser.name,
        email: rawUser.email,
        image: rawUser.image,
        role: rawUser.role,
    };
}

export async function GET() {
    try {
        const userId = await getUserIdFromSession();

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!isValidObjectId(userId)) {
            return NextResponse.json(
                { message: "Invalid user ID" },
                { status: 400 }
            );
        }

        const user = await getUserData(userId);
        return NextResponse.json(user, { status: 200 });

    } catch (err) {
        console.error("GET /api/user error:", err);

        if (err instanceof Error && err.message === "User not found") {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}  
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import ConnectDB from "@/config/ConnectDB";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { User } from "@/models/User";

function errorResponse(message = "Internal Server Error", status = 500) {
    return NextResponse.json({ message }, { status });
}

export async function GET() {
    try {
        const userId = await getUserIdFromSession();

        if (!isValidObjectId(userId)) {
            return errorResponse("Invalid user ID", 400);
        }

        await ConnectDB();

        const rawUser = await User.findById(userId)
            .select("_id name email image role")
            .lean();

        if (!rawUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const user = {
            _id: rawUser._id.toString(),
            name: rawUser.name,
            email: rawUser.email,
            image: rawUser.image,
            role: rawUser.role,
        };

        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        console.error("GET /api/user error:", err);
        return errorResponse();
    }
}

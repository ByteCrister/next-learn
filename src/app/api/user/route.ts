import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { unstable_cache } from "next/cache";
import ConnectDB from "@/config/ConnectDB";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { User } from "@/models/User";

function errorResponse(message = "Internal Server Error", status = 500) {
    return NextResponse.json({ message }, { status });
}

const getUserData = unstable_cache(
    async (userId: string) => {
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
    },
    ["user-data"],
    { revalidate: 300 } // Cache for 5 minutes
);

export async function GET() {
    try {
        const userId = await getUserIdFromSession();

        if (!isValidObjectId(userId)) {
            return errorResponse("Invalid user ID", 400);
        }

        const user = await getUserData(userId);
        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        console.error("GET /api/user error:", err);
        if (err instanceof Error && err.message === "User not found") {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return errorResponse();
    }
}

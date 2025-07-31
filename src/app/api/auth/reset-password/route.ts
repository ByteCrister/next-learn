import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/config/ConnectDB";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        // 1) parse + validate
        const { email, newPassword } = await req.json();
        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof newPassword !== "string" ||
            newPassword.length < 6
        ) {
            return NextResponse.json(
                {
                    error:
                        "Email is required and newPassword must be at least 6 characters",
                },
                { status: 400 }
            );
        }

        // 2) connect + lookup
        await ConnectDB();
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // 3) hash + save
        user.passwordHash = await bcrypt.hash(newPassword, 12);
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password reset successful",
        });
    } catch (err) {
        console.error("POST /api/auth/reset-password error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import { PendingUser } from "@/models/PendingUser";
import { User } from "@/models/User";
import crypto from "crypto";
import ConnectDB from "@/config/ConnectDB";
import { SendEmail } from "@/config/NodeEmailer";
import { HTMLContent } from "@/utils/html/html.signup.otp";

export async function POST(req: Request) {
    try {
        await ConnectDB();
        const { email, name } = await req.json();

        if (!email || !name) {
            return NextResponse.json(
                { message: "Email and name required" },
                { status: 400 }
            );
        }

        // check if already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 1 * 60 * 1000 + 5000); // 1 minutes + 5 seconds buffer

        // upsert pending user
        const pendingUser = await PendingUser.findOneAndUpdate(
            { email },
            { name, email, otp, otpExpires },
            { upsert: true, new: true }
        );
        const subject = "Your password reset code";
        await SendEmail(email, subject, HTMLContent(otp));

        return NextResponse.json({
            message: "OTP sent to email",
            otpExpiresAt: pendingUser.otpExpires.toISOString(),
        });
    } catch (err) {
        console.error("Error creating pending user:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

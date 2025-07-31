import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/config/ConnectDB";
import { User } from "@/models/User";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { getOtpHTML } from "@/utils/html/getOtpHTML";
import { SendEmail } from "@/config/NodeEmailer";

export async function POST(req: NextRequest) {
    try {
        // 1) parse + validate input
        const { email } = await req.json();
        if (typeof email !== "string" || !email.trim()) {
            return NextResponse.json(
                { error: "A valid email is required" },
                { status: 400 }
            );
        }

        // 2) connect to DB
        await ConnectDB();

        // 3) lookup user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User with that email not found" },
                { status: 404 }
            );
        }

        // 4) throttle
        const now = Date.now();
        if (
            user.lastOTPSentAt &&
            now - user.lastOTPSentAt.getTime() < 30 * 1000
        ) {
            return NextResponse.json(
                { error: "Please wait 30s before requesting a new OTP" },
                { status: 429 }
            );
        }

        // 5) generate + save OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        user.resetPasswordOTP = await bcrypt.hash(otp, 10);
        user.resetPasswordOTPExpires = new Date(now + 3 * 60 * 1000); // 3m
        user.resetPasswordOTPAttempts = 0;
        user.lastOTPSentAt = new Date(now);
        await user.save();

        // 6) send email
        const subject = "Your password reset code";
        await SendEmail(email, subject, getOtpHTML(otp));

        return NextResponse.json({ success: true, message: "OTP sent" });
    } catch (err) {
        console.error("POST /api/auth/request-otp error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
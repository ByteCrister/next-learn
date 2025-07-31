import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/config/ConnectDB";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        // 1) parse + validate
        const { email, otp } = await req.json();
        console.log(`email: ${email} & otp: ${otp}`);
        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof otp !== "string" ||
            otp.length !== 6
        ) {
            return NextResponse.json(
                { error: "Email and 6-digit OTP are required" },
                { status: 400 }
            );
        }

        // 2) connect + find
        await ConnectDB();
        const user = await User.findOne({ email });
        if (!user || !user.resetPasswordOTP) {
            return NextResponse.json(
                { error: "No OTP request found for this user" },
                { status: 400 }
            );
        }

        // 3) expired?
        if (user.resetPasswordOTPExpires! < new Date()) {
            return NextResponse.json({ error: "OTP has expired" }, { status: 410 });
        }

        // 4) verify
        console.log(`resetPasswordOTP: ${user.resetPasswordOTP}`);
        const match = await bcrypt.compare(otp, user.resetPasswordOTP);
        if (!match) {
            user.resetPasswordOTPAttempts = (user.resetPasswordOTPAttempts || 0) + 1;
            await user.save();
            return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
        }

        // 5) clear OTP fields
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        user.resetPasswordOTPAttempts = 0;
        await user.save();

        return NextResponse.json({ success: true, message: "OTP verified" });
    } catch (err) {
        console.error("POST /api/auth/verify-otp error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { PendingUser } from "@/models/PendingUser";
import ConnectDB from "@/config/ConnectDB";

export async function POST(req: Request) {
    try {
        await ConnectDB();
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { message: "Email and OTP required" },
                { status: 400 }
            );
        }

        const pending = await PendingUser.findOne({ email });
        if (!pending) {
            return NextResponse.json(
                { message: "No pending registration" },
                { status: 404 }
            );
        }

        if (pending.otp !== otp) {
            return NextResponse.json(
                { message: "Invalid OTP" },
                { status: 400 }
            );
        }

        if (pending.otpExpires < new Date()) {
            await PendingUser.deleteOne({ email });
            return NextResponse.json(
                { message: "OTP expired, please request again" },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: "OTP verified" });
    } catch (err) {
        console.error("Error in OTP verification:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

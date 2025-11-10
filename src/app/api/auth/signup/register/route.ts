import { NextResponse } from "next/server";
import { PendingUser } from "@/models/PendingUser";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import ConnectDB from "@/config/ConnectDB";

export async function POST(req: Request) {
    try {
        await ConnectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password required" },
                { status: 400 }
            );
        }

        const pending = await PendingUser.findOne({ email });
        if (!pending) {
            return NextResponse.json(
                { message: "No OTP verification found" },
                { status: 400 }
            );
        }

        if (pending.otpExpires < new Date()) {
            await PendingUser.deleteOne({ email });
            return NextResponse.json(
                { message: "OTP expired, please start again" },
                { status: 400 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: pending.name,
            email: pending.email,
            passwordHash,
            emailVerified: new Date(),
            provider: "credentials",
            role: 'member'
        });

        // cleanup pending record
        await PendingUser.deleteOne({ email });

        return NextResponse.json({
            message: "User registered successfully",
            userId: newUser._id,
        });
    } catch (err) {
        console.error("Error during user registration:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

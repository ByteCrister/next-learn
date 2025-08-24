import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import ConnectDB from "@/config/ConnectDB";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        const { email, name, password } = await req.json();

        if (!email || !name || !password) {
            return NextResponse.json(
                { success: false, message: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Hash password provided by form/request
        const passwordHash = await bcrypt.hash(password, 10);

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // Upgrade existing user to admin + update password if provided
            user.role = "admin";
            user.passwordHash = passwordHash;
            await user.save();
        } else {
            // Create a new admin user
            user = await User.create({
                name,
                email,
                passwordHash,
                role: "admin",
            });
        }

        return NextResponse.json({
            success: true,
            message: `User ${user.email} is now an admin`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err: unknown) {
        console.error("Error making admin:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

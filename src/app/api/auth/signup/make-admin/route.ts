import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";     // your User model
import ConnectDB from "@/config/ConnectDB";

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        const { name, email, passwordHash } = await req.json();
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // If exists → update to admin
            user.role = "admin";
            await user.save();
            return NextResponse.json({ message: `User ${email} promoted to admin`, user });
        } else {
            // If not → create new admin
            user = await User.create({
                name: name || "Admin User",
                email,
                passwordHash: passwordHash || null, // hash it before saving in real use
                role: "admin",
                provider: 'credentials'
            });

            return NextResponse.json({ message: `Admin user ${email} created`, user });
        }
    } catch (error) {
        console.error("Error creating admin user:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

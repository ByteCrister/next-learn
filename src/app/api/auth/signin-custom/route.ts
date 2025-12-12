// app/api/auth/signin-custom/route.ts
import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/config/ConnectDB";
import { User as DBUser } from "@/models/User";
import { compare } from "bcryptjs";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    await ConnectDB();
    const user = await DBUser.findOne({ email });
    if (!user) return NextResponse.json({ ok: false, error: "UserNotFound" });
    if (!user.passwordHash) return NextResponse.json({ ok: false, error: "NoPasswordSet" });
    const valid = await compare(password, user.passwordHash!);
    if (!valid) return NextResponse.json({ ok: false, error: "PasswordMismatch" });

    return NextResponse.json({ ok: true, user: { id: user._id, email: user.email } });
}
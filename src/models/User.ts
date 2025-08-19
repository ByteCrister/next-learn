import mongoose, { Document, Model, Schema } from "mongoose";

export type UserRole = "member" | "admin";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash?: string;
    image?: string;
    emailVerified?: Date;
    provider?: string;
    providerAccountId?: string;
    createdAt: Date;
    updatedAt: Date;

    role: UserRole;

    // Password Reset OTP
    resetPasswordOTP?: string;
    resetPasswordOTPExpires?: Date;
    resetPasswordOTPAttempts: number; // default 0
    lastOTPSentAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, default: null },
        image: { type: String, default: null },
        emailVerified: { type: Date, default: null },
        provider: { type: String, default: null },
        providerAccountId: { type: String, default: null },

        role: {
            type: String,
            enum: ["member", "admin"],
            default: "member",
        },

        // Password reset fields
        resetPasswordOTP: { type: String, default: null },
        resetPasswordOTPExpires: { type: Date, default: null },
        resetPasswordOTPAttempts: { type: Number, default: 0 },
        lastOTPSentAt: { type: Date, default: null },
    },
    { timestamps: true }
);

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", userSchema);

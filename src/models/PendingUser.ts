import mongoose, { Schema, Document, Model } from "mongoose";

interface IPendingUser extends Document {
    email: string;
    name: string;
    otp: string;
    otpExpires: Date;
    createdAt: Date;
}

const pendingUserSchema = new Schema<IPendingUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true, index: { expires: 0 } },
    // ^ TTL index -> will auto-delete when otpExpires < now
},
    { timestamps: true }
);

// TTL works if otpExpires is set to a Date in the future
export const PendingUser: Model<IPendingUser> =
    mongoose.models.PendingUser || mongoose.model<IPendingUser>("PendingUser", pendingUserSchema);

// /models/User.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash?: string;         // now optional
    image?: string;                // OAuth profile picture
    emailVerified?: Date;          // when OAuth email was verified
    provider?: string;             // e.g. "google"
    providerAccountId?: string;    // unique OAuth account ID
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: false },
        image: { type: String },
        emailVerified: { type: Date },
        provider: { type: String },
        providerAccountId: { type: String }
    },
    { timestamps: true }
);

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", userSchema);
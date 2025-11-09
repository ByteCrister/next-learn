import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface ISubject extends Document {
    userId: Types.ObjectId;
    title: string;
    code: string; // e.g., CSE-412
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, trim: true },
        code: { type: String, required: true, trim: true },
        description: { type: String },
    },
    { timestamps: true }
);

// Add index on userId for faster queries
subjectSchema.index({ userId: 1 });

export const Subject: Model<ISubject> =
    mongoose.models.Subject || mongoose.model<ISubject>("Subject", subjectSchema);

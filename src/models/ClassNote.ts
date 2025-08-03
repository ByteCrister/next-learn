import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface IClassNote extends Document {
    userId: Types.ObjectId;
    subjectId: Types.ObjectId;
    title?: string;
    date: Date;
    content: string; // HTML or markdown
    attachments: string[]; // image URLs or file links
    createdAt: Date;
    updatedAt: Date;
}

const classNoteSchema = new Schema<IClassNote>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
        title: { type: String },
        date: { type: Date, required: true },
        content: { type: String, required: true },
        attachments: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const ClassNote: Model<IClassNote> =
    mongoose.models.ClassNote || mongoose.model<IClassNote>("ClassNote", classNoteSchema);

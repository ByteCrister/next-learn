// models/ClassNote.ts
import mongoose, { Document, Schema, Types, Model } from "mongoose";
import { TipTapJSON } from "./CourseRoadmap";

export interface IAttachment {
    title: string;
    description?: string;
    mimeType: string;
    data: Buffer;           // binary data
}

export interface IClassNote extends Document {
    userId: Types.ObjectId;
    subjectId: Types.ObjectId;
    title?: string;
    date: Date;
    content: TipTapJSON;        // HTML
    attachments: IAttachment[];
    createdAt: Date;
    updatedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>({
    title: { type: String, required: true },
    description: { type: String },
    mimeType: { type: String, required: true },
    data: { type: Buffer, required: true },
});

const classNoteSchema = new Schema<IClassNote>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
        title: { type: String },
        date: { type: Date, required: true },
        content: {},
        attachments: { type: [attachmentSchema], default: [] },
    },
    { timestamps: true }
);

export const ClassNote: Model<IClassNote> =
    mongoose.models.ClassNote ||
    mongoose.model<IClassNote>("ClassNote", classNoteSchema);

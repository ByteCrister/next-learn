import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface IAttachment {
    title: string;
    description?: string;
    mimeType: string;
    data: Buffer;           // binary data
}

export interface ISubjectNote extends Document {
    userId: Types.ObjectId;
    subjectId: Types.ObjectId;
    title?: string;
    content: string;        // HTML
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

const subjectNoteSchema = new Schema<ISubjectNote>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
        title: { type: String },
        content: { type: String, required: true },
        attachments: { type: [attachmentSchema], default: [] },
    },
    { timestamps: true }
);

export const SubjectNote: Model<ISubjectNote> =
    mongoose.models.SubjectNote ||
    mongoose.model<ISubjectNote>("SubjectNote", subjectNoteSchema);

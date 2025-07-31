// /models/StudyMaterial.ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type FileType = "pdf" | "ppt" | "image" | "other";

export interface IStudyMaterial extends Document {
    userId: Types.ObjectId;
    roadmapId?: Types.ObjectId;
    filename: string;
    url: string;
    fileType: FileType;
    tags: string[];
    uploadedAt: Date;
}

const studyMaterialSchema = new Schema<IStudyMaterial>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        roadmapId: { type: Schema.Types.ObjectId, ref: "CourseRoadmap" },
        filename: { type: String, required: true },
        url: { type: String, required: true },
        fileType: { type: String, enum: ["pdf", "ppt", "image", "other"], default: "other" },
        tags: { type: [String], default: [] },
        uploadedAt: { type: Date, default: () => new Date() },
    },
    { timestamps: false }
);

export const StudyMaterial: Model<IStudyMaterial> =
    mongoose.models.StudyMaterial ||
    mongoose.model<IStudyMaterial>("StudyMaterial", studyMaterialSchema);

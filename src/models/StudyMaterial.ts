import mongoose, { Document, Schema, Types, Model } from "mongoose";

export type FileType = "pdf" | "ppt" | "image" | "other";

export interface IStudyMaterial extends Document {
    userId: Types.ObjectId;
    subjectId?: Types.ObjectId;
    roadmapId?: Types.ObjectId;
    filename: string;
    urls: string[];
    fileTypes: FileType[];
    tags: string[];
    description?: string;
    visibility: "private" | "public";
    uploadedAt: Date;
}

const studyMaterialSchema = new Schema<IStudyMaterial>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
        roadmapId: { type: Schema.Types.ObjectId, ref: "CourseRoadmap" },
        filename: { type: String, required: true },
        urls: { type: [String], required: true },
        fileTypes: [{
            type: String,
            enum: ["pdf", "ppt", "image", "other"],
        }],
        tags: { type: [String], default: [] },
        description: { type: String },
        visibility: { type: String, enum: ["private", "public"], default: "private" },
        uploadedAt: { type: Date, default: () => new Date() },
    },
    { timestamps: false }
);

// Add index on userId for faster queries
studyMaterialSchema.index({ userId: 1 });

if (mongoose.models.StudyMaterial) {
    delete mongoose.models.StudyMaterial;
}

export const StudyMaterial: Model<IStudyMaterial> =
    mongoose.model<IStudyMaterial>("StudyMaterial", studyMaterialSchema);

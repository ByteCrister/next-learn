// /models/CourseRoadmap.ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IMilestone {
    title: string;
    description?: string;
    date: Date;
}

export interface ICourseRoadmap extends Document {
    userId: Types.ObjectId;
    title: string;
    description?: string;
    items: IMilestone[];
    createdAt: Date;
    updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String },
        date: { type: Date, required: true },
    },
    { _id: false }
);

const roadmapSchema = new Schema<ICourseRoadmap>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String },
        items: { type: [MilestoneSchema], default: [] },
    },
    { timestamps: true }
);

export const CourseRoadmap: Model<ICourseRoadmap> =
    mongoose.models.CourseRoadmap ||
    mongoose.model<ICourseRoadmap>("CourseRoadmap", roadmapSchema);

import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface ISubChapter {
    title: string;
    description?: string;
}

export interface IChapter {
    title: string;
    description?: string;
    subChapters: ISubChapter[];
}

export interface ICourseRoadmap extends Document {
    userId: Types.ObjectId;
    subjectId?: Types.ObjectId;
    title: string;
    description?: string;
    chapters: IChapter[];
    createdAt: Date;
    updatedAt: Date;
}

const subChapterSchema = new Schema<ISubChapter>(
    {
        title: { type: String, required: true },
        description: { type: String },
    },
    { _id: false }
);

const chapterSchema = new Schema<IChapter>(
    {
        title: { type: String, required: true },
        description: { type: String },
        subChapters: { type: [subChapterSchema], default: [] },
    },
    { _id: false }
);

const courseRoadmapSchema = new Schema<ICourseRoadmap>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
        title: { type: String, required: true },
        description: { type: String },
        chapters: { type: [chapterSchema], default: [] },
    },
    { timestamps: true }
);

export const CourseRoadmap: Model<ICourseRoadmap> =
    mongoose.models.CourseRoadmap ||
    mongoose.model<ICourseRoadmap>("CourseRoadmap", courseRoadmapSchema);

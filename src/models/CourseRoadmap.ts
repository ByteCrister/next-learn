import { Schema, Types, model, models, Document, Model } from "mongoose";
import { JSONContent } from "@tiptap/react"; // or '@tiptap/core'

export type TipTapJSON = JSONContent;

/** StudyMaterial sub-document */
export interface IStudyMaterial {
    name: string;
    type: string;
    data: string; // base64 or URL
}


/** Chapter interface, top-level subchapter container */
export interface IChapter {
    _id?: Types.ObjectId;
    title: string;
    content: TipTapJSON;
    subjectId: Types.ObjectId;
    materials: IStudyMaterial[];
}

/** Top-level CourseRoadmap */
export interface ICourseRoadmap extends Document {
    title: string;
    description: string;
    roadmap: TipTapJSON;
    subjectId: Types.ObjectId;
    chapters: IChapter[];
}

/** Schemas */

const StudyMaterialSchema = new Schema<IStudyMaterial>({
    name: String,
    type: String,
    data: String,
}, { _id: true });

const ChapterSchema = new Schema<IChapter>({
    title: { type: String, required: true },
    content: { type: Schema.Types.Mixed },
    materials: { type: [StudyMaterialSchema], default: [] },
}, { _id: true });

const CourseRoadmapSchema = new Schema<ICourseRoadmap>({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    roadmap: { type: Schema.Types.Mixed },
    subjectId: { type: Schema.Types.ObjectId, required: true, ref: "Subject" },
    chapters: { type: [ChapterSchema], default: [] },
});

/** Export the model */
export const CourseRoadmap: Model<ICourseRoadmap> =
    (models.CourseRoadmap as Model<ICourseRoadmap>) ||
    model<ICourseRoadmap>("CourseRoadmap", CourseRoadmapSchema);

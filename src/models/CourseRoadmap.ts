import { Schema, Types, model, models, Document, Model } from "mongoose";
import { JSONContent } from "@tiptap/react"; // or '@tiptap/core'

export type TipTapJSON = JSONContent;

/** Chapter interface **/
export interface IChapter {
    _id?: Types.ObjectId;
    title: string;
    content: TipTapJSON;
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

const ChapterSchema = new Schema<IChapter>({
    title: { type: String, required: true },
    content: { type: Schema.Types.Mixed },
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

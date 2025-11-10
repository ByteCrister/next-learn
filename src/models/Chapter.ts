import { Schema, Types, model, models, Document, Model } from "mongoose";
import { JSONContent } from "@tiptap/react";

export type TipTapJSON = JSONContent;

/** Chapter interface **/
export interface IChapter extends Document {
    title: string;
    content: TipTapJSON;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    materials?: any[];
    roadmapId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

/** Schema */
const ChapterSchema = new Schema<IChapter>({
    title: { type: String, required: true },
    content: { type: Schema.Types.Mixed },
    materials: { type: [Schema.Types.Mixed], default: [] },
    roadmapId: { type: Schema.Types.ObjectId, required: true, ref: "CourseRoadmap" },
}, { timestamps: true });

/** Export the model */
export const Chapter: Model<IChapter> =
    (models.Chapter as Model<IChapter>) ||
    model<IChapter>("Chapter", ChapterSchema);

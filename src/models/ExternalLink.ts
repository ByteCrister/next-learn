// /models/ExternalLink.ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type LinkCategory = "Article" | "Video" | "Tool" | "Other";

export interface IExternalLink extends Document {
    userId: Types.ObjectId;
    url: string;
    title: string;
    description?: string;
    category: LinkCategory;
    addedAt: Date;
}

const externalLinkSchema = new Schema<IExternalLink>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        url: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        category: { type: String, enum: ["Article", "Video", "Tool", "Other"], default: "Other" },
        addedAt: { type: Date, default: () => new Date() },
    },
    { timestamps: false }
);

export const ExternalLink: Model<IExternalLink> =
    mongoose.models.ExternalLink ||
    mongoose.model<IExternalLink>("ExternalLink", externalLinkSchema);

// models/ExternalLink.ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type LinkCategory =
    | "Article"
    | "Blog Post"
    | "Video"
    | "Podcast"
    | "Audio Clip"
    | "Tool"
    | "Library"
    | "Code Repository"
    | "Documentation"
    | "Tutorial"
    | "Webinar"
    | "Presentation"
    | "Infographic"
    | "Dataset"
    | "Whitepaper"
    | "E-book"
    | "Forum Thread"
    | "Social Media"
    | "Other";

export interface IExternalLink extends Document {
    userId: Types.ObjectId;
    subjectId?: Types.ObjectId;
    url: string;
    title: string;
    description?: string;
    category: LinkCategory;
    visibility: "private" | "public";
    addedAt: Date;
    isNew: boolean;
}

const externalLinkSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
        url: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        category: {
            type: String,
            enum: [
                "Article",
                "Blog Post",
                "Video",
                "Podcast",
                "Audio Clip",
                "Tool",
                "Library",
                "Code Repository",
                "Documentation",
                "Tutorial",
                "Webinar",
                "Presentation",
                "Infographic",
                "Dataset",
                "Whitepaper",
                "E-book",
                "Forum Thread",
                "Social Media",
                "Other",
            ],
            default: "Other",
        },
        visibility: { type: String, enum: ["private", "public"], default: "private" },
        addedAt: { type: Date, default: () => new Date() },
        isNew: { type: Boolean, default: true },
    },
    { timestamps: false, suppressReservedKeysWarning: true }
);

// Add index on userId for faster queries
externalLinkSchema.index({ userId: 1 });

export const ExternalLink: Model<IExternalLink> =
    mongoose.models.ExternalLink ||
    mongoose.model<IExternalLink>("ExternalLink", externalLinkSchema);

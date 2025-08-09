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
    addedAt: Date;
}

const externalLinkSchema = new Schema<IExternalLink>(
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
        addedAt: { type: Date, default: () => new Date() },
    },
    { timestamps: false }
);

export const ExternalLink: Model<IExternalLink> =
    mongoose.models.ExternalLink ||
    mongoose.model<IExternalLink>("ExternalLink", externalLinkSchema);
